# Week 12 — Progress Log

## MUST tier status

| Proposal MUST | Status | Evidence / next action |
|---|---|---|
| Reuse Lab 10 engine | Done in code | `engine/`, `render/`, and `main.js` copied from Lab 10 |
| Two or more billiard balls | Done in code | Existing collisions scene |
| Collision friction produces spin | Done in code | `engine/Collision.js`; test results below |
| Launch and reset, keyboard equivalent | Done in code | Pointer launch and keyboard launch fields; Reset button / R |
| Fixed timestep | Implemented, browser verification pending | `DT=1/240` accumulator; CPU throttling not yet measured |
| Six debug HUD measurements | Implemented, browser verification pending | Energy, drift, momentum, bodies, contacts this step, max speed, FPS; D toggle |
| Conservative test mode | Implemented, browser verification pending | Switch removes gravity, drag, spring driving, friction; e=1 |
| Two numerical validation tests | Done | `node tests/week12_validation.mjs` |
| Deployed to GitHub Pages | **Pending user deployment** | Cannot claim a live URL until pushed and checked |

## Validation results (Node.js, isolated collision pair)

| Test | Expected | Measured | Pass? |
|---|---|---|---|
| Elastic collision, μ=0, e=1 | Absolute energy drift <0.3%; momentum error <1e-9 | 0.000000% drift; 0 momentum error | PASS |
| Tangential friction, μ=0.2, e=1 | Each angular speed −0.666667 ± 1e-5 rad/s; momentum error <1e-9; no energy gain | ωA=ωB=−0.666666667 rad/s; momentum error 0; energy 2.5→2.416666667 J | PASS |

Tests use 1 kg discs of radius 0.5 m with initial velocities (2,1) and (0,0) m/s, as in the proposal. Results are isolated collision tests, **not** long-duration full-scene conservation tests.

## Scope decisions
See `DECISIONS.md`. No promised feature has been falsely marked deployed.

## Bugs / physics diagnoses
1. **Missing tangential impulse** — Symptom: collisions could never transfer tangential motion into spin. Cause: Lab 10's collision solver only applied the normal impulse. Fix: include rotational contact velocity, effective tangential mass, and a Coulomb-capped tangential impulse. Confirmed by the numerical spin test.
2. **Misleading debug readout** — Symptom: existing HUD displayed `fps: 0` and lacked per-step contact count and maximum speed. Cause: the browser frame callback passed placeholder FPS and the world tracked only cumulative collisions. Fix: compute frame-to-frame FPS and add per-step contact counts and maximum-speed display. Browser visual verification remains pending.

## Week 13 — Three SHOULD priorities
1. Add an intuitive spin indicator to each ball.
2. Improve friction controls and add an explanatory note about energy loss.
3. Perform timestep-halving / convergence checks and polish the final validation report.

## Remaining manual verification
- Run project from a local HTTP server, then deploy to GitHub Pages and open the live URL in a fresh browser (local automated browser test was blocked by environment restrictions).
- Test 4× and 6× CPU throttling in DevTools and record the observed behavior.
- Check all HUD values and conservative mode visually; check DevTools Console for errors.
- Submit Canvas discussion posts, peer response, journal, and live URL.
