import {Body} from '../engine/Body.js';
import {vec} from '../engine/Vec2.js';
import {resolveContact} from '../engine/Collision.js';
function run(mu,m=1,r=.5){
 const a=new Body({pos:vec(0,0),vel:vec(2,1),mass:m,radius:r,restitution:1});
 const b=new Body({pos:vec(2*r-1e-6,0),vel:vec(0,0),mass:m,radius:r,restitution:1});
 const energy=()=>[a,b].reduce((s,x)=>s+x.kinetic()+x.rotational(),0);
 const momentum=()=>a.momentum().add(b.momentum());
 const E0=energy(),p0=momentum();const collided=resolveContact(a,b,1,mu);
 const E1=energy(),p1=momentum();
 return {collided,initialEnergy:E0,finalEnergy:E1,energyDriftPercent:100*(E1-E0)/E0,momentumError:p1.sub(p0).len(),omegaA:a.omega,omegaB:b.omega};
}
const elastic=run(0),spin=run(.2);
const tests=[{name:'Conservative elastic collision',expected:'|energy drift| < 0.3%; momentum error < 1e-9',measured:elastic,pass:elastic.collided&&Math.abs(elastic.energyDriftPercent)<.3&&elastic.momentumError<1e-9},{name:'Tangential friction / spin',expected:'omegaA and omegaB = -2/3 rad/s ± 1e-5; momentum error < 1e-9; energy does not increase',measured:spin,pass:spin.collided&&Math.abs(spin.omegaA+2/3)<1e-5&&Math.abs(spin.omegaB+2/3)<1e-5&&spin.momentumError<1e-9&&spin.finalEnergy<=spin.initialEnergy+1e-10}];
console.log(JSON.stringify(tests,null,2));if(tests.some(x=>!x.pass))process.exitCode=1;
