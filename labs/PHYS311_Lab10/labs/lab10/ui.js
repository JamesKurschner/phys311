// DOM wiring isolated from the physics engine.
export function setupUI(api){const $=id=>document.getElementById(id); const updateLabel=(id,n=2)=>$(id+'Label').textContent=Number($(id).value).toFixed(n);
 for(const [key,cls] of Object.entries(api.integrators)){const o=document.createElement('option');o.value=key;o.textContent=cls.label; $('integrator').append(o);}$('integrator').value='VelocityVerlet';
 for(const [key,scene] of Object.entries(api.scenes)){const o=document.createElement('option');o.value=key;o.textContent=scene.label;$('scene').append(o);}$('scene').value='collisions';
 $('playpause').onclick=api.toggle;$('stepOnce').onclick=api.step;$('reset').onclick=api.reset;
 $('integrator').onchange=api.setIntegrator;$('scene').onchange=api.reset;$('ballCount').onchange=api.reset;$('broadphase').onchange=api.setBroadphase;
 $('speed').oninput=()=>{updateLabel('speed');$('speedLabel').textContent=Number($('speed').value).toFixed(2)+'×';};
 for(const [id,n] of [['gravity',2],['drag',3],['restitution',2]])$(''+id).oninput=()=>{updateLabel(id,n);api.parameters();};
 for(const id of ['trails','vectors','flashes','grid'])$(id).onchange=api.visuals;
 $('runTests').onclick=api.tests;$('launchButton').onclick=()=>api.keyboardLaunch(['launchX','launchY','launchVX','launchVY'].map(id=>parseFloat($(id).value)));$('download').onclick=api.download;
 document.addEventListener('keydown',e=>{const t=e.target.tagName;if(['INPUT','SELECT','TEXTAREA'].includes(t))return;if(e.code==='Space'){e.preventDefault();api.toggle();}if(e.key==='.')api.step();if(e.key.toLowerCase()==='r')api.reset();if(['+','=','-'].includes(e.key)){$('speed').value=Math.max(.25,Math.min(2,Number($('speed').value)+(e.key==='-'?-.25:.25)));$('speed').dispatchEvent(new Event('input'));}});
}
