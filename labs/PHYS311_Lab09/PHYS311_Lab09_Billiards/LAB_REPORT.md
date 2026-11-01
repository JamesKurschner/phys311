# PHYS 311 — Lab 9: Multi-Body Browser Simulation

## Project and architecture

The application presents three systems using the same engine: (1) 20+ circular billiard balls with collisions and adjustable restitution, (2) three mutually attracting gravitating bodies using softened Newtonian gravity and Velocity Verlet integration, and (3) a six-mass coupled spring network with fixed endpoints. A scene selector changes initial conditions and forces without editing the engine. The HUD tracks t, N, total energy, energy drift, momentum magnitude, FPS, physics step time, and render time.

```text
index.html / styles.css
          |
        main.js ---------> render/Camera.js
          |                render/Renderer.js
          |                render/HUD.js
          v
  scenes/scenes.js
          |
          v
    engine/World.js ------> engine/Body.js ---> engine/Vec2.js
          |               engine/Forces.js
          |               engine/Integrators.js
          |               engine/Collision.js
          +--------------> engine/Accumulator.js (used by main loop)

  tests/validate.js + tests/lab09_report.js --> engine, scenes
```

The `World` object collects forces, invokes the chosen integrator, applies wall collisions, resolves circle contacts, and advances time. Its force accumulator is recalculated at each force evaluation, including both evaluations required by Velocity Verlet. Render code is separate from physics. Circles have finite inverse mass unless fixed; fixed bodies use inverse mass zero. The impulse code tests separation before updating velocities, and overlap correction is weighted by inverse mass.

## B1. Collision pipeline and separating-pair jitter

For colliding circles, let n point from a to b and let v_n = (v_b−v_a)·n. For v_n ≤ 0 the normal impulse magnitude is j = −(1+e)v_n/(1/m_a+1/m_b). The impulses ±jn conserve the sum of the two momenta; e controls how much normal kinetic energy is retained. Positions are corrected according to inverse mass, which leaves stationary obstacles fixed.

The guard `if (vn > 0)` blocks impulses once an overlapping pair is already moving apart. Removing that guard makes a separating-but-still-overlapping pair get another impulse, artificially reversing relative velocity and causing repeated jitter or spurious energy changes. **An actual guard-disabled screenshot/video still needs to be captured in a local browser; this write-up does not represent that visual test as completed.**

## B2. Conservation tests (numeric, executed headlessly)

Each row uses 20 balls, seed 7, dt = 0.005 s, t = 60 s, no gravity. Results are from `node tests/lab09_report.js`.

| Condition | E(0) | E(60 s) | ΔE/E₀ | |p|(0) | |p|(60 s) | |Δp| |
|---|---:|---:|---:|---:|---:|---:|
| e = 1, no walls | 105.07325184 | 105.07325184 | 4.057e-16 | 7.09703770 | 7.09703770 | 1.26e-15 |
| e = 0.8, no walls | 105.07325184 | 78.39432474 | -25.3908% | 7.09703770 | 7.09703770 | 1.99e-15 |
| e = 1, box walls | 105.07325184 | 105.07325184 | 1.352e-16 | 7.09703770 | 14.11151145 | 7.68e+00 |

In the isolated tests, total momentum is conserved to numerical roundoff even when e = 0.8 because the contact impulses between balls are equal and opposite. For e = 0.8, kinetic energy decreases at inelastic impacts (zero positive energy jumps beyond the 10⁻⁹ numerical tolerance in the recorded test). The fixed walls exert *external impulses* on the ball system, so box momentum is **not conserved**, whereas perfectly elastic walls preserve total kinetic energy. This is a necessary physical qualification to the assignment's momentum-in-a-box wording.

The HUD turns the energy drift text red beyond 1% in absolute fractional drift.

## C. Scene diagnostics

**1 — Billiards.** The box provides wall and pair collisions, optional grid broad phase, and controls for e and number of balls. The ideal 20-ball e = 1 closed-box test retained energy within 1.35e-16 fractional drift. e = 0.8 dissipates energy. For a *linear momentum* conservation test, remove external walls, as done above.

**2 — Gravitational N-body.** Three bodies, softened Newtonian pair forces (softening = 0.001), Velocity Verlet, trails, dt = 0.001 s, 60-second numeric run. E₀ = -1.287140929, E₆₀ = -1.287140966, relative drift = -2.885e-08, |p₆₀| = 4.501e-14. Energy is nearly constant with small oscillatory integration error; the 60-second headless run completed with finite values.

**3 — Coupled spring network.** Six masses with the endpoints fixed, Hookean links and one displaced middle mass. The energy diagnostic is kinetic plus elastic spring potential energy; the fixed supports can exert external forces, so the moving subsystem's total momentum is not conserved. At dt = 0.004 s, 60 s: E₀ = 4.77100762, E₆₀ = 4.76992900, drift = -0.0226%.

## Performance report: physics portion

The following figures are **Node physics benchmarks**, 400 steps per configuration; they are not rendered browser benchmarks. They are valid for identifying physics scaling but cannot establish actual FPS on the user's computer.

| Balls | Brute physics ms/step | Grid physics ms/step | Brute pair checks/step | Grid checks/step | Physics speedup |
|---:|---:|---:|---:|---:|---:|
| 20 | 0.0242 | 0.0387 | 190 | 3.0 | 0.6× |
| 50 | 0.0867 | 0.0230 | 1225 | 16.2 | 3.8× |
| 100 | 0.2902 | 0.0491 | 4950 | 22.4 | 5.9× |
| 200 | 1.5306 | 0.1251 | 19900 | 49.6 | 12.2× |
| 500 | 17.5910 | 0.3126 | 124750 | 123.7 | 56.3× |

Brute-force collision detection examines n(n−1)/2 pairs, so its work grows as O(n²). At high counts the collision candidate loop dominates. The uniform spatial grid avoids most distant pairs; its bookkeeping overhead can be slower at low body counts but is much faster for dense n=200 and n=500 tests. For higher counts, optimizing collision broad phase is the first priority. The on-screen HUD exposes physics ms, render ms, and FPS so browser-specific measurements can be added after running the page. **No browser fps, render timings, or maximum 60-fps body count are claimed here**, since a graphical benchmark was not available in this environment.

## Engine changes and source credit

This is an **attributed adaptation of the instructor-supplied `week9_engine_reference.zip`**, not an independently implemented engine. Engine modules were reused; the present project modifies the scene selection, body-count/restitution controls, HUD performance fields, measurements and report. All three required scenes work with the shared engine without scene-specific engine changes. Headless validation: 9/9 tests passed.

## Final manual requirements before Canvas submission

- Run `index.html` through Live Server and collect one HUD-legible screenshot for each of the three scenes (save alongside the report).
- Demonstrate the guard-disabled collision jitter by temporarily removing `if (vn > 0)` in `engine/Collision.js`, record it, then restore the guard.
- Fill in actual browser render-ms, fps and 60-fps capacity observations for 20/50/100/200 bodies.
- Deploy `labs/lab09/` to GitHub Pages, open the published link in a private browser window, check each scene and JavaScript console, then submit the live URL and this report to Canvas.
