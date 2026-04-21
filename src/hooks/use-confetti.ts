"use client";

import confetti from "canvas-confetti";

export function fireCelebration() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"],
  });
}
