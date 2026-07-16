import { useRef, useMemo, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { strokesFor } from "../../lib/letterStrokes";
import { COLORS } from "../../lib/tokens";

export type ArmPhase = "writing" | "follow";

interface ArmSceneProps {
  codeLines: string[];
  onPhaseChange?: (phase: ArmPhase) => void;
}

// ---- layout constants (world units) ----
// Code panel sits on the right so it clears the hero headline on the left.
const CHAR_W = 0.2;
const CHAR_H = 0.36;
const LINE_H = 0.46;
const PANEL_ORIGIN = new THREE.Vector3(1.1, 1.35, 0);
// Target wall-clock time for the full writing sequence, regardless of
// snippet length. A fixed points/sec rate was measured to take 30-40s for
// a ~110-character snippet -- far too long for a hero. Speed is now derived
// from the actual segment count so this stays roughly constant if the
// snippet text changes later.
const TARGET_WRITE_DURATION = 3.5; // seconds

interface QueueEntry {
  points: THREE.Vector3[];
  skip?: boolean;
}

function buildStrokeQueue(lines: string[]): QueueEntry[] {
  const queue: QueueEntry[] = [];
  lines.forEach((line, lineIdx) => {
    for (let col = 0; col < line.length; col++) {
      const ch = line[col];
      const x = PANEL_ORIGIN.x + col * CHAR_W;
      const y = PANEL_ORIGIN.y - lineIdx * LINE_H;
      const strokes = strokesFor(ch);
      if (strokes.length === 0) {
        queue.push({ points: [], skip: true });
        continue;
      }
      strokes.forEach((stroke) => {
        const pts = stroke.map(
          ([lx, ly]) =>
            new THREE.Vector3(x + lx * CHAR_W * 0.8, y + ly * CHAR_H, 0.01)
        );
        queue.push({ points: pts });
      });
    }
  });
  return queue;
}

// 2-link IK solver in the XY plane.
function solveIK(
  base: THREE.Vector3,
  L1: number,
  L2: number,
  target: THREE.Vector3
) {
  const dx = target.x - base.x;
  const dy = target.y - base.y;
  let dist = Math.hypot(dx, dy);
  const maxReach = L1 + L2 - 0.01;
  const minReach = Math.abs(L1 - L2) + 0.01;
  dist = Math.min(Math.max(dist, minReach), maxReach);

  const cosA1 = (L1 * L1 + dist * dist - L2 * L2) / (2 * L1 * dist);
  const a1 = Math.acos(Math.min(1, Math.max(-1, cosA1)));
  const baseAngle = Math.atan2(dy, dx);
  const shoulderAngle = baseAngle + a1;

  const elbow = new THREE.Vector3(
    base.x + Math.cos(shoulderAngle) * L1,
    base.y + Math.sin(shoulderAngle) * L1,
    0
  );

  const dir2 = new THREE.Vector3(target.x - elbow.x, target.y - elbow.y, 0);
  const d2len = dir2.length() || 0.0001;
  dir2.multiplyScalar(L2 / d2len);
  const wrist = new THREE.Vector3(
    elbow.x + dir2.x,
    elbow.y + dir2.y,
    target.z || 0
  );

  return { elbow, wrist };
}

// Orients a unit-height cylinder mesh (default axis +Y) so it spans from
// point a to point b: repositions to the segment midpoint and rotates its
// local Y axis to match the segment direction.
const Y_AXIS = new THREE.Vector3(0, 1, 0);
function orientBone(mesh: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3) {
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a).normalize();
  mesh.quaternion.setFromUnitVectors(Y_AXIS, dir);
}

export default function ArmScene({ codeLines, onPhaseChange }: ArmSceneProps) {
  const { camera, gl } = useThree();

  const base = useMemo(() => new THREE.Vector3(4.0, -1.5, 0), []);
  const L1 = 2.1;
  const L2 = 1.9;

  const upperRef = useRef<THREE.Mesh>(null!);
  const foreRef = useRef<THREE.Mesh>(null!);
  const shoulderPinRef = useRef<THREE.Mesh>(null!);
  const elbowRef = useRef<THREE.Mesh>(null!);
  const wristRef = useRef<THREE.Mesh>(null!);
  const toolGroupRef = useRef<THREE.Group>(null!);
  const strokeGroupRef = useRef<THREE.Group>(null!);
  const currentLineRef = useRef<THREE.Line | null>(null);

  // Dynamically created stroke Lines (one geometry+material per stroke) are
  // never disposed as they're added -- that's intentional, they need to
  // persist visibly as "drawn" strokes. But on unmount (hot-reload, future
  // SPA route changes) the whole group's GPU resources must be released.
  useEffect(() => {
    const group = strokeGroupRef.current;
    return () => {
      group?.traverse((obj) => {
        if (obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
    };
  }, []);

  const currentTarget = useRef(new THREE.Vector3(base.x - 2, base.y + 1.5, 0));
  const mouseNDC = useRef(new THREE.Vector2(0, 0));

  const queue = useMemo(() => buildStrokeQueue(codeLines), [codeLines]);
  const drawSpeed = useMemo(() => {
    const totalSegments = queue.reduce(
      (sum, entry) => sum + Math.max(0, entry.points.length - 1),
      0
    );
    return totalSegments > 0 ? totalSegments / TARGET_WRITE_DURATION : 9;
  }, [queue]);
  const qIndexRef = useRef(0);
  const activePointsRef = useRef<THREE.Vector3[]>([]);
  const segProgressRef = useRef(0);
  const phaseRef = useRef<ArmPhase>("writing");

  const advanceQueue = useCallback(() => {
    while (
      qIndexRef.current < queue.length &&
      queue[qIndexRef.current].skip
    ) {
      qIndexRef.current++;
    }
    if (qIndexRef.current >= queue.length) {
      phaseRef.current = "follow";
      onPhaseChange?.("follow");
      return false;
    }
    const entry = queue[qIndexRef.current];
    activePointsRef.current = entry.points;
    segProgressRef.current = 0;

    // Pre-allocate the full stroke buffer. Newer Three.js refuses to grow a
    // BufferAttribute via setFromPoints(), so we create capacity for every
    // point up front and reveal progress with setDrawRange instead.
    const pts = entry.points;
    const positions = new Float32Array(pts.length * 3);
    for (let i = 0; i < pts.length; i++) {
      positions[i * 3] = pts[i].x;
      positions[i * 3 + 1] = pts[i].y;
      positions[i * 3 + 2] = pts[i].z;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, Math.min(2, pts.length));

    const mat = new THREE.LineBasicMaterial({
      color: COLORS.textPrimary,
      linewidth: 1,
    });
    const line = new THREE.Line(geo, mat);
    strokeGroupRef.current.add(line);
    currentLineRef.current = line;

    qIndexRef.current++;
    return true;
  }, [queue, onPhaseChange]);

  const strokeActiveRef = useRef(false);
  useEffect(() => {
    onPhaseChange?.("writing");
  }, [onPhaseChange]);

  // kick off the first stroke lazily on first frame via ref flag
  const startedRef = useRef(false);

  function projectMouseToWorld(): THREE.Vector3 {
    const vector = new THREE.Vector3(mouseNDC.current.x, mouseNDC.current.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    pos.x = Math.max(1.0, Math.min(pos.x, 6.0));
    pos.y = Math.max(-2.0, Math.min(pos.y, 2.4));
    return pos;
  }

  useEffect(() => {
    const canvas = gl.domElement;
    const handler = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseNDC.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, [gl]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (!startedRef.current) {
      startedRef.current = true;
      strokeActiveRef.current = advanceQueue();
    }

    let target: THREE.Vector3 | null = null;

    if (phaseRef.current === "writing" && strokeActiveRef.current) {
      const pts = activePointsRef.current;
      if (pts.length <= 1) {
        strokeActiveRef.current = advanceQueue();
      } else {
        segProgressRef.current += dt * drawSpeed;
        const totalSegs = pts.length - 1;
        const segIndex = Math.min(Math.floor(segProgressRef.current), totalSegs - 1);
        const segT = Math.min(1, segProgressRef.current - segIndex);
        const a = pts[Math.min(segIndex, totalSegs)];
        const b = pts[Math.min(segIndex + 1, totalSegs)];
        const tip = a.clone().lerp(b, segT);
        target = tip;

        if (currentLineRef.current) {
          const geo = currentLineRef.current.geometry;
          const attr = geo.getAttribute("position") as THREE.BufferAttribute;
          // Write the live tip into the next vertex slot, then reveal
          // every completed point plus that tip.
          const tipIdx = Math.min(segIndex + 1, pts.length - 1);
          attr.setXYZ(tipIdx, tip.x, tip.y, tip.z);
          attr.needsUpdate = true;
          geo.setDrawRange(0, tipIdx + 1);
          geo.computeBoundingSphere();
        }

        if (segProgressRef.current >= totalSegs) {
          // Snap the stroke to its final points before advancing.
          if (currentLineRef.current) {
            const geo = currentLineRef.current.geometry;
            const attr = geo.getAttribute("position") as THREE.BufferAttribute;
            for (let i = 0; i < pts.length; i++) {
              attr.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
            }
            attr.needsUpdate = true;
            geo.setDrawRange(0, pts.length);
          }
          segProgressRef.current = 0;
          strokeActiveRef.current = advanceQueue();
        }
      }
    } else if (phaseRef.current === "follow") {
      target = projectMouseToWorld();
    }

    if (target) currentTarget.current.lerp(target, Math.min(1, dt * 6));
    const { elbow, wrist } = solveIK(base, L1, L2, currentTarget.current);

    orientBone(upperRef.current, base, elbow);
    orientBone(foreRef.current, elbow, wrist);

    elbowRef.current.position.copy(elbow);
    wristRef.current.position.copy(wrist);

    const toolAngle =
      Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x) - Math.PI / 2;
    toolGroupRef.current.position.copy(wrist);
    toolGroupRef.current.rotation.z = toolAngle;

    // shoulder hinge pin subtly tracks the upper-arm angle for a "live
    // mechanism" read, even though the pin geometry itself is symmetric
    const shoulderAngle = Math.atan2(elbow.y - base.y, elbow.x - base.x);
    shoulderPinRef.current.rotation.y = shoulderAngle * 0.15;
  });

  const panelW = useMemo(
    () => Math.max(...codeLines.map((l) => l.length)) * CHAR_W + 1,
    [codeLines]
  );
  const panelH = codeLines.length * LINE_H + 1;

  return (
    <group>
      {/* lighting — MeshStandardMaterial needs real lights, unlike the flat
          MeshBasicMaterial used before */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.3} color="#ffffff" />
      <directionalLight position={[-4, -2, 3]} intensity={0.35} color={COLORS.accentElectric} />
      <pointLight position={[base.x, base.y + 1, base.z + 2]} intensity={0.4} color={COLORS.accentCyan} distance={6} />

      {/* faint code panel backdrop */}
      <mesh
        position={[
          PANEL_ORIGIN.x + panelW / 2 - CHAR_W,
          PANEL_ORIGIN.y - panelH / 2 + CHAR_H,
          -0.05,
        ]}
      >
        <planeGeometry args={[panelW, panelH]} />
        <meshBasicMaterial color={COLORS.bgSecondary} transparent opacity={0.6} />
      </mesh>

      {/* persistent drawn strokes */}
      <group ref={strokeGroupRef} />

      {/* ---- base pedestal: two-tier industrial mount ---- */}
      <mesh position={[base.x, base.y - 0.32, base.z]}>
        <cylinderGeometry args={[0.42, 0.48, 0.18, 24]} />
        <meshStandardMaterial color={COLORS.bgSecondary} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[base.x, base.y - 0.16, base.z]}>
        <cylinderGeometry args={[0.3, 0.36, 0.16, 24]} />
        <meshStandardMaterial color="#3A3D42" metalness={0.5} roughness={0.45} />
      </mesh>

      {/* ---- shoulder joint: hinge housing ---- */}
      <mesh ref={shoulderPinRef} position={base}>
        <cylinderGeometry args={[0.18, 0.18, 0.34, 20]} />
        <meshStandardMaterial color="#3A3D42" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={base} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.185, 0.012, 8, 32]} />
        <meshStandardMaterial
          color={COLORS.accentElectric}
          emissive={COLORS.accentElectric}
          emissiveIntensity={0.6}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* ---- upper arm link ---- */}
      <mesh ref={upperRef}>
        <cylinderGeometry args={[0.09, 0.13, L1, 16]} />
        <meshStandardMaterial color="#4A4D52" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* ---- elbow joint ---- */}
      <mesh ref={elbowRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.24, 20]} />
        <meshStandardMaterial color="#3A3D42" metalness={0.55} roughness={0.4} />
      </mesh>

      {/* ---- forearm link ---- */}
      <mesh ref={foreRef}>
        <cylinderGeometry args={[0.06, 0.09, L2, 16]} />
        <meshStandardMaterial color="#4A4D52" metalness={0.55} roughness={0.35} />
      </mesh>

      {/* ---- wrist joint ---- */}
      <mesh ref={wristRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.14, 16]} />
        <meshStandardMaterial
          color={COLORS.accentElectric}
          emissive={COLORS.accentElectric}
          emissiveIntensity={0.35}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* ---- end effector: gripper housing + stylus tip ---- */}
      <group ref={toolGroupRef}>
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.12, 0.14, 0.1]} />
          <meshStandardMaterial color="#232326" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.025, 0.03, 0.12, 12]} />
          <meshStandardMaterial color="#2A2A2E" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <coneGeometry args={[0.03, 0.1, 12]} />
          <meshStandardMaterial
            color={COLORS.accentCyan}
            emissive={COLORS.accentCyan}
            emissiveIntensity={0.7}
            metalness={0.1}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}
