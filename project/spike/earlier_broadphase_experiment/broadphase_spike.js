// Assignment 11 technical spike: brute force vs spatial hash with the Lab 10 engine.
// Run from project/: node spike/broadphase_spike.js
import { crowd } from '../scenes/scenes.js';

function measure(n, phase) {
  const world = crowd({ n, seed: 3 });
  world.broadPhase = phase;
  world.captureBaseline();
  const steps = 500, dt = 0.004;
  const start = performance.now();
  for (let i = 0; i < steps; i++) world.step(dt);
  const ms = performance.now() - start;
  return {world, n, phase, steps, ms, checks: world.stats.checks, collisions: world.collisionCount};
}
for (const n of [120, 200]) {
  const a = measure(n, 'brute');
  const b = measure(n, 'hash');
  const diff = Math.max(...a.world.bodies.map((body, i) => body.pos.sub(b.world.bodies[i].pos).len()));
  console.log(JSON.stringify({bodies:n, steps:a.steps, brute_ms:a.ms, hash_ms:b.ms,
    brute_last_step_checks:a.checks, hash_last_step_checks:b.checks,
    brute_contacts:a.collisions, hash_contacts:b.collisions,
    max_position_difference_m:diff}, null, 2));
  if (!(diff < 1e-9)) process.exitCode = 1;
}
