import CaseStudyLayout from "../components/case-studies/CaseStudyLayout";
import type { CaseStudyContent } from "../components/case-studies/CaseStudyLayout";

const content: CaseStudyContent = {
  slug: "robotic-arm",
  title: "Servo-Driven Robotic Arm",
  summary:
    "A 4-DOF robotic manipulator with inverse kinematics, serial servo control, and a web-based teleoperation interface — built on ESP32 firmware with a Python calibration pipeline.",
  problem:
    "Educational robotic arms often ship with closed-loop controllers that hide the underlying kinematics. I needed an open, hackable platform to experiment with joint-space vs. Cartesian control, calibration drift, and real-time trajectory planning on constrained embedded hardware.",
  objective:
    "Design and build a 4-axis servo arm capable of sub-centimeter positioning accuracy at the end effector, controllable via both a serial command interface and a browser-based UI, with full visibility into the IK solver and joint limits.",
  research: `After evaluating brushed DC vs. digital servos, I chose MG996R servos for their torque-to-cost ratio at this scale. Forward kinematics were straightforward DH-parameter modeling; inverse kinematics used geometric decomposition for the first three joints with a wrist offset handled analytically.

Key design decisions:
• ESP32 as the main controller — WiFi for the web UI, enough GPIO for 4 PWM channels, and dual-core for separating comms from the control loop.
• 50 Hz control loop with exponential smoothing on joint targets to reduce servo jitter.
• Magnetic encoders considered but deferred — potentiometer feedback in the servos was sufficient for v1 with software calibration offsets.
• 3D-printed linkages in PETG for stiffness; aluminum base plate for stability.`,
  hardware:
    "4× MG996R servos, ESP32-WROOM-32 dev board, 5V/3A power supply with separate servo rail, custom 3D-printed links (PETG), aluminum base plate, USB serial for debug.",
  software:
    "Firmware in Arduino/C++ on ESP32 — PWM via LEDC, JSON command parser over WebSocket. Python calibration script for joint offset measurement. React teleoperation panel sending Cartesian targets.",
  ai: "Classical IK solver (no ML in v1). Trajectory interpolation uses cubic splines in joint space. Future: learned residual corrections for calibration drift using logged pose-error pairs.",
  challenges: [
    {
      challenge: "Servo jitter caused visible end-effector vibration during holds.",
      solution:
        "Reduced PWM update rate to 50 Hz, added exponential smoothing (α=0.15) on target angles, and deadbanded commands below 0.5° delta.",
    },
    {
      challenge: "IK singularities near full extension caused joint velocity spikes.",
      solution:
        "Implemented workspace boundary clamping and switched to joint-space interpolation when the Jacobian condition number exceeded a threshold.",
    },
    {
      challenge: "Power supply brownouts during simultaneous multi-joint moves.",
      solution:
        "Added bulk capacitors on the servo rail and staggered joint commands by 20 ms during fast trajectories.",
    },
  ],
  results: [
    { value: "±3mm", label: "Position accuracy" },
    { value: "4", label: "Degrees of freedom" },
    { value: "50Hz", label: "Control loop" },
    { value: "12", label: "Weeks to build" },
  ],
  lessons:
    "Mechanical stiffness matters as much as software — my first PLA links flexed enough to invalidate IK assumptions. Separating motor power from logic power eliminated an entire class of mysterious resets.",
  future:
    "Add force sensing at the gripper, implement visual servoing with a wrist-mounted camera, and explore learned IK residuals for calibration-free operation after link wear.",
};

export default function CaseStudyRoboticArm() {
  return <CaseStudyLayout content={content} />;
}
