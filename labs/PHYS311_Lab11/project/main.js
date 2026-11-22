// Lab 10 browser orchestration. Lab 9 engine/, render/, scenes/, tests/ unchanged.
import {World} from './engine/World.js';
import {Accumulator} from './engine/Accumulator.js';
import {INTEGRATORS} from './engine/Integrators.js';
import {UniformGravity,QuadraticDrag} from './engine/Forces.js';
import {Body} from './engine/Body.js';
import {vec} from './engine/Vec2.js';
import {Camera} from './render/Camera.js';
import {Renderer} from './render/Renderer.js';
import {HUD} from './render/HUD.js';
import {SCENES} from './scenes/scenes.js';
import {validate} from './tests/validate.js';
import {setupInput} from './input.js';
import {setupUI} from './ui.js';
const $=id=>document.getElementById(id),canvas=$('sim'),camera=new Camera(canvas),renderer=new Renderer(canvas,camera),hud=new HUD($('hud'));
const DT=1/240;let world=null,acc=new Accumulator(DT),running=true,last=0,speed=1,flash=0;const rows=[];
const input=setupInput(canvas,camera,{world:()=>world,mode:()=>$('mode').value,launch:(start,end)=>{
 if(!world)return;const vx=Math.max(-20,Math.min(20,(start.x-end.x)*2));const vy=Math.max(-20,Math.min(20,(start.y-end.y)*2));
 world.add(new Body({pos:vec(start.x,start.y),vel:vec(vx,vy),mass:1,radius:.5,restitution:parseFloat($('restitution').value),color:'#ffe184',name:'launched'}));
}});
function resize(){const r=canvas.parentElement.getBoundingClientRect();const w=Math.max(300,Math.floor(r.width));const dpr=Math.max(1,Math.min(3,window.devicePixelRatio||1));canvas.width=Math.floor(w*dpr);canvas.height=Math.floor(w*.62*dpr);canvas.style.width=w+'px';canvas.style.height=Math.floor(w*.62)+'px';if(world)camera.fit(world.view.xmin,world.view.ymin,world.view.xmax,world.view.ymax);}
function parameters(){if(!world)return;world.forces=world.forces.filter(f=>f!==input.springForce&&!f.lab10Force);const g=parseFloat($('gravity').value),d=parseFloat($('drag').value);if(g>0){const gravity=new UniformGravity(g);gravity.lab10Force=true;world.addForce(gravity);}if(d>0){const drag=new QuadraticDrag(d);drag.lab10Force=true;world.addForce(drag);}world.addForce(input.springForce);
 const e=parseFloat($('restitution').value);for(const b of world.bodies)b.restitution=e;if(world.bounds&&'restitution' in world.bounds)world.bounds.restitution=e;if(world.bounds&&'e' in world.bounds)world.bounds.e=e;
}
function reset(){world=SCENES[$('scene').value].make({n:parseInt($('ballCount').value,10),e:parseFloat($('restitution').value)});world.integrator=new INTEGRATORS[$('integrator').value]();world.broadPhase=$('broadphase').value;parameters();world.captureBaseline();acc=new Accumulator(DT);acc.reset();renderer.clearTrails();rows.length=0;flash=0;$('note').textContent=world.note||'';resize();}
function singleStep(){if(!world)return;running=false;$('playpause').textContent='Resume (Space)';acc.reset();world.step(DT);renderer.recordTrails(world);sample();}
function toggle(){running=!running;$('playpause').textContent=running?'Pause (Space)':'Resume (Space)';acc.reset();}
function visuals(){renderer.showTrails=$('trails').checked;renderer.showVectors=$('vectors').checked;renderer.showGrid=$('grid').checked;if(!renderer.showTrails)renderer.clearTrails();}
function sample(){if(rows.length>25000)return;const d=world.drift();rows.push([world.t,world.totalEnergy(),d.dE,world.collisionCount,...world.bodies.slice(0,3).flatMap(b=>[b.pos.x,b.pos.y])]);}
function keyboardLaunch([x,y,vx,vy]){if(![x,y,vx,vy].every(Number.isFinite))return;const clamp=(v,m)=>Math.max(-m,Math.min(m,v));world.add(new Body({pos:vec(clamp(x,8),clamp(y,8)),vel:vec(clamp(vx,20),clamp(vy,20)),mass:1,radius:.5,restitution:parseFloat($('restitution').value),color:'#ffe184',name:'keyboard launch'}));}
function download(){const headers=['t_s','energy_J','relative_energy_drift','contacts','body0_x','body0_y','body1_x','body1_y','body2_x','body2_y'];const csv=[headers.join(','),...rows.map(r=>r.join(','))].join('\n');const a=document.createElement('a');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.href=url;a.download='lab10_timeseries.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function overlays(){const ctx=renderer.ctx,p=input.state.cursor;
 if(p){const s=camera.worldToScreen(p);ctx.save();ctx.strokeStyle='#ffffff';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(s.x-12,s.y);ctx.lineTo(s.x+12,s.y);ctx.moveTo(s.x,s.y-12);ctx.lineTo(s.x,s.y+12);ctx.stroke();ctx.restore();}
 if(input.state.aim){const a=camera.worldToScreen(input.state.aim.start),b=camera.worldToScreen(input.state.aim.end);ctx.save();ctx.strokeStyle='#ffe184';ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);const v={x:(input.state.aim.start.x-input.state.aim.end.x)*2,y:(input.state.aim.start.y-input.state.aim.end.y)*2};const g=parseFloat($('gravity').value);ctx.beginPath();for(let i=0;i<=40;i++){const t=i*.05;const s=camera.worldToScreen({x:input.state.aim.start.x+v.x*t,y:input.state.aim.start.y+v.y*t-.5*g*t*t});if(i===0)ctx.moveTo(s.x,s.y);else ctx.lineTo(s.x,s.y);}ctx.stroke();ctx.restore();}
 if($('flashes').checked&&flash>0){ctx.save();ctx.strokeStyle='rgba(255,230,140,'+Math.min(1,flash/7)+')';ctx.lineWidth=3;for(const b of world.bodies){const s=camera.worldToScreen(b.pos);ctx.beginPath();ctx.arc(s.x,s.y,Math.max(3,camera.scale*b.radius+5),0,Math.PI*2);ctx.stroke();}ctx.restore();flash--;}}
let frameCounter=0;function frame(ms){if(running){if(acc.lastMs!==null){const delta=Math.max(0,Math.min(.08,(ms-acc.lastMs)/1000));acc.lastMs=ms;acc.acc+=delta*parseFloat($('speed').value);let n=0;while(acc.acc>=DT&&n<48){const before=world.collisionCount;world.step(DT);if(world.collisionCount>before)flash=8;acc.acc-=DT;n++;}if(n===48)acc.acc=0;acc.stepsLastFrame=n;}else acc.lastMs=ms;if(++frameCounter%6===0)sample();renderer.recordTrails(world);}else acc.lastMs=null;
 renderer.draw(world);overlays();$('clock').textContent=world.t.toFixed(4);$('contacts').textContent=world.collisionCount;$('cursorRead').textContent=input.state.cursor?input.state.cursor.x.toFixed(2)+', '+input.state.cursor.y.toFixed(2):'—';hud.update(world,acc,{fps:0,renderMs:0});requestAnimationFrame(frame);}
setupUI({integrators:INTEGRATORS,scenes:SCENES,toggle,step:singleStep,reset,parameters,visuals,download,keyboardLaunch,setIntegrator:()=>{world.integrator=new INTEGRATORS[$('integrator').value]();},setBroadphase:()=>world.broadPhase=$('broadphase').value,tests:()=>{try{$('testOut').textContent=validate().text;}catch(e){$('testOut').textContent=String(e);}}});
window.addEventListener('resize',resize);reset();requestAnimationFrame(frame);
