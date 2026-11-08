# Week 11 Risk Spike — Collision-Energy Loss

**Risk:** Could I calculate the energy lost during an inelastic collision accurately enough to display it, without accidentally counting the same loss twice? This matters because my final project's new feature is an energy-loss ledger, not simply a different-looking simulation.

## What I tried

I made a small, headless Node script that uses the existing Lab 10 `resolveContact()` function on two overlapping balls. I measured the kinetic energy before and after one collision, then compared the change with the theoretical loss, `0.5 * mu * (1 - e^2) * vn^2`. I also checked conservation of linear momentum. I tested four combinations of mass, initial velocity, and restitution, including a fully elastic collision. The code is in `collision_loss_spike.mjs`, and the actual output is in `output.txt`.

## What happened

All **4 of 4** checks passed. For two 1 kg balls with starting speeds of 2 and 0 m/s and restitution 0.6, the predicted loss was **0.64 J**, while the measured loss was **0.6399999999999997 J**. Momentum error was zero. The elastic case gave zero energy loss. The largest absolute difference between predicted and measured loss across the four trials was about **8.9 × 10^-16 J**.

## What this means for the project

The single-contact calculation works, so I will keep the loss ledger in the **MUST** tier. However, this spike does **not** test repeated contacts, wall collisions, or drag. Those remain the main integration risks. My fallback is to ship a reliable two-ball collision demonstration if a crowded scene causes double-counting. I am not claiming I completed a timed 90-minute test; these findings reflect the actual prototype run.
