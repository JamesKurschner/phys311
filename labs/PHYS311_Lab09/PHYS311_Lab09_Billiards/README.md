# PHYS 311 — Lab 9: Multi-body browser simulation

Three scenes use the **same** physics implementation: 20–500 ball billiards with adjustable restitution; a softened Newtonian three-body figure-eight with Velocity Verlet; and a plucked, conservative spring chain. Change the scene from the selector. Integrator selector, timestep, broad-phase selector, pause, single-step, reset, camera pan/zoom and trail/grid switches are available.

## Running
Open `index.html` using VS Code Live Server, or run `python -m http.server 8000` from this directory and visit `http://localhost:8000/`. Opening directly with `file://` will not load ES modules. Run `node tests/validate.js` for the headless checks; see `LAB_REPORT.md` for recorded measurements and discussion.

## Architecture
`main.js` handles browser controls and timing. `scenes/scenes.js` defines three initial conditions. `engine/` contains the physics and diagnostics, including swappable integrators and collision pipeline; `render/` contains graphics and the conservation HUD. `tests/` contains repeatable tests. The same engine files are loaded by each scene, unchanged.

## Credit and adaptation
**Adapted from the instructor-supplied `week9_engine_reference.zip`.** The modular codebase, most engine modules, figure-eight initial conditions, renderer and original validation suite come from that reference. This lab version selects three required scenes, makes a 20-body scene with count and restitution controls, adds FPS/render timing, runs additional 60-second conservation/performance tests and documents their results. It should be understood as an attributed derivative of the reference implementation, not an independently written engine.

## Conservation caveat
Wall collisions apply *external* impulses, so momentum of balls inside a fixed box is not conserved even for elastic walls. Use no walls to test total linear momentum; energy remains constant for perfectly elastic stationary walls.

## GitHub Pages deployment
Push this folder to `phys311/labs/lab09/` in the repository, then publish it using GitHub Pages (repository settings, Pages, suitable branch). Submit the **actual published URL** alongside `LAB_REPORT.md`. A URL cannot be provided until you deploy it.
