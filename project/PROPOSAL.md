# PHYS 311 — Final Project Proposal

**James Kurschner | Week 11 | Starting point: Lab 10 Collision Explorer**

## 1. Title & Pitch

**Collision Energy Explorer.**

**Change how bouncy the balls are and watch how much energy is lost in each collision, while the simulation keeps track of the total.**

## 2. The Physics

The existing engine uses Newton's law, **F = ma**, with gravity **F_g = (0, −mg)**, quadratic drag **F_d = −b|v|v**, and spring grabbing **F_s = k(x_target − x) − cv**. Circle–circle contact applies a normal impulse **J = −(1 + e)v_n/(1/m₁ + 1/m₂)**; walls constrain positions to a rectangular box and reflect velocity with restitution **e**.

**My new thing is a collision-energy-loss ledger**. For each ball on ball impact, it will accumulate:

**ΔK_loss = ½ μ(1 − e²)v_n²**

where **μ = m₁m₂/(m₁ + m₂)** and **v_n** is the pre-impact normal relative velocity.

I will keep wall and drag losses separate so they are not misreported as ball–ball losses. I will use **Velocity Verlet at Δt = 1/240 s** because it is second order and already tested in the engine. Impulses remain discrete collision updates. Units are meters, seconds, kilograms, newtons, and joules, with typical masses near 1 kg and restitution from 0 to 1.

## 3. Three-Tier Scope

**MUST (by end of Week 12):**

- Working Lab 10 simulation
- Accurate ball–ball loss counter and displayed total
- Elastic/inelastic preset
- Numerical tests
- Deployed to GitHub Pages

**SHOULD (Week 13):**

- Separate wall-loss counter
- Clearer explanation of why momentum is not conserved with walls
- Improved readout and documentation

**COULD (optional):**

- Side-by-side elastic/inelastic runs
- Downloadable loss-history chart
- Extra scene presets

## 4. Validation Plan

**Test 1 — Elastic Reduction**

With e = 1, gravity = drag = 0, no walls, and Δt = 1/240 s, the predicted collision loss is 0 J.

- Accumulated collision loss: less than 10⁻⁹ J over 100 impacts
- Relative kinetic-energy drift: less than 10⁻⁷

**Test 2 — Single Inelastic Collision**

Two 1 kg balls approach along their centers at 2 m/s and 0 m/s, with e = 0.6.

- Reduced mass: μ = 0.5 kg
- Predicted energy loss: 0.64 J
- Allowed energy-loss error: less than 10⁻⁹ J
- Allowed momentum change: less than 10⁻⁹ kg·m/s

**Test 3 — Timestep Comparison**

Repeat an unforced scene at Δt = 1/120 s and 1/240 s.

- Compare the total accounted energy loss.
- Target difference: less than 0.5% when impact counts match.
- Report failures rather than weakening the tolerances.

## 5. Biggest Risk + Fallback

The thing most likely to sink this project is **double-counting losses from repeated overlapping contacts**, and my fallback is **a two-ball collision laboratory with a validated per-impact ledger instead of the full crowded scene**.

## 6. Timeline

| Week | Deliverable |
|---|---|
| 11 | Proposal, standalone collision-loss spike, initial project copy |
| 12 | MUST features, tests, deployed GitHub Pages page |
| 13 | SHOULD features, validation report, README, testing |
| 14 | Final polish, presentation, and submission |

## 7. Audience

This is for introductory physics students (like myself). After about two minutes, they should understand that **momentum can remain conserved while kinetic energy is lost in a collision**.
