// js/quiz.js
// Minimal quiz state manager + storage + event wiring
(function () {
  const STORAGE_KEY = "skin-quiz-values-v1";
  // Default values (0-100 scale) for 5 axes: oil, water, sensitivity, moisturizing, elasticity
  const defaults = { oil: 50, water: 50, sensitivity: 50, moisturizing: 50, elasticity: 50 };

  function clamp(n, min=0, max=100){ return Math.max(min, Math.min(max, n)); }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    } catch(e) {
      console.warn("Failed to load quiz values:", e);
      return { ...defaults };
    }
  }

  function save(values) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); }
    catch(e){ console.warn("Failed to save quiz values:", e); }
  }

  // Optionally read from URL like ?oil=30&water=70...
  function fromURL() {
    const u = new URLSearchParams(location.search);
    const maybe = {};
    ["oil","water","sensitivity","moisturizing","elasticity"].forEach(k=>{
      if (u.has(k)) maybe[k] = clamp(Number(u.get(k)));
    });
    return Object.keys(maybe).length ? maybe : null;
  }

  const state = { values: load() };
  const urlVals = fromURL();
  if (urlVals) {
    state.values = { ...state.values, ...urlVals };
    save(state.values);
  }

  // Simple control bindings if range inputs exist in DOM
  function bindSliders() {
  function findAxisInput(key){
    // Prefer data-axis
    let el = document.querySelector(`[data-axis="${key}"]`);
    if (el) return el;
    // Try id contains
    el = document.querySelector(`#${key}, [id*="${key}"]`);
    if (el) return el;
    // Try name contains
    el = document.querySelector(`[name="${key}"], [name*="${key}"]`);
    return el || null;
  }

    const keys = ["oil","water","sensitivity","moisturizing","elasticity"];
    keys.forEach(k=>{
      const el = findAxisInput(k);
      if (!el) return;
      el.value = state.values[k];
      const out = document.querySelector(`[data-axis-out="${k}"]`);
      if (out) out.textContent = String(state.values[k]);
      el.addEventListener("input", (e)=>{
        state.values[k] = clamp(Number(e.target.value));
        if (out) out.textContent = String(state.values[k]);
        save(state.values);
        document.dispatchEvent(new CustomEvent("skin:values", { detail: {...state.values} }));
      });
    });
  }

  // Public API available to other modules
  window.SkinTest = window.SkinTest || {};
  window.SkinTest.getValues = () => ({ ...state.values });
  window.SkinTest.setValues = (v) => { state.values = {...state.values, ...v}; save(state.values); document.dispatchEvent(new CustomEvent("skin:values", { detail: {...state.values} })); };
  window.SkinTest.onValues = (fn) => document.addEventListener("skin:values", (e)=>fn(e.detail));

  // Init after DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    bindSliders();
    // Emit initial
    document.dispatchEvent(new CustomEvent("skin:values", { detail: {...state.values} }));
  });
})();
