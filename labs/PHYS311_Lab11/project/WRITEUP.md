# PHYS 311 — Lab 10: Interactive Simulation

## Overview
For this lab I extended my earlier Lab 9 billiards simulation instead of rewriting its engine. I chose to make a collision explorer, because changing restitution and drag is a direct way to see the difference between elastic collisions and processes that remove mechanical energy. I kept the original physics modules and added separate modules for pointer events and HTML controls.

## Part A: Input and control panel
I used `getBoundingClientRect()` and the ratios `canvas.width / rect.width` and `canvas.height / rect.height` to transform pointer positions into actual canvas pixels. The Lab 9 camera then transforms these pixels into world coordinates. My crosshair and on-screen x/y readout are intended to check that all four corners map to the correct world boundaries.

The simulation can pause, advance one fixed time step (DT = 1/240 s), reset, change speed, and choose Euler, Euler–Cromer, or Velocity Verlet. Changing the speed adds scaled elapsed time to the accumulator but does not alter the fixed integration step. Gravity, restitution, and quadratic drag are live sliders and their values are parsed using `parseFloat`.

The slider ranges are gravity = 0–12 m/s², restitution = 0–1, and quadratic drag = 0–0.2. For the grab spring, k = 60 N/m and a typical moving mass is 1 kg. At DT = 1/240 s, `DT sqrt(k/m)` is about 0.0323, safely below the approximate explicit oscillator condition `DT sqrt(k/m) < 2`. This doesn't eliminate all possible high-speed collision instabilities, but it keeps the spring interaction from being excessively stiff for this time step.

## Part B: Direct manipulation and visualization
I used a damped mouse spring, rather than assigning a ball's position to the pointer. This lets acceleration, velocity, and wall collisions continue naturally. In slingshot mode, dragging determines launch velocity, and the application draws an approximate ballistic preview. For keyboard-only use, a separate form lets a user specify starting position and velocity before launching a ball.

Teleport-dragging is a poor model for two reasons. First, it moves the object without integrating the corresponding force or acceleration, so the displayed trajectory no longer follows Newton's second law. Second, it can cause instant overlaps or penetration of other bodies and walls, making collision responses unrealistic and creating energy discontinuities.

My three independent visuals are (1) fading motion trails, which make past paths and deflections visible; (2) velocity/acceleration arrows, which show the direction of motion and the effect of forces; and (3) brief contact flashes around bodies, which make it easier to notice when impacts occur in crowded scenes. The grid is an additional optional visual.

## Part C: Focused exhibit and validation
The main purpose is to show visitors how gravity, air resistance, and elasticity change the motion of multiple moving bodies. The two main course topics are (1) numerical integration of Newtonian motion and (2) collisions and conservation laws. The live diagnostics include kinetic/potential/total energy, relative energy drift, total momentum and collision count.