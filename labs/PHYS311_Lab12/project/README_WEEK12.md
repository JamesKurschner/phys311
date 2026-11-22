# Week 12 — Spin Billiards implementation notes

Run the browser simulation from `/project/` through an HTTP server.  The default billiards scene uses a fixed physics step of 1/240 s with Euler-Cromer; 20 moving balls are initialized.

- **New physics:** `engine/Collision.js` resolves a Coulomb-limited tangential impulse to transfer translational motion into disc spin.
- **Controls:** Pointer grabbing and slingshot mode, plus keyboard-accessible numerical launch controls, Reset (R), and Pause (Space).
- **HUD:** D toggles measurements; `?debug=1` enables the HUD. It reports energy and drift relative to reset E0, total momentum magnitude, body count, contacts this step, maximum speed, and measured FPS.
- **Conservative switch:** Resets to friction=0, e=1, zero gravity, zero drag and no user spring-grab force. External wall impulses can still change total linear momentum: use the two-body isolated tests for momentum conservation.
- **Validation:** `node tests/week12_validation.mjs`; outputs are captured in `tests/week12_results.json`.

## Known limits

Adding balls after reset adds energy and momentum to the current baseline by design. Press R to rebaseline. The on-screen drift metric in dissipative mode includes real energy losses, which should not be interpreted as numerical error. The browser has NOT been certified on a live Pages deployment. See `PROGRESS.md` and the submission README in the parent folder.
