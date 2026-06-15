/* =============================================
   LLB CHAI WALA — script.js  (Complete)
   1.  Preloader
   2.  Wipe Overlay
   3.  Progress Engine
   4.  Exit Sequence
   5.  Navbar (scroll, active link)
   6.  Mobile Drawer
   7.  Cart Badge
   8.  Smooth Scroll
   9.  Hero Particles
   10. Hero Counters
   11. Hero Parallax + Ripple
============================================= */
'use strict';

/* ── 1. Particle System (Loader) ── */
const LoaderParticles=(function(){
  const COLS=['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
  let c,ctx,pts=[],raf,W,H;
  function mkPt(r){return{x:Math.random()*W,y:r?Math.random()*H:H+5,r:Math.random()*2+.4,vy:Math.random()*.45+.12,vx:(Math.random()-.5)*.25,op:Math.random()*.45+.08,col:COLS[Math.floor(Math.random()*COLS.length)],flick:Math.random()<.28};}
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  function draw(){ctx.clearRect(0,0,W,H);pts.forEach((p,i)=>{p.y-=p.vy;p.x+=p.vx;if(p.flick)p.op+=((Math.random()-.5)*.04);p.op=Math.min(.6,Math.max(.05,p.op));if(p.y<H*.25)p.op-=.003;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();if(p.r>1.4){ctx.beginPath();ctx.arc(p.x,p.y,p.r*2.8,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.12)+')';ctx.fill();}if(p.y<-8||p.op<=0)pts[i]=mkPt(false);});raf=requestAnimationFrame(draw);}
  function init(){c=document.getElementById('pCanvas');if(!c)return;ctx=c.getContext('2d');resize();for(let i=0;i<60;i++)pts.push(mkPt(true));draw();window.addEventListener('resize',resize,{passive:true});}
  function stop(){cancelAnimationFrame(raf);}
  document.addEventListener('visibilitychange',()=>document.hidden?stop():draw());
  return{init,stop};
})();

/* ── 2. Wipe Overlay ── */
const WipeOverlay=(function(){
  function init(){const o=document.getElementById('revealOverlay');if(!o)return;requestAnimationFrame(()=>setTimeout(()=>o.classList.add('wipe'),60));}
  return{init};
})();

/* ── 3. Progress Engine ── */
const ProgressEngine=(function(){
  const MSGS=['Warming up the kettle…','Grinding the finest leaves…','Adding a pinch of masala…','Almost ready, just a sec…','Pouring your perfect cup…','LLB style — coming right up!'];
  let pct=0,msgIdx=0,fillEl,pctEl,statusEl,dotEls,onComplete;
  function speed(){if(pct<30)return Math.random()*2.5+1.5;if(pct<70)return Math.random()*1.8+.8;if(pct<90)return Math.random()*1+.4;return Math.random()*.6+.2;}
  function interval(){return 28+Math.random()*(pct>85?80:55);}
  function updateDots(v){[20,40,60,80,100].forEach((t,i)=>{if(v>=t&&dotEls[i])dotEls[i].classList.add('active');});}
  function swapMsg(idx){if(!statusEl)return;statusEl.style.opacity='0';setTimeout(()=>{statusEl.textContent=MSGS[idx]||MSGS[MSGS.length-1];statusEl.style.opacity='1';},200);}
  function tick(){if(pct>=100){pctEl.textContent='100';fillEl.style.width='100%';statusEl.textContent='Chai ready!';updateDots(100);setTimeout(onComplete,600);return;}pct=Math.min(100,pct+speed());const r=Math.floor(pct);pctEl.textContent=r;fillEl.style.width=r+'%';updateDots(r);const ni=Math.min(MSGS.length-1,Math.floor(pct/17));if(ni!==msgIdx){msgIdx=ni;swapMsg(msgIdx);}setTimeout(tick,interval());}
  function init(cfg){fillEl=document.getElementById('pFill');pctEl=document.getElementById('pctNum');statusEl=document.getElementById('statusTxt');dotEls=document.getElementById('dotRow')?document.getElementById('dotRow').children:[];onComplete=cfg.onComplete||function(){};setTimeout(tick,500);}
  return{init};
})();

/* ── 4. Exit Sequence ── */
const ExitSequence=(function(){
  function run(){
    const loader=document.getElementById('preloader');
    const site=document.getElementById('siteMain');
    LoaderParticles.stop();
    if(loader)loader.classList.add('exit');
    setTimeout(()=>{
      if(loader)loader.style.display='none';
      if(site){site.removeAttribute('aria-hidden');site.style.display='block';}
      document.body.style.overflow='';
      initHeroSection();
    },820);
  }
  return{run};
})();

/* ── 5. Navbar ── */
(function(){
  const nav=document.getElementById('navbar');
  if(!nav)return;
  // Scroll glass effect
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',window.scrollY>30);
  },{passive:true});
  // Active link tracking
  const links=document.querySelectorAll('.nav-link');
  const sectionIds=['home','menu','offers','rewards','gallery','reviews','contact'];
  const sections=sectionIds.map(id=>document.getElementById(id)).filter(Boolean);
  if(sections.length){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          links.forEach(l=>l.classList.remove('active'));
          const a=document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if(a)a.classList.add('active');
        }
      });
    },{threshold:.3,rootMargin:'-60px 0px'});
    sections.forEach(s=>io.observe(s));
  }
})();

/* ── 6. Mobile Drawer ── */
(function(){
  const btn=document.getElementById('hamburger');
  const drawer=document.getElementById('mobileDrawer');
  const overlay=document.getElementById('drawerOverlay');
  if(!btn||!drawer)return;
  let open=false;
  function openD(){open=true;btn.classList.add('open');btn.setAttribute('aria-expanded','true');drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');if(overlay)overlay.classList.add('show');document.body.style.overflow='hidden';}
  function closeD(){open=false;btn.classList.remove('open');btn.setAttribute('aria-expanded','false');drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');if(overlay)overlay.classList.remove('show');document.body.style.overflow='';}
  btn.addEventListener('click',()=>open?closeD():openD());
  if(overlay)overlay.addEventListener('click',closeD);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)closeD();});
  drawer.querySelectorAll('.mobile-link,.drawer-cta').forEach(l=>l.addEventListener('click',closeD));
})();

/* ── 7. Cart Badge ── */
(function(){
  const btn=document.getElementById('cartBtn');
  const bubble=document.getElementById('cartBubble');
  if(!btn||!bubble)return;
  let count=0;
  btn.addEventListener('click',()=>{count=(count+1)%10;bubble.textContent=count;bubble.classList.toggle('show',count>0);});
})();

/* ── 8. Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(!t)return;e.preventDefault();
    const navH=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||70;
    window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-navH,behavior:'smooth'});
  });
});

/* ── 9. Hero Particles ── */
function initHeroParticles(){
  const c=document.getElementById('heroCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const COLS=['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
  let W,H,pts=[];
  function mkPt(r){return{x:Math.random()*W,y:r?Math.random()*H:H+5,r:Math.random()*2.2+.4,vy:Math.random()*.5+.1,vx:(Math.random()-.5)*.3,op:Math.random()*.4+.08,col:COLS[Math.floor(Math.random()*COLS.length)],flick:Math.random()<.3};}
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
  function draw(){ctx.clearRect(0,0,W,H);pts.forEach((p,i)=>{p.y-=p.vy;p.x+=p.vx;if(p.flick)p.op+=((Math.random()-.5)*.045);p.op=Math.min(.58,Math.max(.04,p.op));if(p.y<H*.3)p.op-=.0025;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();if(p.r>1.5){ctx.beginPath();ctx.arc(p.x,p.y,p.r*3,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();}if(p.y<-8||p.op<=0)pts[i]=mkPt(false);});requestAnimationFrame(draw);}
  resize();for(let i=0;i<65;i++)pts.push(mkPt(true));draw();
  window.addEventListener('resize',resize,{passive:true});
}

/* ── 10. Hero Counters ── */
function initHeroCounters(){
  const els=document.querySelectorAll('.stat-num[data-count]');if(!els.length)return;
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=parseInt(el.dataset.count,10),dur=1800,start=performance.now();(function tick(now){const p=Math.min((now-start)/dur,1),ease=1-Math.pow(1-p,3);el.textContent=Math.floor(ease*target).toLocaleString()+'+';if(p<1)requestAnimationFrame(tick);else el.textContent=target.toLocaleString()+'+';})(start);io.unobserve(el);});},{threshold:.5});
  els.forEach(el=>io.observe(el));
}

/* ── 11. Hero Parallax + Ripple ── */
function initHeroParallax(){
  const hero=document.getElementById('home');if(!hero)return;
  const content=hero.querySelector('.hero-content');
  const visual=hero.querySelector('.pour-visual');
  if(!content||!visual)return;
  let mx=0,my=0,cx=0,cy=0;
  hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();mx=((e.clientX-r.left)/r.width-.5)*2;my=((e.clientY-r.top)/r.height-.5)*2;});
  hero.addEventListener('mouseleave',()=>{mx=0;my=0;});
  (function loop(){cx+=(mx-cx)*.06;cy+=(my-cy)*.06;content.style.transform=`translate(${cx*6}px,${cy*4}px)`;visual.style.transform=`translate(${-cx*12}px,${-cy*6}px)`;requestAnimationFrame(loop);})();
  // Pour ripple
  const r=document.getElementById('splashRipple');if(!r)return;
  let rx=8,grow=true;(function anim(){grow?rx+=.3:rx-=.3;if(rx>14)grow=false;if(rx<6)grow=true;r.setAttribute('rx',rx);r.setAttribute('opacity',.3+(14-rx)/20);requestAnimationFrame(anim);})();
}

function initHeroSection(){initHeroParticles();initHeroCounters();initHeroParallax();}

/* ── BOOT ── */
document.addEventListener('DOMContentLoaded',()=>{
  document.body.style.overflow='hidden';
  WipeOverlay.init();
  LoaderParticles.init();
  ProgressEngine.init({onComplete:()=>ExitSequence.run()});
});

window.LLBChaiWala={ExitSequence,initHeroSection};


/* ============================================
   NAVBAR MODULE
============================================ */
const Navbar = (function(){

  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const links    = document.querySelectorAll('.nav-link[data-section]');
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('mobileDrawer');
  const backdrop   = document.getElementById('drawerBackdrop');
  const cartBadge  = document.getElementById('cartBadge');
  let drawerOpen = false;
  let cartCount  = 0;

  /* Sections for active-link tracking */
  const sections = [];
  links.forEach(link => {
    const id = link.dataset.section;
    const el = document.getElementById(id);
    if(el) sections.push({ id, el, link });
  });

  function onScroll(){
    const scrollY = window.scrollY;
    const docH    = document.documentElement.scrollHeight - window.innerHeight;

    /* Progress bar */
    if(progress) progress.style.width = (docH > 0 ? (scrollY/docH)*100 : 0) + '%';

    /* Glass effect */
    if(navbar){
      if(scrollY > 40){
        navbar.classList.remove('at-top');
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
        navbar.classList.add('at-top');
      }
    }

    /* Active section highlight */
    let current = '';
    sections.forEach(({ id, el }) => {
      if(el.getBoundingClientRect().top <= 100) current = id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  function openDrawer(){
    drawerOpen = true;
    if(hamburger){ hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded','true'); }
    if(drawer){ drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); }
    if(backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer(){
    drawerOpen = false;
    if(hamburger){ hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded','false'); }
    if(drawer){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
    if(backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateCart(count){
    cartCount = count;
    if(!cartBadge) return;
    cartBadge.textContent = count;
    cartBadge.classList.toggle('visible', count > 0);
  }

  function init(){
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    if(hamburger) hamburger.addEventListener('click', () => drawerOpen ? closeDrawer() : openDrawer());
    if(backdrop)  backdrop.addEventListener('click', closeDrawer);
    document.querySelectorAll('[data-drawer-link]').forEach(l => l.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && drawerOpen) closeDrawer(); });

    /* Smooth scroll with navbar offset */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if(!target) return;
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),10) || 70;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior:'smooth' });
      });
    });
  }

  return { init, updateCart, openDrawer, closeDrawer };
})();

/* Hook Navbar into site boot — runs after ExitSequence */
const _origNavRun = ExitSequence.run.bind ? ExitSequence.run : null;
document.addEventListener('DOMContentLoaded', () => Navbar.init());
window.LLBChaiWala = window.LLBChaiWala || {};
window.LLBChaiWala.Navbar = Navbar;


/* ============================================
   COUNTER SECTION MODULE
============================================ */
const CounterSection = (function(){

  /* Particle system for counter canvas */
  function initParticles(){
    const c = document.getElementById('counterCanvas');
    if(!c) return;
    const ctx  = c.getContext('2d');
    const COLS = ['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
    let W, H, pts = [], raf;

    function resize(){ W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; }

    function mkPt(rand){
      return{
        x: Math.random()*W, y: rand ? Math.random()*H : H+5,
        r: Math.random()*1.8+.3,
        vy: Math.random()*.4+.1, vx: (Math.random()-.5)*.2,
        op: Math.random()*.38+.06,
        col: COLS[Math.floor(Math.random()*COLS.length)],
        flick: Math.random()<.3
      };
    }

    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        p.y-=p.vy; p.x+=p.vx;
        if(p.flick) p.op+=(Math.random()-.5)*.035;
        p.op=Math.min(.5,Math.max(.04,p.op));
        if(p.y<H*.2) p.op-=.003;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.col+p.op+')';ctx.fill();
        if(p.r>1.2){
          ctx.beginPath();ctx.arc(p.x,p.y,p.r*2.8,0,Math.PI*2);
          ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();
        }
        if(p.y<-8||p.op<=0) pts[i]=mkPt(false);
      });
      raf=requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(()=>resize());
    ro.observe(c.parentElement||document.body);
    resize();
    for(let i=0;i<50;i++) pts.push(mkPt(true));
    draw();
  }

  /* Counter animation with scramble effect */
  function animateCount(el){
    const target = parseInt(el.dataset.target,10);
    const dur    = target>=5000 ? 2200 : target>=1000 ? 1800 : 1400;
    const start  = performance.now();
    const easeOut = t => 1-Math.pow(1-t,4);
    const fmt = n => n.toLocaleString('en-IN');

    (function tick(now){
      const progress = Math.min((now-start)/dur,1);
      if(progress < .35){
        el.textContent = fmt(Math.floor(Math.random()*target));
      } else {
        const p = (progress-.35)/.65;
        el.textContent = fmt(Math.floor(easeOut(Math.min(p,1))*target));
      }
      if(progress<1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    })(start);
  }

  /* Intersection observers */
  function initObservers(){
    const revealIO = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        e.target.classList.add('visible');
        revealIO.unobserve(e.target);
      });
    },{threshold:.15,rootMargin:'-40px 0px'});

    document.querySelectorAll('.counter-eyebrow,.counter-title,.counter-subtitle')
      .forEach(el=>revealIO.observe(el));

    const cardIO = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting) return;
        e.target.classList.add('visible');
        const countEl = e.target.querySelector('.card-count[data-target]');
        if(countEl){
          const idx = [...document.querySelectorAll('.js-card')].indexOf(e.target);
          setTimeout(()=>animateCount(countEl), idx*120+200);
        }
        cardIO.unobserve(e.target);
      });
    },{threshold:.2,rootMargin:'-30px 0px'});

    document.querySelectorAll('.js-card').forEach(el=>cardIO.observe(el));
  }

  /* 3-D tilt on mouse */
  function initTilt(){
    document.querySelectorAll('.counter-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        card.style.transform =
          `translateY(-6px) scale(1.02) perspective(600px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
      });
      card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
    });
  }

  function init(){
    initParticles();
    initObservers();
    initTilt();
  }

  return { init };
})();

/* Auto-init after DOM ready */
document.addEventListener('DOMContentLoaded', ()=> CounterSection.init());
window.LLBChaiWala = window.LLBChaiWala || {};
window.LLBChaiWala.CounterSection = CounterSection;




/* ============================================
   OFFERS SECTION MODULE
============================================ */
const OffersSection = (function(){

  function initParticles(){
    const c = document.getElementById('offersCanvas');
    if(!c) return;
    const ctx = c.getContext('2d');
    const COLS=['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
    let W,H,pts=[],raf;
    function resize(){ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; }
    function mkPt(r){ return{x:Math.random()*W,y:r?Math.random()*H:H+5,rad:Math.random()*1.6+.3,vy:Math.random()*.35+.09,vx:(Math.random()-.5)*.18,op:Math.random()*.35+.06,col:COLS[~~(Math.random()*4)],fl:Math.random()<.3}; }
    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        p.y-=p.vy;p.x+=p.vx;
        if(p.fl)p.op+=(Math.random()-.5)*.03;
        p.op=Math.min(.48,Math.max(.04,p.op));
        if(p.y<H*.15)p.op-=.003;
        ctx.beginPath();ctx.arc(p.x,p.y,p.rad,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();
        if(p.rad>1.1){ctx.beginPath();ctx.arc(p.x,p.y,p.rad*2.6,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();}
        if(p.y<-8||p.op<=0)pts[i]=mkPt(false);
      });
      raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(()=>resize());
    ro.observe(c.parentElement||document.body);
    resize();
    for(let i=0;i<45;i++)pts.push(mkPt(true));
    draw();
  }

  function initReveals(){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(!e.isIntersecting)return; e.target.classList.add('in'); io.unobserve(e.target); });
    },{threshold:.12,rootMargin:'-30px 0px'});
    document.querySelectorAll('#offers .js-in').forEach(el=>io.observe(el));
  }

  function initTilt(){
    document.querySelectorAll('.offer-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translateY(-8px) scale(1.02) perspective(700px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
      });
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }

  function initCountdown(){
    const end=Date.now()+(4*3600+30*60)*1000;
    function pad(n){return String(n).padStart(2,'0');}
    function tick(){
      const diff=Math.max(0,end-Date.now());
      const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
      document.querySelectorAll('#cdTimer1 .cd-h').forEach(el=>el.textContent=pad(h));
      document.querySelectorAll('#cdTimer1 .cd-m').forEach(el=>el.textContent=pad(m));
      document.querySelectorAll('#cdTimer1 .cd-s').forEach(el=>el.textContent=pad(s));
      if(diff>0)setTimeout(tick,1000);
    }
    if(document.getElementById('cdTimer1')) tick();
  }

  function init(){
    initParticles();
    initReveals();
    initTilt();
    initCountdown();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded',()=>OffersSection.init());
window.LLBChaiWala = window.LLBChaiWala||{};
window.LLBChaiWala.OffersSection = OffersSection;


/* ============================================
   MENU SECTION MODULE
============================================ */
const MenuSection = (function(){

  function initParticles(){
    const c=document.getElementById('menuCanvas');if(!c)return;
    const ctx=c.getContext('2d');
    const COLS=['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
    let W,H,pts=[],raf;
    function resize(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;}
    function mkPt(r){return{x:Math.random()*W,y:r?Math.random()*H:H+5,rad:Math.random()*1.6+.3,vy:Math.random()*.38+.09,vx:(Math.random()-.5)*.18,op:Math.random()*.32+.05,col:COLS[~~(Math.random()*4)],fl:Math.random()<.3};}
    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        p.y-=p.vy;p.x+=p.vx;
        if(p.fl)p.op+=(Math.random()-.5)*.03;
        p.op=Math.min(.45,Math.max(.04,p.op));
        if(p.y<H*.15)p.op-=.003;
        ctx.beginPath();ctx.arc(p.x,p.y,p.rad,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();
        if(p.rad>1.1){ctx.beginPath();ctx.arc(p.x,p.y,p.rad*2.6,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();}
        if(p.y<-8||p.op<=0)pts[i]=mkPt(false);
      });raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(()=>resize());ro.observe(c.parentElement||document.body);
    resize();for(let i=0;i<55;i++)pts.push(mkPt(true));draw();
  }

  function initReveals(){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);});
    },{threshold:.12,rootMargin:'-30px 0px'});
    document.querySelectorAll('.menu-eyebrow,.menu-title,.menu-sub,.menu-tabs').forEach(el=>io.observe(el));

    const cardIO=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');cardIO.unobserve(e.target);});
    },{threshold:.08,rootMargin:'-20px 0px'});
    document.querySelectorAll('.js-mc').forEach(el=>cardIO.observe(el));
  }

  function initFilters(){
    const tabs=document.querySelectorAll('.tab-btn');
    const cards=document.querySelectorAll('.menu-card');
    tabs.forEach(tab=>{
      tab.addEventListener('click',()=>{
        tabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        const f=tab.dataset.filter;
        cards.forEach(card=>{
          const show=f==='all'||card.dataset.cat===f;
          card.classList.toggle('hidden',!show);
          if(show&&!card.classList.contains('in'))setTimeout(()=>card.classList.add('in'),50);
        });
      });
    });
  }

  function initTilt(){
    document.querySelectorAll('.menu-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translateY(-6px) scale(1.02) perspective(600px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
      });
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }

  function initCart(){
    let cartItems=[];
    const toast=document.getElementById('cartToast');
    const toastMsg=document.getElementById('toastMsg');
    const toastCount=document.getElementById('toastCount');
    const fab=document.getElementById('menuCartFab');
    const fabBadge=document.getElementById('fabBadge');
    let toastTimer;

    document.querySelectorAll('.btn-cart').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const item=btn.dataset.item;
        const price=parseInt(btn.dataset.price,10);
        const existing=cartItems.find(c=>c.name===item);
        if(existing)existing.qty++;else cartItems.push({name:item,price,qty:1});

        btn.classList.add('added');
        const span=btn.querySelector('span');
        const orig=span.textContent;
        span.textContent='Added ✓';
        setTimeout(()=>{btn.classList.remove('added');span.textContent=orig;},1400);

        const total=cartItems.reduce((s,c)=>s+c.qty,0);
        if(toastMsg)toastMsg.textContent=`${item} added!`;
        if(toastCount)toastCount.textContent=total;
        if(toast){toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);}
        if(fabBadge)fabBadge.textContent=total;
        if(fab)fab.classList.add('show');

        /* Sync with global cart if Navbar module present */
        if(window.LLBChaiWala&&window.LLBChaiWala.Navbar)
          window.LLBChaiWala.Navbar.updateCart(total);
      });
    });
  }

  function init(){
    initParticles();
    initReveals();
    initFilters();
    initTilt();
    initCart();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded',()=>MenuSection.init());
window.LLBChaiWala=window.LLBChaiWala||{};
window.LLBChaiWala.MenuSection=MenuSection;


/* ============================================
   CART SYSTEM MODULE
============================================ */
const CartSystem = (function(){
  'use strict';

  /* ── State ── */
  const State = { items:[], coupon:null, isOpen:false };

  /* ── Coupons ── */
  const COUPONS = {
    CHAI50:     { label:'CHAI50',     type:'percent', value:50, desc:'50% off your order!' },
    STUDENT20:  { label:'STUDENT20',  type:'percent', value:20, desc:'20% student discount!' },
    LLBSPECIAL: { label:'LLBSPECIAL', type:'flat',    value:30, desc:'₹30 flat off!' },
  };

  /* ── DOM ── */
  let DOM = {};

  function cacheDom(){
    DOM = {
      overlay:       document.getElementById('cartOverlay'),
      panel:         document.getElementById('cartPanel'),
      closeBtn:      document.getElementById('cartCloseBtn'),
      itemsList:     document.getElementById('cartItemsList'),
      emptyState:    document.getElementById('cartEmpty'),
      itemCount:     document.getElementById('cartItemCount'),
      couponSection: document.getElementById('cartCouponSection'),
      couponInput:   document.getElementById('couponInput'),
      couponApply:   document.getElementById('couponApplyBtn'),
      couponMsg:     document.getElementById('couponMsg'),
      couponChip:    document.getElementById('couponChip'),
      couponChipLbl: document.getElementById('couponChipLabel'),
      couponRemove:  document.getElementById('couponRemoveBtn'),
      summary:       document.getElementById('cartSummary'),
      subtotal:      document.getElementById('summarySubtotal'),
      discountRow:   document.getElementById('discountRow'),
      discountLbl:   document.getElementById('discountLabel'),
      discountVal:   document.getElementById('discountVal'),
      delivery:      document.getElementById('summaryDelivery'),
      total:         document.getElementById('summaryTotal'),
      checkout:      document.getElementById('checkoutBtn'),
      fab:           document.getElementById('cartFab'),
      fabCount:      document.getElementById('fabCount'),
      toast:         document.getElementById('llbToast'),
      toastName:     document.getElementById('toastItemName'),
    };
  }

  /* ── Core ── */
  function uid(name){ return name.toLowerCase().replace(/\s+/g,'-'); }

  function addItem(name, price, emoji='☕'){
    const id=uid(name);
    const ex=State.items.find(i=>i.id===id);
    if(ex) ex.qty++;
    else State.items.push({id,name,price:+price,emoji,qty:1});
    renderAll(); showToast(name);
    /* Sync navbar cart badge */
    if(window.LLBChaiWala&&window.LLBChaiWala.Navbar)
      window.LLBChaiWala.Navbar.updateCart(totalCount());
  }

  function removeItem(id){
    const el=document.querySelector(`[data-row="${id}"]`);
    if(el){ el.classList.add('removing'); setTimeout(()=>{ State.items=State.items.filter(i=>i.id!==id); if(!State.items.length) clearCoupon(false); renderAll(); },350); }
  }

  function setQty(id,delta){
    const item=State.items.find(i=>i.id===id);
    if(!item)return;
    item.qty+=delta;
    if(item.qty<=0){ removeItem(id);return; }
    renderAll();
    const el=document.querySelector(`[data-qty="${id}"]`);
    if(el){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');}
  }

  function totals(){
    const sub=State.items.reduce((s,i)=>s+i.price*i.qty,0);
    let disc=0;
    if(State.coupon){ const c=State.coupon; disc=c.type==='percent'?Math.round(sub*c.value/100):Math.min(c.value,sub); }
    return{sub,disc,total:Math.max(0,sub-disc)};
  }

  function totalCount(){ return State.items.reduce((s,i)=>s+i.qty,0); }

  /* ── Render ── */
  function renderAll(){ renderItems(); renderSummary(); renderFab(); renderHeader(); toggleSections(); }

  function renderHeader(){ if(DOM.itemCount){ const n=totalCount(); DOM.itemCount.textContent=n===1?'1 item':`${n} items`; } }

  function renderFab(){
    if(!DOM.fab)return;
    const n=totalCount();
    if(DOM.fabCount){ DOM.fabCount.textContent=n; DOM.fabCount.classList.toggle('show',n>0); DOM.fabCount.classList.remove('pop');void DOM.fabCount.offsetWidth;DOM.fabCount.classList.add('pop'); }
  }

  function toggleSections(){
    const has=State.items.length>0;
    if(DOM.emptyState)    DOM.emptyState.style.display   = has?'none':'flex';
    if(DOM.couponSection) DOM.couponSection.style.display= has?'block':'none';
    if(DOM.summary)       DOM.summary.style.display      = has?'block':'none';
  }

  function renderItems(){
    if(!DOM.itemsList)return;
    DOM.itemsList.querySelectorAll('.cart-item').forEach(r=>r.remove());
    State.items.forEach(item=>{
      const row=document.createElement('div');
      row.className='cart-item';row.dataset.row=item.id;
      row.innerHTML=`
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-unit-price">₹${item.price} each</div>
        </div>
        <div class="item-qty">
          <button class="qty-btn minus" data-action="dec" data-id="${item.id}" aria-label="Decrease">−</button>
          <span class="qty-num" data-qty="${item.id}">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase">+</button>
        </div>
        <div class="item-subtotal">₹${item.price*item.qty}</div>
        <button class="item-remove" data-remove="${item.id}" aria-label="Remove ${item.name}">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>`;
      DOM.itemsList.insertBefore(row,DOM.emptyState||null);
    });
  }

  function renderSummary(){
    if(!DOM.subtotal)return;
    const{sub,disc,total}=totals();
    DOM.subtotal.textContent=`₹${sub}`;
    if(disc>0&&State.coupon){
      const c=State.coupon;
      if(DOM.discountLbl) DOM.discountLbl.textContent=`${c.label} (${c.type==='percent'?c.value+'%':'₹'+c.value+' off'})`;
      if(DOM.discountVal) DOM.discountVal.textContent=`-₹${disc}`;
      if(DOM.discountRow) DOM.discountRow.style.display='flex';
    } else {
      if(DOM.discountRow) DOM.discountRow.style.display='none';
    }
    const delivFee=total>=200||State.items.length===0?0:20;
    if(DOM.delivery) DOM.delivery.textContent=delivFee===0?'Free':'₹20';
    if(DOM.total)    DOM.total.textContent=`₹${total+delivFee}`;
  }

  /* ── Panel ── */
  function openPanel(){
    State.isOpen=true;
    if(DOM.overlay){DOM.overlay.classList.add('open');}
    if(DOM.panel){DOM.panel.classList.add('open');DOM.panel.setAttribute('aria-hidden','false');}
    document.body.style.overflow='hidden';
    setTimeout(()=>{if(DOM.closeBtn)DOM.closeBtn.focus();},500);
  }
  function closePanel(){
    State.isOpen=false;
    if(DOM.overlay)DOM.overlay.classList.remove('open');
    if(DOM.panel){DOM.panel.classList.remove('open');DOM.panel.setAttribute('aria-hidden','true');}
    document.body.style.overflow='';
  }

  /* ── Coupon ── */
  function applyCoupon(){
    if(!DOM.couponInput)return;
    const code=DOM.couponInput.value.trim().toUpperCase();
    if(!code){couponMsg('Enter a coupon code.','err');return;}
    if(State.coupon){couponMsg('Remove current coupon first.','err');return;}
    const found=COUPONS[code];
    if(!found){
      DOM.couponInput.classList.add('invalid');
      couponMsg('Invalid code. Try CHAI50, STUDENT20 or LLBSPECIAL.','err');
      setTimeout(()=>DOM.couponInput.classList.remove('invalid'),800);return;
    }
    State.coupon=found;
    DOM.couponInput.classList.add('valid');
    DOM.couponInput.disabled=true;if(DOM.couponApply)DOM.couponApply.disabled=true;
    if(DOM.couponChipLbl)DOM.couponChipLbl.textContent=`${found.label} — ${found.desc}`;
    if(DOM.couponChip)DOM.couponChip.classList.add('show');
    couponMsg(`✓ ${found.desc}`,'ok');renderSummary();
  }

  function clearCoupon(resetInput=true){
    State.coupon=null;
    if(resetInput&&DOM.couponInput){
      DOM.couponInput.value='';DOM.couponInput.classList.remove('valid','invalid');
      DOM.couponInput.disabled=false;if(DOM.couponApply)DOM.couponApply.disabled=false;
    }
    if(DOM.couponChip)DOM.couponChip.classList.remove('show');
    couponMsg('','');renderSummary();
  }

  function couponMsg(txt,type){
    if(!DOM.couponMsg)return;
    DOM.couponMsg.textContent=txt;
    DOM.couponMsg.className='coupon-msg'+(txt?' show':'')+(type?' '+type:'');
  }

  /* ── Checkout ── */
  function handleCheckout(){
    if(!State.items.length||!DOM.checkout)return;
    DOM.checkout.disabled=true;
    DOM.checkout.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Order Placed! 🎉`;
    DOM.checkout.style.background='linear-gradient(135deg,#16a34a,#4ade80)';
    setTimeout(()=>{
      State.items=[];clearCoupon(true);renderAll();closePanel();
      DOM.checkout.disabled=false;
      DOM.checkout.innerHTML=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Place Order`;
      DOM.checkout.style.background='';
    },2000);
  }

  /* ── Toast ── */
  let toastTimer;
  function showToast(name){
    if(!DOM.toast)return;
    if(DOM.toastName)DOM.toastName.textContent=name;
    DOM.toast.classList.add('show');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>DOM.toast.classList.remove('show'),2200);
  }

  /* ── Events ── */
  function bindEvents(){
    if(DOM.fab) DOM.fab.addEventListener('click',()=>State.isOpen?closePanel():openPanel());
    if(DOM.overlay) DOM.overlay.addEventListener('click',closePanel);
    if(DOM.closeBtn) DOM.closeBtn.addEventListener('click',closePanel);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&State.isOpen)closePanel();});

    /* Item list delegation */
    if(DOM.itemsList){
      DOM.itemsList.addEventListener('click',e=>{
        const inc=e.target.closest('[data-action="inc"]');
        const dec=e.target.closest('[data-action="dec"]');
        const rem=e.target.closest('[data-remove]');
        if(inc)setQty(inc.dataset.id,1);
        if(dec)setQty(dec.dataset.id,-1);
        if(rem)removeItem(rem.dataset.remove);
      });
    }

    /* Coupon */
    if(DOM.couponApply) DOM.couponApply.addEventListener('click',applyCoupon);
    if(DOM.couponRemove) DOM.couponRemove.addEventListener('click',()=>clearCoupon(true));
    if(DOM.couponInput) DOM.couponInput.addEventListener('keydown',e=>{if(e.key==='Enter')applyCoupon();});

    /* Checkout */
    if(DOM.checkout) DOM.checkout.addEventListener('click',handleCheckout);

    /* Wire up existing menu Add buttons */
    document.querySelectorAll('.btn-cart').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const item=btn.dataset.item;
        const price=btn.dataset.price;
        const emoji=btn.dataset.emoji||'☕';
        addItem(item,price,emoji);
        /* Visual feedback on btn */
        btn.classList.add('added');
        const span=btn.querySelector('span');
        if(span){const orig=span.textContent;span.textContent='Added ✓';setTimeout(()=>{btn.classList.remove('added');span.textContent=orig;},1400);}
      });
    });
  }

  function init(){
    cacheDom();
    if(!DOM.fab){return;}  /* Cart panel not in DOM yet, skip */
    bindEvents();
    renderAll();
  }

  /* Public API */
  return {
    init,
    add: addItem,
    open: openPanel,
    close: closePanel,
  };
})();

document.addEventListener('DOMContentLoaded',()=>CartSystem.init());
window.LLBChaiWala=window.LLBChaiWala||{};
window.LLBChaiWala.Cart=CartSystem;


/* ============================================
   BOOKING SECTION MODULE
============================================ */
const BookingSection = (function(){

  function initParticles(){
    const c=document.getElementById('bookingCanvas');if(!c)return;
    const ctx=c.getContext('2d');
    const COLS=['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
    let W,H,pts=[],raf;
    function resize(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;}
    function mk(r){return{x:Math.random()*W,y:r?Math.random()*H:H+5,rad:Math.random()*1.5+.3,vy:Math.random()*.35+.08,vx:(Math.random()-.5)*.15,op:Math.random()*.32+.05,col:COLS[~~(Math.random()*4)],fl:Math.random()<.3};}
    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        p.y-=p.vy;p.x+=p.vx;
        if(p.fl)p.op+=(Math.random()-.5)*.028;
        p.op=Math.min(.42,Math.max(.04,p.op));
        if(p.y<H*.15)p.op-=.003;
        ctx.beginPath();ctx.arc(p.x,p.y,p.rad,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();
        if(p.rad>1.1){ctx.beginPath();ctx.arc(p.x,p.y,p.rad*2.5,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();}
        if(p.y<-8||p.op<=0)pts[i]=mk(false);
      });raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(()=>resize());ro.observe(c.parentElement||document.body);
    resize();for(let i=0;i<40;i++)pts.push(mk(true));draw();
  }

  function initReveal(){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);});
    },{threshold:.12,rootMargin:'-30px 0px'});
    document.querySelectorAll('.js-bin').forEach(el=>io.observe(el));
  }

  function initDateMin(){
    const d=document.getElementById('bDate');if(!d)return;
    const today=new Date(),pad=n=>String(n).padStart(2,'0');
    d.min=`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
    const tom=new Date(today);tom.setDate(tom.getDate()+1);
    d.value=`${tom.getFullYear()}-${pad(tom.getMonth()+1)}-${pad(tom.getDate())}`;
  }

  function initPeopleCounter(){
    const inp=document.getElementById('bPeople');
    const minus=document.getElementById('pcMinus');
    const plus=document.getElementById('pcPlus');
    if(!inp)return;
    function upd(delta){
      const next=Math.min(12,Math.max(1,(parseInt(inp.value,10)||1)+delta));
      inp.value=next;
      if(minus)minus.style.opacity=next<=1?.35:1;
      if(plus)plus.style.opacity=next>=12?.35:1;
      inp.classList.remove('error');inp.classList.add('valid');
    }
    if(minus)minus.addEventListener('click',()=>upd(-1));
    if(plus)plus.addEventListener('click',()=>upd(1));
    upd(0);
  }

  function initCharCounter(){
    const ta=document.getElementById('bRequest');
    const cc=document.getElementById('charCount');
    if(!ta||!cc)return;
    ta.addEventListener('input',()=>{
      const n=ta.value.length;cc.textContent=n;
      cc.style.color=n>260?'#ef4444':n>200?'#f5891a':'';
    });
  }

  function setValid(id){
    const el=document.getElementById(id);if(!el)return;
    el.classList.remove('error');el.classList.add('valid');
    const errId='err'+id.charAt(1).toUpperCase()+id.slice(2);
    const err=document.getElementById(errId);if(err)err.classList.remove('show');
  }
  function setError(id,msg){
    const el=document.getElementById(id);if(!el)return;
    el.classList.remove('valid');el.classList.add('error');
    const errId='err'+id.charAt(1).toUpperCase()+id.slice(2);
    const err=document.getElementById(errId);
    if(err){if(msg)err.textContent=msg;err.classList.add('show');}
  }

  function initValidation(){
    document.getElementById('bName')?.addEventListener('blur',function(){
      this.value.trim().length>=2?setValid('bName'):setError('bName','Please enter your full name.');
    });
    document.getElementById('bPhone')?.addEventListener('blur',function(){
      const c=this.value.replace(/\D/g,'');
      c.length>=10&&c.length<=13?setValid('bPhone'):setError('bPhone','Enter a valid 10-digit number.');
    });
    document.getElementById('bDate')?.addEventListener('change',function(){
      this.value?setValid('bDate'):setError('bDate','Please select a date.');
    });
    document.getElementById('bTime')?.addEventListener('change',function(){
      this.value?setValid('bTime'):setError('bTime','Please select a time slot.');
    });
  }

  function initForm(){
    const form=document.getElementById('bookingForm');if(!form)return;

    form.addEventListener('submit',function(e){
      e.preventDefault();let ok=true;
      const name=document.getElementById('bName')?.value.trim()||'';
      const phone=(document.getElementById('bPhone')?.value||'').replace(/\D/g,'');
      const date=document.getElementById('bDate')?.value||'';
      const time=document.getElementById('bTime')?.value||'';

      if(name.length<2){setError('bName','Please enter your full name.');ok=false;}else setValid('bName');
      if(phone.length<10||phone.length>13){setError('bPhone','Enter a valid 10-digit number.');ok=false;}else setValid('bPhone');
      if(!date){setError('bDate','Please select a date.');ok=false;}else setValid('bDate');
      if(!time){setError('bTime','Please select a time slot.');ok=false;}else setValid('bTime');
      if(!ok)return;

      const btn=document.getElementById('bookBtn');
      const lbl=document.getElementById('bookBtnLabel');
      if(btn)btn.disabled=true;if(lbl)lbl.textContent='Confirming…';

      setTimeout(()=>{
        const ref='LLB'+String(Math.floor(1000+Math.random()*9000));
        const refEl=document.getElementById('successRef');if(refEl)refEl.textContent=`REF #${ref}`;
        const success=document.getElementById('formSuccess');
        if(success){success.classList.add('show');success.setAttribute('aria-hidden','false');}
      },1400);
    });

    document.getElementById('bookAgainBtn')?.addEventListener('click',()=>{
      const success=document.getElementById('formSuccess');
      if(success){success.classList.remove('show');success.setAttribute('aria-hidden','true');}
      form.reset();
      document.querySelectorAll('#bookingForm input,#bookingForm select,#bookingForm textarea')
        .forEach(el=>el.classList.remove('valid','error'));
      document.querySelectorAll('#bookingForm .field-error').forEach(el=>el.classList.remove('show'));
      const cc=document.getElementById('charCount');if(cc)cc.textContent='0';
      const btn=document.getElementById('bookBtn');if(btn)btn.disabled=false;
      const lbl=document.getElementById('bookBtnLabel');if(lbl)lbl.textContent='Confirm Booking';
      initDateMin();
      const pi=document.getElementById('bPeople');if(pi)pi.value=2;
    });
  }

  function init(){
    initParticles();
    initReveal();
    initDateMin();
    initPeopleCounter();
    initCharCounter();
    initValidation();
    initForm();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded',()=>BookingSection.init());
window.LLBChaiWala=window.LLBChaiWala||{};
window.LLBChaiWala.BookingSection=BookingSection;


/* ============================================
   REWARDS SECTION MODULE
============================================ */
const RewardsSection = (function(){

  function initParticles(){
    const c=document.getElementById('rewardsCanvas');if(!c)return;
    const ctx=c.getContext('2d');
    const COLS=['rgba(212,160,48,','rgba(232,114,12,','rgba(240,192,96,','rgba(180,90,10,'];
    let W,H,pts=[],raf;
    function resize(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;}
    function mk(r){return{x:Math.random()*W,y:r?Math.random()*H:H+5,rad:Math.random()*1.8+.3,vy:Math.random()*.38+.08,vx:(Math.random()-.5)*.18,op:Math.random()*.35+.06,col:COLS[~~(Math.random()*4)],fl:Math.random()<.3};}
    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        p.y-=p.vy;p.x+=p.vx;
        if(p.fl)p.op+=(Math.random()-.5)*.03;
        p.op=Math.min(.48,Math.max(.04,p.op));
        if(p.y<H*.15)p.op-=.003;
        ctx.beginPath();ctx.arc(p.x,p.y,p.rad,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();
        if(p.rad>1.2){ctx.beginPath();ctx.arc(p.x,p.y,p.rad*2.6,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();}
        if(p.y<-8||p.op<=0)pts[i]=mk(false);
      });raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(()=>resize());ro.observe(c.parentElement||document.body);
    resize();for(let i=0;i<48;i++)pts.push(mk(true));draw();
  }

  function initReveals(){
    const hIO=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');hIO.unobserve(e.target);});
    },{threshold:.12,rootMargin:'-30px 0px'});
    document.querySelectorAll('.js-rw').forEach(el=>hIO.observe(el));

    const cIO=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(!e.isIntersecting)return;
        e.target.classList.add('in');
        e.target.querySelectorAll('.rp-fill[data-fill]').forEach(bar=>{
          setTimeout(()=>{bar.style.width=bar.dataset.fill+'%';},100);
        });
        cIO.unobserve(e.target);
      });
    },{threshold:.18,rootMargin:'-30px 0px'});
    document.querySelectorAll('.js-rc').forEach(el=>cIO.observe(el));
  }

  function initTilt(){
    document.querySelectorAll('.reward-card').forEach(card=>{
      card.addEventListener('mousemove',e=>{
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`translateY(-8px) scale(1.02) perspective(700px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
      });
      card.addEventListener('mouseleave',()=>card.style.transform='');
    });
  }

  function init(){
    initParticles();
    initReveals();
    initTilt();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded',()=>RewardsSection.init());
window.LLBChaiWala=window.LLBChaiWala||{};
window.LLBChaiWala.RewardsSection=RewardsSection;


/* ============================================
   GALLERY SECTION MODULE
============================================ */
const GallerySection = (function(){

  function initParticles(){
    const c=document.getElementById('galleryCanvas');if(!c)return;
    const ctx=c.getContext('2d');
    const COLS=['rgba(232,114,12,','rgba(212,160,48,','rgba(245,137,26,','rgba(180,90,10,'];
    let W,H,pts=[],raf;
    function resize(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;}
    function mk(r){return{x:Math.random()*W,y:r?Math.random()*H:H+5,rad:Math.random()*1.6+.3,vy:Math.random()*.35+.08,vx:(Math.random()-.5)*.16,op:Math.random()*.32+.05,col:COLS[~~(Math.random()*4)],fl:Math.random()<.3};}
    function draw(){
      ctx.clearRect(0,0,W,H);
      pts.forEach((p,i)=>{
        p.y-=p.vy;p.x+=p.vx;
        if(p.fl)p.op+=(Math.random()-.5)*.028;
        p.op=Math.min(.44,Math.max(.04,p.op));
        if(p.y<H*.15)p.op-=.003;
        ctx.beginPath();ctx.arc(p.x,p.y,p.rad,0,Math.PI*2);ctx.fillStyle=p.col+p.op+')';ctx.fill();
        if(p.rad>1.1){ctx.beginPath();ctx.arc(p.x,p.y,p.rad*2.5,0,Math.PI*2);ctx.fillStyle=p.col+(p.op*.1)+')';ctx.fill();}
        if(p.y<-8||p.op<=0)pts[i]=mk(false);
      });raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(()=>resize());ro.observe(c.parentElement||document.body);
    resize();for(let i=0;i<45;i++)pts.push(mk(true));draw();
  }

  function initReveals(){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);});
    },{threshold:.1,rootMargin:'-20px 0px'});
    document.querySelectorAll('.js-gl').forEach(el=>io.observe(el));

    const iio=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');iio.unobserve(e.target);});
    },{threshold:.06,rootMargin:'-10px 0px'});
    document.querySelectorAll('.js-gitem').forEach((el,i)=>{
      el.style.transitionDelay=(i*0.06)+'s';
      iio.observe(el);
    });
  }

  function initFilters(){
    const filters=document.querySelectorAll('.gl-filter');
    const items=document.querySelectorAll('.gl-item');
    filters.forEach(btn=>{
      btn.addEventListener('click',()=>{
        filters.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat=btn.dataset.cat;
        items.forEach(item=>{
          const match=cat==='all'||item.dataset.cat===cat;
          item.classList.toggle('filtered-out',!match);
          if(match&&!item.classList.contains('in'))item.classList.add('in');
        });
      });
    });
  }

  function initLightbox(){
    const lb=document.getElementById('lightbox');if(!lb)return;
    const lbEmoji=document.getElementById('lbEmoji');
    const lbTitle=document.getElementById('lbTitle');
    const lbDesc=document.getElementById('lbDesc');
    const lbTag=document.getElementById('lbTag');
    const lbCounter=document.getElementById('lbCounter');
    const lbDots=document.getElementById('lbDots');
    const lbClose=document.getElementById('lbClose');
    const lbPrev=document.getElementById('lbPrev');
    const lbNext=document.getElementById('lbNext');
    let allItems=[],currentIndex=0;

    function buildItems(){allItems=[...document.querySelectorAll('.gl-item:not(.filtered-out)')];}

    function buildDots(){
      if(!lbDots)return;
      lbDots.innerHTML='';
      allItems.forEach((_,i)=>{
        const d=document.createElement('div');
        d.className='lb-dot'+(i===currentIndex?' active':'');
        d.addEventListener('click',()=>show(i));
        lbDots.appendChild(d);
      });
    }

    function show(idx){
      if(!allItems.length)return;
      currentIndex=(idx+allItems.length)%allItems.length;
      const item=allItems[currentIndex];
      if(lbEmoji){lbEmoji.style.opacity='0';lbEmoji.style.transform='scale(.7)';}
      setTimeout(()=>{
        if(lbEmoji){lbEmoji.textContent=item.querySelector('.gl-emoji')?.textContent||'☕';lbEmoji.style.opacity='1';lbEmoji.style.transform='';}
        if(lbTitle)lbTitle.textContent=item.dataset.title||'';
        if(lbDesc)lbDesc.textContent=item.dataset.desc||'';
        if(lbTag)lbTag.textContent=item.dataset.tag||'';
        if(lbCounter)lbCounter.textContent=`${currentIndex+1} / ${allItems.length}`;
        buildDots();
      },180);
    }

    function open(item){
      buildItems();
      const idx=allItems.indexOf(item);
      currentIndex=idx>=0?idx:0;
      show(currentIndex);
      lb.classList.add('open');lb.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    }

    function close(){
      lb.classList.remove('open');lb.setAttribute('aria-hidden','true');
      document.body.style.overflow='';
    }

    document.querySelectorAll('.gl-item').forEach(item=>item.addEventListener('click',()=>open(item)));
    if(lbClose)lbClose.addEventListener('click',close);
    lb.addEventListener('click',e=>{if(e.target===lb)close();});
    if(lbPrev)lbPrev.addEventListener('click',e=>{e.stopPropagation();show(currentIndex-1);});
    if(lbNext)lbNext.addEventListener('click',e=>{e.stopPropagation();show(currentIndex+1);});
    document.addEventListener('keydown',e=>{
      if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')close();
      if(e.key==='ArrowLeft')show(currentIndex-1);
      if(e.key==='ArrowRight')show(currentIndex+1);
    });
    let touchX=0;
    lb.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;},{passive:true});
    lb.addEventListener('touchend',e=>{
      const diff=touchX-e.changedTouches[0].clientX;
      if(Math.abs(diff)>50){diff>0?show(currentIndex+1):show(currentIndex-1);}
    });
  }

  function init(){
    initParticles();
    initReveals();
    initFilters();
    initLightbox();
  }

  return{init};
})();

document.addEventListener('DOMContentLoaded',()=>GallerySection.init());
window.LLBChaiWala=window.LLBChaiWala||{};
window.LLBChaiWala.GallerySection=GallerySection;