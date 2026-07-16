import CaseStudyLayout from "../components/case-studies/CaseStudyLayout";
import type { CaseStudyContent } from "../components/case-studies/CaseStudyLayout";

const content: CaseStudyContent = {
  slug: "pong-ai",
  title: "Pong-Playing Vision System",
  summary:
    "A computer-vision pipeline that tracks a physical Pong ball in real time and drives paddle actuators — no game API, just a camera, OpenCV, and a PID loop.",
  problem:
    "Most 'AI plays Pong' demos cheat by reading game memory or screen pixels from an emulator. I wanted a system that works on a real, physical setup — detecting a ball with a camera and controlling actual paddle motors with sub-100ms latency.",
  objective:
    "Build an end-to-end perception-to-action pipeline achieving ≥25 FPS tracking, <80ms end-to-end latency from frame capture to motor command, and reliable ball detection under varying ambient light.",
  research: `Explored color-based segmentation vs. Hough circle detection vs. background subtraction. Color thresholding in HSV space won for v1 — the ball was a distinct orange and the table background was controlled.

Pipeline architecture:
• Capture thread (OpenCV VideoCapture, 640×480 @ 60 FPS attempt)
• Detection thread (HSV mask → contour analysis → centroid)
• Prediction step (constant-velocity Kalman filter for occlusion gaps)
• Control thread (PID on paddle Y position, mapped to servo angle)

Chose a Raspberry Pi 4 with a USB webcam for prototyping; latency budget analysis showed the Pi could handle the pipeline at ~30 FPS with optimized NumPy operations.`,
  hardware:
    "Raspberry Pi 4 (4 GB), USB webcam (720p @ 60 FPS), 2× micro servos for paddle actuation, 3D-printed paddle mounts, physical Pong table with controlled lighting.",
  software:
    "Python 3.11 — OpenCV for capture and detection, NumPy for vectorized math, a threaded pipeline with lock-free queues between stages. PID controller with anti-windup. Optional Pygame overlay for debug visualization.",
  ai: "No neural network in v1 — classical CV with a Kalman filter for prediction. Evaluated a tiny YOLO-nano model for ball detection but latency was 3× worse on Pi 4 without an accelerator. ML reserved for v2 with a Coral TPU.",
  challenges: [
    {
      challenge: "Motion blur at high ball speeds caused missed detections.",
      solution:
        "Increased shutter speed via webcam exposure settings and added Kalman prediction to bridge 2–3 frame gaps during fast crosses.",
    },
    {
      challenge: "Latency spikes from Python GIL contention between threads.",
      solution:
        "Moved capture and detection to separate processes via multiprocessing; only the lightweight PID loop shared the GIL with the main process.",
    },
    {
      challenge: "Ambient light changes broke HSV thresholds mid-session.",
      solution:
        "Added an auto-calibration step on startup that samples the ball color from a known position and adjusts HSV bounds dynamically.",
    },
  ],
  results: [
    { value: "28", label: "FPS average" },
    { value: "72ms", label: "E2E latency" },
    { value: "94%", label: "Detection rate" },
    { value: "8", label: "Weeks to build" },
  ],
  lessons:
    "Latency budgets must be measured end-to-end, not per-stage. My detection was fast but queue depth between threads added 40ms I didn't account for until I timestamped every handoff.",
  future:
    "Deploy YOLO-nano on a Coral USB accelerator for robust detection under uncontrolled lighting, add reinforcement learning for predictive paddle positioning, and port the control loop to C++ for sub-20ms latency.",
};

export default function CaseStudyPong() {
  return <CaseStudyLayout content={content} />;
}
