(() => {
  const root=document.documentElement, key='mosenjo-review-theme';
  try{const saved=localStorage.getItem(key);if(saved==='light'||saved==='dark')root.dataset.theme=saved;}catch(e){}
  const buttons=[...document.querySelectorAll('.theme-toggle')];
  function refresh(){for(const b of buttons){const light=root.dataset.theme!=='dark';b.querySelector('.theme-icon').textContent=light?'☾':'☀';b.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');b.setAttribute('title',light?'Dark mode':'Light mode');}}
  refresh();
  for(const b of buttons)b.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,root.dataset.theme);}catch(e){};refresh();b.classList.remove('just-clicked');void b.offsetWidth;b.classList.add('just-clicked');setTimeout(()=>b.classList.remove('just-clicked'),1250);});
  const menu=document.querySelector('.menu-toggle');
  if(menu){
    const close=()=>{document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
    menu.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
    document.querySelectorAll('.navigation a').forEach(a=>a.addEventListener('click',()=>close()));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){close();menu.focus();}});
    matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches)close();});
  }
})();