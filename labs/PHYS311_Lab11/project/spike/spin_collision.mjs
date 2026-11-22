// Disposable risk spike: two uniform discs, tangential impulse with Coulomb cap.
// Run: node project/spike/spin_collision.mjs
const cross=(a,b)=>a.x*b.y-a.y*b.x;
function collision(a,b,e,mu){
 const n={x:1,y:0},t={x:0,y:1};
 const ra={x:a.r,y:0},rb={x:-b.r,y:0};
 const contactV=(o,r)=>({x:o.vx-o.w*r.y,y:o.vy+o.w*r.x});
 let va=contactV(a,ra),vb=contactV(b,rb);
 const vn=(vb.x-va.x),kn=1/a.m+1/b.m;
 if(vn>=0)return {jn:0,jt:0};
 const jn=-(1+e)*vn/kn;
 a.vx-=jn/a.m;b.vx+=jn/b.m;
 va=contactV(a,ra);vb=contactV(b,rb);
 const vt=vb.y-va.y;
 const Ia=.5*a.m*a.r*a.r,Ib=.5*b.m*b.r*b.r;
 const kt=kn+a.r*a.r/Ia+b.r*b.r/Ib;
 const jt=Math.max(-mu*jn,Math.min(mu*jn,-vt/kt));
 a.vy-=jt/a.m;b.vy+=jt/b.m;
 a.w+=cross(ra,{x:0,y:-jt})/Ia;
 b.w+=cross(rb,{x:0,y:jt})/Ib;
 return {jn,jt};
}
function run(mu){const a={m:1,r:.5,vx:2,vy:1,w:0},b={m:1,r:.5,vx:0,vy:0,w:0};
 const energy=()=>[a,b].reduce((s,o)=>s+.5*o.m*(o.vx**2+o.vy**2)+.25*o.m*o.r**2*o.w**2,0);
 const p=()=>({x:a.m*a.vx+b.m*b.vx,y:a.m*a.vy+b.m*b.vy});
 const E0=energy(),p0=p(),j=collision(a,b,1,mu),E1=energy(),p1=p();
 return {mu,impulses:j,initialEnergy:E0,finalEnergy:E1,energyChange:E1-E0,momentumError:Math.hypot(p1.x-p0.x,p1.y-p0.y),omegaA:a.w,omegaB:b.w,final:a};}
for(const mu of [0,.2])console.log(JSON.stringify(run(mu),null,2));
