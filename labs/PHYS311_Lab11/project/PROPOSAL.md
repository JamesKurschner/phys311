# A1 — Title & pitch
**Interactive Billiards: Spin and Collision Physics.** Launch billiard balls across a table, change the friction and bounce settings, and watch collisions transfer motion into spin while a live display tracks energy.

# A2 — The physics
The starting point is the Lab 10 disc engine, with uniform discs of mass \(m\), radius \(R\), position \(\mathbf r\), velocity \(\mathbf v\), angular speed \(\omega\), and moment of inertia \(I=\tfrac12mR^2\). Motion follows \(d\mathbf r/dt=\mathbf v\), \(m\,d\mathbf v/dt=\mathbf F\), and \(I\,d\omega/dt=\tau\). The default billiards table is horizontal, so gravity has no in-plane component. Optional linear damping is \(\mathbf F_d=-c\mathbf v\); the conservative mode sets \(c=0\). Walls reflect normal velocity with restitution \(e\); the conservative mode uses \(e=1\). Disc contact requires \(|\mathbf r_b-\mathbf r_a|\le R_a+R_b\). With contact normal \(\mathbf n\), relative normal contact speed \(v_n\), and inverse masses \(m_a^{-1},m_b^{-1}\), the normal impulse is \(j_n=-(1+e)v_n/(m_a^{-1}+m_b^{-1})\) for approaching bodies. The **one new thing** is tangential contact impulse coupled to disc spin: contact-point velocity is \(\mathbf v_c=\mathbf v+\omega\,\hat{\mathbf z}\times\mathbf r_c\); tangential impulse \(j_t=\mathrm{clamp}(-v_t/k_t,-\mu j_n,+\mu j_n)\), where \(k_t=m_a^{-1}+m_b^{-1}+(\mathbf r_a\times\mathbf t)^2/I_a+(\mathbf r_b\times\mathbf t)^2/I_b\). Apply \(\Delta\mathbf v=\pm j_t\mathbf t/m\) and \(\Delta\omega=(\mathbf r_c\times\mathbf J)/I\). This extends the existing normal-impulse collision resolver without introducing polygon geometry. Euler–Cromer with a fixed accumulator timestep \(DT=1/240\) s is appropriate for short collision-driven motion and matches the existing engine; contact impulses are applied after each integration step. Units: meters, seconds, kilograms, joules; typical \(R=0.05\) m, \(m=0.17\) kg, table \(2.4\times1.2\) m, and speeds 0–3 m/s. No claims of perfectly realistic felt/rolling behavior are made.

# A3 — Three-tier scope
**MUST (end of Week 12)**
- Copy Lab 10 into `project/`, preserve the `engine/` versus `render/` separation, and run the existing scene.
- Implement one pairwise tangential collision impulse with angular velocity updates for discs; provide a fallback to frictionless collisions if needed.
- Provide a playable two-disc billiards scene, launch control with keyboard-accessible equivalent, reset, and baseline energy capture.



**SHOULD (Week 13)**
- Show spin direction and angular velocity visually.
- Add an adjustable friction slider and clear usage instructions.
- Add a convergence comparison and a concise validation report.

**COULD (drop without penalty)**
- Add pocket scoring and multiple rack arrangements.
- Add cue-stick animation and sound effects.
- Add realistic rolling resistance and spin decay.

# A4 — Validation plan
1. **Conservative reduction:** Set \(\mu=0\), damping \(c=0\), restitution \(e=1\), and disable external driving after launch. For an isolated two-disc collision with masses 0.17 kg and radius 0.05 m, check \(|E_f-E_0|/E_0<0.003\) and \(\|\mathbf p_f-\mathbf p_0\|/\max(\|\mathbf p_0\|,10^{-12})<10^{-9}\). Compare at \(DT=1/240\) s, avoiding wall collisions.
2. **Spin/friction impulse:** Use two equal uniform discs, \(m=1\) kg, \(R=0.5\) m, \(\mathbf v_a=(2,1)\) m/s, \(\mathbf v_b=(0,0)\), \(\omega_a=\omega_b=0\), \(e=1\), \(\mu=0.2\), and contact normal \((1,0)\). The analytic impulse model predicts \(j_n=2\) N·s, \(j_t=1/6\) N·s, and \(\omega_a=\omega_b=-2/3\) rad/s. Require impulse and spin absolute errors below \(10^{-9}\), linear momentum absolute error below \(10^{-9}\) kg·m/s, and final energy no greater than initial energy within \(10^{-10}\) J. These values are prototype-scale and test the impulse implementation independently of rendering.

# A5 — Biggest risk + fallback
The thing most likely to sink this project is getting the signs and effective mass of the tangential impulse correct without injecting energy, and my fallback is a frictionless two-disc billiards simulation using the existing normal impulse solver, with spin moved to COULD.

# A6 — Week-by-week timeline
- **Week 10:** Complete and deploy the reusable Lab 10 browser engine.
- **Week 11:** Submit the proposal, test the tangential-impulse risk in `project/spike/`, and record findings.
- **Week 12:** Complete the MUST features, verify fixed timestep and debug mode, and deploy to GitHub Pages.
- **Week 13:** Complete selected SHOULD features, validation report, documentation, presentation, and launch.

# A7 — Audience
This is for introductory physics students and curious visitors who, after two minutes, should understand that an off-center billiard-ball collision can convert translational motion into spin and that frictional contact can reduce mechanical energy while conserving the two-ball system's linear momentum.
