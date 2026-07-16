import CaseStudyLayout from "../components/case-studies/CaseStudyLayout";
import type { CaseStudyContent } from "../components/case-studies/CaseStudyLayout";

const content: CaseStudyContent = {
  slug: "pong-ai",
  title: "OLED Pong Game (v2)",
  heroVideoUrl: "/videos/pong-demo.mp4",
  summary:
    "A full-featured Pong game on a 128×64 SH1106 OLED powered by an STM32 — with PvC and PvP modes, live score HUD, angle deflection physics, and a CPU opponent that tracks the ball at 65% of human speed.",
  problem:
    "Most embedded Pong implementations use blocking delays, lack proper state machines, and have predictable AI. I wanted a polished, responsive game with smooth frame pacing, dynamic rally physics, and a fair but challenging CPU opponent — all on a microcontroller with limited RAM.",
  objective:
    "Build a complete two-player Pong game on embedded hardware with a clean menu system, real-time score tracking, angle-based paddle deflection, progressive ball speed-up, and an AI opponent that plays well enough to be fun.",
  research: `Evaluated display options — SSD1306 vs SH1106. Chose SH1106 for its 128×64 resolution and I2C simplicity. The Adafruit GFX library provided all drawing primitives without writing a custom framebuffer.

Key design decisions:
• millis()-based frame pacing (8 ms ≈ 125 FPS) instead of blocking delay() — keeps frame rate consistent even when I2C transfer times vary.
• Velocity-direction gating on paddle collision prevents the "sticky paddle" bug from v1 where high-speed balls could reflect multiple times in one frame.
• Angle deflection maps the ball's contact point on the paddle face to a rebound angle — edge hits produce steep angles, centre hits produce flat trajectories, adding skill depth.
• Ball speed increases 5% per paddle hit, capped at MAX_BALL_SPEED, creating natural rally tension.
• CPU AI tracks the ball centre at 65% of player speed — a handicap that gives human players a fair challenge.`,
  hardware:
    "STM32 microcontroller, SH1106 128×64 OLED display (I2C 0x3C), 2× analog joysticks (P1 on PA4/PA5, P2 on PA2/PA3), select button (PA14, INPUT_PULLUP).",
  software:
    "C++ (Arduino framework) — Adafruit_SH1106 for OLED control, Adafruit_GFX for graphics, Wire for I2C. Custom Joystick, Button, Paddle, and Ball classes with a three-state machine (Menu → Game → Win). Debounced button with arm-then-detect to prevent boot-time false triggers.",
  ai: "No neural networks — the CPU opponent uses a proportional tracking algorithm that moves the paddle toward the ball's vertical centre at 65% of human player speed. The challenge comes from progressive ball acceleration and angle-based deflection that makes each rally play differently.",
  challenges: [
    {
      challenge: "The 'sticky paddle' bug — at high ball speeds, the ball could reflect between paddle and wall multiple times in a single frame.",
      solution:
        "Added velocity-direction gating: the left paddle only tests collision when the ball moves left (vx < 0), and the right paddle only when it moves right (vx > 0). A one-line fix that eliminated an entire class of bugs.",
    },
    {
      challenge: "Boot-time false triggers on the select button skipped the menu immediately after power-on.",
      solution:
        "Implemented an arm-then-detect pattern — the button driver waits until it observes a HIGH state at least once before registering any press, preventing phantom triggers at boot.",
    },
    {
      challenge: "Score text was overwritten by the ball and paddles during gameplay.",
      solution:
        "Reserved the top 9 pixel rows (HUD_H) exclusively for the score display with a solid separator line. All game objects are constrained to y ≥ FIELD_TOP, protecting the HUD from being overwritten.",
    },
  ],
  results: [
    { value: "125", label: "FPS target" },
    { value: "2", label: "Game modes" },
    { value: "10", label: "Points to win" },
    { value: "2", label: "Weeks to build" },
  ],
  lessons:
    "State machines are underrated in embedded projects. Defining MENU, GAME, and WIN states with explicit transitions made the code easy to reason about and debug. Velocity gating showed me that thinking about edge cases at the maths level saves hours of empirical debugging.",
  future:
    "Add a high-score table stored in EEPROM, implement difficulty levels by adjusting the AI speed handicap, add sound effects via a piezo buzzer, and build a version with SPI OLED for higher frame rates.",
};

export default function CaseStudyPong() {
  return <CaseStudyLayout content={content} />;
}
