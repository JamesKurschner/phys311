// Presentation-only input module; engine classes are unchanged from Lab 9.
import {vec} from './engine/Vec2.js';
export function setupInput(canvas,camera,access){
 const state={cursor:null,grab:null,aim:null,flash:0};
 const worldPoint=e=>{const r=canvas.getBoundingClientRect();return camera.screenToWorld({x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height});};
 const nearest=p=>{let best=null, dist=Infinity;for(const b of access.world().bodies){const d=b.pos.sub(vec(p.x,p.y)).len();if(d<Math.max(b.radius*2,0.7)&&d<dist){best=b;dist=d;}}return best;};
 canvas.addEventListener('pointermove',e=>{state.cursor=worldPoint(e);if(state.aim)state.aim.end=state.cursor;});
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);state.cursor=worldPoint(e);if(access.mode()==='launch'){state.aim={start:state.cursor,end:state.cursor};}else state.grab=nearest(state.cursor);});
 canvas.addEventListener('pointerup',e=>{const p=worldPoint(e);if(state.aim){access.launch(state.aim.start,p);state.aim=null;}state.grab=null;});
 canvas.addEventListener('pointercancel',()=>{state.grab=null;state.aim=null;});
 // A damped force toward the cursor. A body moves through integrator steps,
 // and collisions and walls remain active; its position is never teleported.
 const springForce={apply(){if(!state.grab||!state.cursor)return;const b=state.grab;const dx=state.cursor.x-b.pos.x,dy=state.cursor.y-b.pos.y;const k=60,c=15; b.applyForce(vec(Math.max(-500,Math.min(500,k*dx-c*b.vel.x)),Math.max(-500,Math.min(500,k*dy-c*b.vel.y))));}};
 return {state,worldPoint,springForce};
}
