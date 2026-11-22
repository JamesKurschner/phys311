# Week 11 Risk Spike — Tangential Collision Impulse

**Risk tested:** Whether a two-disc tangential contact impulse can generate the correct angular velocity without creating energy or changing total linear momentum. This is a disposable standalone prototype, not an integrated billiards scene.

**What I tried:** I wrote `spin_collision.mjs` with two uniform discs, one normal impulse, and one Coulomb-limited tangential impulse. The initial conditions were equal masses of 1 kg, radii of 0.5 m, an incoming velocity of (2, 1) m/s, a stationary target, and zero initial spin. I ran the same contact twice: first with friction coefficient 0, then with 0.2, both with restitution 1. The script calculates the pre- and post-impact kinetic energy, linear momentum difference, and angular velocities.

**What happened:** The frictionless case produced normal impulse 2 N·s, tangential impulse 0, zero spin, energy 2.5 J before and after, and zero momentum error. With friction 0.2, the tangential impulse was 0.1666666667 N·s, and both discs acquired angular speed -0.6666666667 rad/s. Energy changed from 2.5 J to approximately 2.4166666667 J, a decrease of 0.0833333333 J, while the momentum error remained zero. These are direct Node output values from the prototype, not measurements of the browser simulation.

**Scope decision:** Keep tangential impulse and spin in MUST because the minimal contact calculation passed this targeted test. The next risk is integration with overlap correction and walls; if that destabilizes the live build, ship the existing frictionless contact behavior and document the spin feature as deferred. Pockets, sound, and realistic rolling remain COULD features.
