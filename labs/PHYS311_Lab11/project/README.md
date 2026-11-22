# PHYS 311 — Lab 10: Collision Explorer

## What it is
An interactive billiards and multi-body physics exhibit that extends the **actual corrected Lab 9 billiards code**, rather than substituting a new engine. Open `index.html` through an HTTP server, select the billiards scene, and vary gravity, drag, or coefficient of restitution while watching motion and energy change.

## What physics it uses
Block 1–2 topics include numerical time integration (Euler, Euler–Cromer, velocity Verlet), Newton's laws and forces (gravity, damped spring, quadratic drag), impulse-based collisions, and kinetic energy/momentum conservation. The app includes the original Lab 9 extra scenes (projectile, figure-eight gravitational bodies, spring chain, crowd).

## How to use

| Control | Behavior |
|---|---|
| Space / Pause | Pause or resume physics; rendering continues |
| Period / Step | Perform exactly one fixed timestep (DT = 1/240 s), then remain paused |
| R / Reset | Restore the currently selected scene and re-baseline conservation diagnostics |
| − / + / Speed slider | Change wall-clock simulation speed between 0.25× and 2×; DT stays fixed |
| Integrator select | Switch between three integrators |
| Gravity slider | Change downward acceleration, 0–12 m/s² |
| Restitution slider | Change body and wall collision elasticity, 0–1 |
| Drag slider | Change quadratic drag coefficient, 0–0.2 |
| Spring grab | Press near a ball, drag, and release; no teleporting |
| Slingshot | Select Slingshot, press to place, drag opposite the desired velocity, release; dashed preview |
| Keyboard slingshot | Set x, y, vx, vy and activate Launch new ball |
| Trails, vectors, flashes | Toggle independent visual diagnostics |
| Download CSV | Export sampled time, energy, drift, collisions and positions of first three bodies |

Every control has an accessible label. The pointer uses canvas-rect ratio correction for accurate position mapping after CSS sizing or high-DPI resizing. The crosshair and coordinates provide a visible corner-check method.

## How I know it is right
The original Lab 9 headless physics validation checks pass **9/9** using `node tests/validate.js` (checked on November 7, 2026). A separate 60-second baseline of 20 billiard balls with fully elastic collisions, no extra gravity or drag, and Velocity Verlet took **14,400** fixed steps, produced **297** body collisions, and measured **−2.70494 × 10⁻¹⁴ %** relative energy drift. This is a headless numerical result, **not** an assertion that browser, touch, accessibility, or deployment testing is complete.

The upper drag limit of 0.2 and gravity limit of 12 are bounded to keep accelerations manageable at DT=1/240 s; for an explicit damped spring a rough stiffness limit is `DT × sqrt(k/m) < 2`. With k=60 N/m and m=1 kg, this value is ~0.0323 (well below 2). This is a necessary numerical guideline, not a guarantee for arbitrarily many high-speed collision contacts.

## Known limitations
- Original engine and renderer folders are copied **byte-for-byte unchanged** from `PHYS311_Lab09_Billiards_Fixed.zip` in the prior conversation. Both new input modules are outside `engine/`.
- Slingshot preview uses a basic gravity-only ballistic curve; drag and nearby collisions may deviate from it.
- CSV export samples first three bodies and is bounded to 25,000 rows.
- When gravity, drag, inelastic collisions, spring dragging, or a new launched body is active, comparing energy to the *initial* baseline naturally includes work, dissipation and added-body energy.
- A live GitHub Pages URL, real screenshots, phone testing and peer feedback require separate verification and are not claimed here.

## Run locally
From the directory containing `index.html`, run `python -m http.server 8000` and open `http://localhost:8000`. Direct `file://` access may block ES module imports. Run physics checks with `node tests/validate.js`. Publish the contents of this folder at `labs/lab10/` in the PHYS 311 repo.
