// js/radar.js
// Lightweight radar chart without external libs
(function(){
  function drawRadar(canvas, values){
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const W = canvas.clientWidth * dpr;
    const H = canvas.clientHeight * dpr;
    canvas.width = W; canvas.height = H;
    ctx.scale(dpr, dpr);

    // Setup
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    const cx = w/2, cy = h/2;
    const radius = Math.min(w,h)*0.40;
    const axes = [
      { key:"oil", label:"Oil"},
      { key:"water", label:"Water"},
      { key:"sensitivity", label:"Sensitivity"},
      { key:"moisturizing", label:"Moisturizing"},
      { key:"elasticity", label:"Elasticity"},
    ];
    const N = axes.length;

    // Guides
    ctx.save();
    ctx.translate(cx, cy);
    const rings = 4;
    for(let r=1;r<=rings;r++){
      const rr = (radius * r) / rings;
      ctx.beginPath();
      for(let i=0;i<N;i++){
        const ang = (-Math.PI/2) + (i*2*Math.PI/N);
        const x = rr * Math.cos(ang);
        const y = rr * Math.sin(ang);
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle = "#2b3344";
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Axes
    axes.forEach((a,i)=>{
      const ang = (-Math.PI/2) + (i*2*Math.PI/N);
      const x = radius * Math.cos(ang);
      const y = radius * Math.sin(ang);
      ctx.beginPath();
      ctx.moveTo(0,0); ctx.lineTo(x,y);
      ctx.strokeStyle = "#2b3344"; ctx.stroke();

      // labels
      const lx = (radius + 18) * Math.cos(ang);
      const ly = (radius + 18) * Math.sin(ang);
      ctx.fillStyle = "#aab2bf";
      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.textAlign = lx>0? "left": lx<0? "right":"center";
      ctx.textBaseline = ly>0? "top" : "bottom";
      ctx.fillText(a.label, lx, ly);
    });

    // Data polygon
    const points = axes.map((a,i)=>{
      const v = Math.max(0, Math.min(100, values[a.key] ?? 0)) / 100;
      const ang = (-Math.PI/2) + (i*2*Math.PI/N);
      return { x: (radius*v)*Math.cos(ang), y: (radius*v)*Math.sin(ang) };
    });

    ctx.beginPath();
    points.forEach((p,i)=>{ if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
    ctx.closePath();
    ctx.fillStyle = "rgba(122,215,255,0.18)";
    ctx.strokeStyle = "rgba(122,215,255,0.7)";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // Points
    points.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fillStyle = "#7ad7ff";
      ctx.fill();
      ctx.strokeStyle = "#0e2234";
      ctx.stroke();
    });

    ctx.restore();
  }

  function ensureCanvas(){
    const el = document.getElementById("radarCanvas");
    return el || null;
  }

  // public API
  window.SkinTest = window.SkinTest || {};
  window.SkinTest.drawRadar = (values)=> drawRadar(ensureCanvas(), values);

  document.addEventListener("DOMContentLoaded", ()=>{
    const cv = ensureCanvas();
    if (!cv) return;
    const v = (window.SkinTest && window.SkinTest.getValues) ? window.SkinTest.getValues() : {oil:50,water:50,sensitivity:50,moisturizing:50,elasticity:50};
    drawRadar(cv, v);

    // update on value changes
    if (window.SkinTest && window.SkinTest.onValues){
      window.SkinTest.onValues(vals => drawRadar(cv, vals));
    }
  });
})();
