// Disposable Week 11 spike: compare an inelastic contact against the exact energy-loss formula.
// Uses the existing Lab 10 collision routine, without browser UI or project integration.
import { Body } from '../engine/Body.js';
import { vec } from '../engine/Vec2.js';
import { resolveContact } from '../engine/Collision.js';

function trial(m1, m2, u1, u2, e) {
  const a = new Body({mass:m1, radius:0.5, pos:vec(-0.49,0), vel:vec(u1,0)});
  const b = new Body({mass:m2, radius:0.5, pos:vec( 0.49,0), vel:vec(u2,0)});
  const initialK = a.kinetic()+b.kinetic();
  const initialP = m1*u1+m2*u2;
  const mu=m1*m2/(m1+m2);
  const expected=0.5*mu*(1-e*e)*(u1-u2)**2;
  const didResolve=resolveContact(a,b,e);
  const measured=initialK-a.kinetic()-b.kinetic();
  const dp=(m1*a.vel.x+m2*b.vel.x)-initialP;
  return {m1,m2,u1,u2,e,didResolve,expected,measured,error:measured-expected,dp};
}
let passed=0;
for(const params of [[1,1,2,0,0.6],[1,1,2,0,1],[2,1,3,-1,0.3],[1,3,2,-1,0]]){
  const r=trial(...params);
  const ok=r.didResolve && Math.abs(r.error)<1e-9 && Math.abs(r.dp)<1e-9;
  console.log(JSON.stringify({...r,passed:ok}));
  if(ok)passed++;
}
console.log(`RESULT: ${passed}/4 checks passed`);
if(passed!==4)process.exitCode=1;
