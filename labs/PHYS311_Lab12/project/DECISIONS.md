# Week 12 — Decisions

## Decision 1 — Keep the existing scene engine
**Situation:** The Lab 10 project already supports circle collisions, launch controls, fixed timesteps, and rendering.
**Decision:** Extend its contact solver with tangential impulse rather than rewriting the engine.
**Consequence:** Keeps the MUST tier achievable while preserving the original module separation.

## Decision 2 — Conservative mode as a resettable switch
**Situation:** Dissipative terms obscure whether energy changes come from numerical error or intended physics.
**Decision:** Make a conservative checkbox that resets the scene with zero friction, drag, gravity, and spring driving, and restitution one.
**Consequence:** Tests are easier to interpret; turning the switch on resets the scene.

## Decision 3 — Defer nonessential visual polish
**Situation:** Spin visualization and pockets are optional, while a deployed, validated simulation is required.
**Decision:** Keep spin indicators and pockets outside the Week 12 MUST implementation.
**Consequence:** Prioritize core physics, diagnostics, tests, and deployment before cosmetic work.
