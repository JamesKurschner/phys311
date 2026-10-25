import {Vec2} from './engine/vec2.js';
import {Body} from './engine/body.js';
import {Gravity} from './engine/forces.js';
import {EulerCromer,VelocityVerlet} from './engine/integrators.js';
import {World} from './engine/world.js';
const out={};const a=new Vec2(3,4), b=new Vec2(1,-2);
out.vec2={add:a.add(b),sub:a.sub(b),mul:a.mul(2),dot:a.dot(b),length:a.length(),lengthSq:a.lengthSq(),normalized:a.normalized()};
for (const [name,Integrator] of [['euler-cromer',EulerCromer],['verlet',VelocityVerlet]]){
 const w=new World(new Integrator());const th=Math.PI/4;
 w.add(new Body({mass:1,pos:new Vec2(0,0),vel:new Vec2(25*Math.cos(th),25*Math.sin(th))}));w.addForce(new Gravity(9.81));w.primeAccelerations();
 for(let i=0;i<480;i++)w.step(1/240);
 const q=w.bodies[0];out[name]={x:q.pos.x,y:q.pos.y,vx:q.vel.x,vy:q.vel.y,E_total:w.totalEnergy(),steps:w.steps};
}
console.log(JSON.stringify(out,null,2))
