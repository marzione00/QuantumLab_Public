/* Quantum Lab · ambient geometry. Decorative only; never reads simulation data.
   No library, remote resource, WebGL or coupling to model PRNGs. */
(function () {
  'use strict';
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
  const WIDE = matchMedia('(min-width: 1200px)');
  const KEY = 'tm-quantum-ambient';
  const allowed = ['animated', 'static', 'off'];
  const cfg = globalThis.QuantumLabConfig?.ambient || {};
  let preference;
  try { preference = localStorage.getItem(KEY); } catch { /* Storage is optional. */ }
  if (!allowed.includes(preference)) preference = cfg.defaultMode || 'animated';
  let raf = 0, last = 0, clock = 0, drawCount = 0, root, canvases = [], dialog, opener;
  const fps = Math.min(30, Math.max(5, cfg.maxFramesPerSecond || 20));
  const glyphs = ['0','1','ψ','φ','α','β','θ','λ','ρ','π','∑','⊗','H','X','Z'];
  const formulas = ['|ψ⟩ = α|0⟩ + β|1⟩','|α|² + |β|² = 1','U†U = I','P(0) = |α|²','ρ = |ψ⟩⟨ψ|','[X,Z] ≠ 0','⟨ψ|ψ⟩ = 1','H² = I'];
  const mode = () => preference === 'off' ? 'off' : REDUCED.matches ? 'static' : preference;
  const active = () => mode() === 'animated' && WIDE.matches && !document.hidden && canvases.length;
  const project = (x,y,z,r,cx,cy,angle) => {
    const a=x*Math.cos(angle)+y*Math.sin(angle), b=-x*Math.sin(angle)+y*Math.cos(angle);
    return [cx+r*a, cy-r*(z*.88+b*.46)];
  };
  function curve(ctx, points, alpha, color, width=1) {
    ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=width;ctx.beginPath();
    points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.globalAlpha=1;
  }
  function bloch(ctx, w, y, t, color, side) {
    const r=Math.min(w*.36,49), cx=w/2, a=.58+side*.62;
    // Schematic projection of a unit sphere, a great circle and a pure-state vector.
    const pts=(fn)=>Array.from({length:81},(_,i)=>{const q=i*Math.PI*2/80;return project(...fn(q),r,cx,y,a);});
    curve(ctx,pts(q=>[Math.cos(q),Math.sin(q),0]),.43,color);
    curve(ctx,pts(q=>[Math.cos(q),0,Math.sin(q)]),.3,color);
    curve(ctx,pts(q=>[0,Math.cos(q),Math.sin(q)]),.25,color);
    for(const v of [[1.14,0,0],[0,1.14,0],[0,0,1.14]]) curve(ctx,[project(...v.map(n=>-n),r,cx,y,a),project(...v,r,cx,y,a)],.14,color);
    const theta=1.0+side*.36,phi=t*.07+side*1.4;
    const tip=project(Math.sin(theta)*Math.cos(phi),Math.sin(theta)*Math.sin(phi),Math.cos(theta),r,cx,y,a);
    curve(ctx,[[cx,y],tip],.85,color,1.5);
    ctx.fillStyle=color;ctx.globalAlpha=.9;ctx.beginPath();ctx.arc(...tip,2.5,0,2*Math.PI);ctx.fill();
    ctx.globalAlpha=.55;ctx.font='10px ui-monospace, monospace';ctx.textAlign='center';
    ctx.fillText('|0⟩',cx,y-r-10);ctx.fillText('|1⟩',cx,y+r+19);ctx.globalAlpha=1;
  }
  function paint(canvas, side, time) {
    const rect=canvas.getBoundingClientRect(), w=rect.width,h=rect.height;
    if(w<1||h<1)return;
    const dpr=Math.min(devicePixelRatio||1,1.5);
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)) {canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    const ctx=canvas.getContext('2d'); if(!ctx)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const light=document.documentElement.dataset.theme==='light';
    const color=light?'#176346':'#91e6b2';
    const columns=Math.max(2,Math.floor(w/17));
    ctx.font='12px ui-monospace, SFMono-Regular, Consolas, monospace';ctx.textAlign='center';
    for(let c=0;c<columns;c++) {
      const x=(c+.55)*w/columns, speed=9+(c*7+side*5)%13;
      const head=((time*speed+c*137+side*83)%(h+320))-80;
      for(let k=0;k<17;k++) {
        const y=head-k*18;if(y<-18||y>h+18)continue;
        // Stable glyphs: no flashing character substitution.
        const index=(c*7+k*11+side*3)%glyphs.length;
        ctx.globalAlpha=(light?.17:.27)*(1-k/18);
        ctx.fillStyle=color;ctx.fillText(glyphs[index],x,y);
      }
    }
    // Spatial regions are fixed; ambient movement does not track the experiment.
    const sphereY=Math.max(185,Math.min(h*.35,330));
    bloch(ctx,w,sphereY,time,color,side);
    const waveY=Math.min(h-125,sphereY+240);
    const points=Array.from({length:120},(_,i)=>{const u=i/119;return [10+u*(w-20),waveY+Math.sin(u*Math.PI*4-time*.23+side)*Math.exp(-Math.pow((u-.5)*2.1,2))*25];});
    curve(ctx,points,.52,color,1.2);
    curve(ctx,[[10,waveY],[w-10,waveY]],.15,color);
    ctx.textAlign='center';ctx.font='9px ui-monospace, monospace';ctx.fillStyle=color;ctx.globalAlpha=.5;
    ctx.fillText(side?'eⁱφ · sin(θ/2)':'cos(θ/2)',w/2,waveY+44);
    ctx.save();ctx.translate(side?w-14:14,h*.52);ctx.rotate(side?-Math.PI/2:Math.PI/2);
    ctx.globalAlpha=.38;ctx.font='10px ui-monospace, monospace';ctx.fillText(formulas[side?4:0],0,0);ctx.restore();
    ctx.globalAlpha=.45;ctx.font='8px ui-monospace, monospace';ctx.fillText(side?'AMPLITUDES / PHASE':'QUANTUM / FIELD',w/2,h-34);ctx.globalAlpha=1;
  }
  function draw() { if(!root)return;root.dataset.mode=mode();root.hidden=mode()==='off';if(mode()!=='off'&&WIDE.matches){canvases.forEach((c,i)=>paint(c,i,clock));drawCount++;} }
  function frame(ts) {
    raf=0;if(!active())return;
    if(!last||ts-last>=1000/fps){clock+=last?Math.min((ts-last)/1000,.1):0;last=ts;draw();}
    raf=requestAnimationFrame(frame);
  }
  function refresh() {if(raf)cancelAnimationFrame(raf);raf=0;last=0;draw();if(active())raf=requestAnimationFrame(frame);syncControls();}
  function setMode(value) {
    if(!allowed.includes(value))throw Error('Modalità ambientale non valida.');
    preference=value;try{localStorage.setItem(KEY,value);}catch{}refresh();
  }
  function syncControls() {
    if(!dialog)return;
    dialog.querySelectorAll('[name=ql-ambient-mode]').forEach(r=>{r.checked=r.value===mode();r.disabled=r.value==='animated'&&REDUCED.matches;});
    dialog.querySelector('[data-reduced-note]').hidden=!REDUCED.matches;
    opener?.setAttribute('aria-label',`Effetti visivi: ${mode()==='animated'?'animati':mode()==='static'?'statici':'disattivati'}`);
  }
  function mount() {
    if(root)return;
    root=document.createElement('div');root.id='ql-ambient';root.setAttribute('aria-hidden','true');root.innerHTML='<canvas class="ql-rail ql-rail-left"></canvas><canvas class="ql-rail ql-rail-right"></canvas>';
    document.body.prepend(root);canvases=Array.from(root.querySelectorAll('canvas'));
    dialog=document.createElement('dialog');dialog.id='ql-effects-dialog';dialog.setAttribute('aria-labelledby','ql-effects-title');dialog.className='ql-effects-dialog';
    dialog.innerHTML='<form method="dialog"><div class="ql-effects-heading"><div><p class="ql-eyebrow">ASPETTO / ATMOSFERA</p><h2 id="ql-effects-title">Geometrie ai margini.</h2></div><button value="close" aria-label="Chiudi gli effetti visivi" autofocus>×</button></div><p>Codice in scorrimento, sfere di Bloch e onde di fase. Sono una cornice decorativa: non rappresentano lo stato dell’esperimento.</p><fieldset><legend>Movimento</legend><label><input type="radio" name="ql-ambient-mode" value="animated"> Animato <small>Scorrimento lento, soltanto sui margini ampi.</small></label><label><input type="radio" name="ql-ambient-mode" value="static"> Statico <small>Geometrie visibili, nessun movimento.</small></label><label><input type="radio" name="ql-ambient-mode" value="off"> Disattivato <small>Solo il laboratorio.</small></label></fieldset><p data-reduced-note hidden>È attiva la preferenza di sistema per il movimento ridotto: l’atmosfera rimane statica.</p><p class="ql-caption">Sui telefoni i margini sono nascosti e il disegno è sospeso. La preferenza resta soltanto nel tuo browser.</p><button class="ql-button" value="close">Torna al laboratorio</button></form>';
    document.body.append(dialog);opener=document.getElementById('ql-effects');
    opener?.addEventListener('click',()=>{syncControls();dialog.showModal();});
    dialog.addEventListener('change',e=>{if(e.target.name==='ql-ambient-mode')setMode(e.target.value);});
    dialog.addEventListener('close',()=>opener?.focus({preventScroll:true}));
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    REDUCED.addEventListener('change',refresh);WIDE.addEventListener('change',refresh);
    window.addEventListener('resize',refresh,{passive:true});document.addEventListener('visibilitychange',refresh);
    new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    refresh();
  }
  globalThis.QuantumAmbient=Object.freeze({mount,setMode,getState:()=>({preference,effectiveMode:mode(),wide:WIDE.matches,reducedMotion:REDUCED.matches,hidden:document.hidden,running:!!raf,drawCount,framesPerSecondLimit:fps})});
})();
