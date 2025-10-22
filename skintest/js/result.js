// js/result.js
(function(){
  // Derive 4-letter like code from 5 axes
  function deriveType(v){
    // Oil: low->D, high->R, mid->N
    const oil = v.oil < 40 ? "D" : v.oil > 60 ? "R" : "N";
    // Water retention: high->R, low->N, mid->N (kept as N/R for demo)
    const water = v.water > 60 ? "R" : v.water < 40 ? "N" : "N";
    // Sensitivity: high->T, else N
    const sens = v.sensitivity > 60 ? "T" : "N";
    // Moisturizing need: high->M, low->P, mid->N
    const moist = v.moisturizing > 60 ? "M" : v.moisturizing < 40 ? "P" : "N";
    return oil + water + sens + moist;
  }

  function summarize(v){
    function bucket(n){ return n>60? "high" : n<40? "low" : "average"; }
    return [
      `Oil is ${bucket(v.oil)}`,
      `water retention is ${bucket(v.water)}`,
      `sensitivity is ${bucket(v.sensitivity)}`,
      `moisturizing is ${bucket(v.moisturizing)}`,
      `elasticity is ${bucket(v.elasticity)}`,
    ].join(", ") + ".";
  }

  const GOOD = ["ginseng","niacinamide","panthenol","squalane","ceramide","rice","green tea","adenosine","hyaluronic","allantoin","madecassoside","beta-glucan"];
  const BAD_SENSITIVE = ["fragrance","perfume","essential oil","limonene","linalool","citral","alcohol denat"];
  const BAD_OILY = ["coconut oil","isopropyl myristate","lanolin"];

  function scoreProduct(ingList, profile){
    let score = 60;
    const lower = ingList.map(s=>s.toLowerCase());

    // Good ingredients +3 each (cap 8)
    let goodHits = 0;
    GOOD.forEach(g=>{
      if (lower.some(x=>x.includes(g))) { score += 3; goodHits++; }
    });
    score += Math.min(8, goodHits); // small extra

    // Sensitive skin
    if (profile.sensitivity > 60){
      BAD_SENSITIVE.forEach(b=>{ if (lower.some(x=>x.includes(b))) score -= 7; });
    }
    // Oily skin
    if (profile.oil > 60){
      BAD_OILY.forEach(b=>{ if (lower.some(x=>x.includes(b))) score -= 5; });
    }
    // Dry skin reward for humectants
    if (profile.moisturizing > 60 || profile.water < 40){
      ["hyaluronic","beta-glucan","glycerin","panthenol","ceramide"].forEach(h=>{
        if (lower.some(x=>x.includes(h))) score += 4;
      });
    }
    return Math.max(10, Math.min(100, Math.round(score)));
  }

  function parseIngredientsFromHTML(html){
    if (!html) return [];
    const txt = html.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/g, " ");
    // naive split
    return txt.split(/[,|\\/\\n\\r]+/).map(s=>s.trim()).filter(Boolean).slice(0, 80);
  }

  async function fetchProducts(){
    const endpoints = [
      "https://beautyofjoseon.com/collections/shop-all/products.json",
      "https://beautyofjoseon.com/collections/all/products.json"
    ];
    for (const url of endpoints){
      try{
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) throw new Error("HTTP "+res.status);
        const data = await res.json();
        if (data && data.products) return data.products;
      }catch(e){
        console.warn("Fetch failed", url, e);
      }
    }
    // Fallback minimal set
    return [
      {
        id: 1,
        title: "Revive Serum: Ginseng + Snail Mucin",
        images:[{src:"https://cdn.shopify.com/s/files/1/0564/3285/9150/files/ginseng_serum.png?v=1"}],
        body_html: "Ingredients: Water, Glycerin, Panthenol, Snail Secretion Filtrate, Ginseng Root Extract, Niacinamide, Adenosine, Hyaluronic Acid, Allantoin",
        tags:"serum,ginseng,niacinamide,adenosine,hyaluronic"
      },
      {
        id: 2,
        title: "Glow Deep Serum: Rice + Alpha-Arbutin",
        images:[{src:"https://cdn.shopify.com/s/files/1/0564/3285/9150/files/rice_serum.png?v=1"}],
        body_html: "Ingredients: Water, Rice Bran Extract, Glycerin, Beta-Glucan, Panthenol, Allantoin, Sodium Hyaluronate, Arbutin, 1,2-Hexanediol",
        tags:"serum,rice,beta-glucan,panthenol"
      },
      {
        id: 3,
        title: "Relief Sun: Rice + Probiotics SPF50",
        images:[{src:"https://cdn.shopify.com/s/files/1/0564/3285/9150/files/relief_sun.png?v=1"}],
        body_html: "Ingredients: Water, Rice Extract, Glycerin, Niacinamide, Green Tea Extract, Probiotics, Silica, Fragrance",
        tags:"sunscreen,rice,niacinamide,green tea,fragrance"
      }
    ];
  }

  function renderProducts(products, profile){
    const wrap = document.getElementById("products");
    if (!wrap) return;
    wrap.innerHTML = "";
    wrap.classList.add("products");

    products.forEach(p=>{
      const ing = [...parseIngredientsFromHTML(p.body_html || ""), ...(p.tags||"").split(",")];
      const sc = scoreProduct(ing, profile);
      const goodShown = [];
      const badShown = [];

      const lower = ing.map(s=>s.toLowerCase());
      GOOD.forEach(g=>{ if (lower.some(x=>x.includes(g)) && goodShown.length<3) goodShown.push(g); });
      const badPool = [...BAD_SENSITIVE, ...BAD_OILY];
      badPool.forEach(b=>{ if (lower.some(x=>x.includes(b)) && badShown.length<2) badShown.push(b); });

      const img = (p.images && p.images[0] && p.images[0].src) ? p.images[0].src : "";
      const div = document.createElement("div");
      div.className = "product card";
      div.innerHTML = `
        <div class="media">
          ${img ? `<img alt="${p.title}" src="${img}" loading="lazy">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#667085">No Image</div>`}
          <div class="ingredient-labels">
            <div class="row">
              ${goodShown.map(x=>`<span class="badge good">+ ${x}</span>`).join("")}
              ${badShown.map(x=>`<span class="badge bad">- ${x}</span>`).join("")}
            </div>
          </div>
        </div>
        <div class="meta">
          <div class="title">${p.title}</div>
          <div class="badges">
            <span class="badge score">Score ${sc}</span>
            ${goodShown.map(x=>`<span class="badge good">${x}</span>`).join("")}
            ${badShown.map(x=>`<span class="badge bad">${x}</span>`).join("")}
          </div>
        </div>
      `;
      wrap.appendChild(div);
    });
  }

  function renderText(profile){
    const mbtiEl = document.getElementById("mbti");
    const summaryEl = document.getElementById("summary");
    if (mbtiEl) mbtiEl.textContent = deriveType(profile);
    if (summaryEl) { summaryEl.classList.add("summary"); summaryEl.textContent = summarize(profile); }
  }

  async function updateAll(v){
    renderText(v);
    if (window.SkinTest && window.SkinTest.drawRadar) window.SkinTest.drawRadar(v);
    const products = await fetchProducts();
    renderProducts(products, v);
  }

  document.addEventListener("DOMContentLoaded", async ()=>{
    const initial = (window.SkinTest && window.SkinTest.getValues) ? window.SkinTest.getValues() : {oil:50,water:50,sensitivity:50,moisturizing:50,elasticity:50};
    updateAll(initial);
    if (window.SkinTest && window.SkinTest.onValues){
      window.SkinTest.onValues(updateAll);
    }
  });
})();
