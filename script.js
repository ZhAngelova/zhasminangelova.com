/* ==========================================================
   Zhasmina Angelova, portfolio script
   Network hero, career path, filters, journey route, flip cards,
   bento, glossary, quick menu and cursor light
   ========================================================== */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header */
  const bar = document.getElementById('topbar');
  const onScroll = () => bar.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- Hero network: stars, aurora lines, filters, career path ---------- */
  const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const groups = {
    start:{v:'--n-start', name:'Where it started'},
    fin:{v:'--n-fin', name:'FinOps'},
    obs:{v:'--n-obs', name:'Observability'},
    iac:{v:'--n-iac', name:'Infrastructure as code'},
    aws:{v:'--n-aws', name:'AWS services'},
    code:{v:'--n-code', name:'Code and web'}
  };
  const T = {};
  function readTheme(){
    Object.values(groups).forEach(g => g.c = cssv(g.v));
    ['--edge','--edge-on','--label','--label-on','--ring','--node-stroke'].forEach(k => T[k] = cssv(k));
    T.halo = parseFloat(cssv('--halo')) || 0;
  }
  readTheme();
  window.setTheme = t => { if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; readTheme(); };
  const rgba = (hex,a) => { const h=hex.replace('#',''); const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; };

  const nodes = [
    {id:'hosp', t:'Hospitality', g:'start', r:17, x:.58, y:.78, d:'Over a decade in hospitality, from bartender to assistant restaurant manager. Where I learned to plan, keep calm and look after people.'},
    {id:'finops', t:'FinOps', g:'fin', r:20, x:.70, y:.55, d:'Making cloud costs easy to see and explain, so teams can make good decisions about scaling.'},
    {id:'ce', t:'Cost Explorer', g:'fin', r:12, x:.84, y:.66, d:'Dashboards that show where cloud spend goes, by service and by tag.'},
    {id:'tags', t:'Tagging', g:'fin', r:11, x:.80, y:.80, d:'A tagging strategy that makes every cost traceable to what created it.'},
    {id:'unit', t:'Unit costs', g:'fin', r:11, x:.66, y:.92, d:'Modelling cost per unit, so teams can plan for growth with real numbers.'},
    {id:'cw', t:'CloudWatch', g:'obs', r:16, x:.84, y:.34, d:'Dashboards, alarms and metric filters that show how workloads are doing.'},
    {id:'logs', t:'Logs Insights', g:'obs', r:11, x:.94, y:.48, d:'Queries that get to the root of an application error quickly.'},
    {id:'sns', t:'SNS', g:'obs', r:10, x:.95, y:.22, d:'Alerts that reach the right people when an alarm goes off.'},
    {id:'tf', t:'Terraform', g:'iac', r:18, x:.64, y:.28, d:'Writing infrastructure changes as code and taking them through peer review.'},
    {id:'tg', t:'Terragrunt', g:'iac', r:10, x:.55, y:.14, d:'Keeping Terraform code tidy and repeatable.'},
    {id:'sam', t:'AWS SAM', g:'iac', r:11, x:.74, y:.12, d:'My whole Glossary app defined as code, deployable with one command.'},
    {id:'lam', t:'Lambda', g:'aws', r:13, x:.52, y:.44, d:'Four Python functions power the API behind my AWS Services Glossary.'},
    {id:'ddb', t:'DynamoDB', g:'aws', r:11, x:.44, y:.60, d:'Stores the Glossary terms, with a condition expression that blocks duplicates.'},
    {id:'s3', t:'S3', g:'aws', r:11, x:.42, y:.30, d:'Hosting static frontends, including the Glossary.'},
    {id:'cf', t:'CloudFront', g:'aws', r:10, x:.36, y:.16, d:'Delivering the Glossary frontend fast, over HTTPS.'},
    {id:'bed', t:'Bedrock', g:'aws', r:10, x:.92, y:.86, d:'Explored generative AI on AWS during AWS re/Start.'},
    {id:'py', t:'Python', g:'code', r:13, x:.50, y:.88, d:'My go-to for Lambda functions, scripts and small tools.'},
    {id:'web', t:'Web', g:'code', r:11, x:.36, y:.84, d:'Hand-built websites for small businesses, plus a Figma prototype for Hyve Dynamics.'},
    {id:'git', t:'Git', g:'code', r:10, x:.30, y:.70, d:'Every change peer reviewed, in GitHub and GitLab.'}
  ];
  const links = [['hosp','finops'],['hosp','py'],['hosp','web'],['finops','ce'],['finops','tags'],['finops','unit'],['ce','tags'],['unit','py'],
    ['cw','logs'],['cw','sns'],['cw','tf'],['finops','cw'],['tf','tg'],['tf','sam'],['tf','finops'],['sam','lam'],['lam','ddb'],['lam','s3'],['s3','cf'],
    ['lam','py'],['ddb','py'],['git','tf'],['git','web'],['ce','bed'],['sam','cf'],['tags','tf']];
  const story = [
    ['hosp','Before 2019','Where it started','Over a decade in hospitality, growing from bartender to assistant restaurant manager.'],
    ['py','2024','Learning to code','A software development bootcamp, where Python became my go-to language.'],
    ['web','2024 to 2025','Building for real people','Websites for small businesses, and a Figma prototype for Hyve Dynamics.'],
    ['lam','Jan to May 2026','AWS re/Start','My first serverless app: the AWS Services Glossary.'],
    ['tf','2026','Infrastructure as code','Describing infrastructure as code, with every change peer reviewed.'],
    ['cw','2026','Observability','Dashboards and alarms that keep an eye on how workloads are doing.'],
    ['finops','Now','You are here','Making cloud costs easy to see, explain and plan for.']
  ];

  const cv = document.getElementById('net'), ctx = cv.getContext('2d');
  let W=0, H=0, dpr=1, mobile=false;
  const byId = {};
  nodes.forEach(n => { byId[n.id]=n; n.vx=0; n.vy=0; n.ph=Math.random()*Math.PI*2; });
  const E = links.map(([a,b]) => ({a:byId[a], b:byId[b]}));
  const pulses = [];
  const stars = Array.from({length:170}, () => ({x:Math.random(), y:Math.random(), r:Math.random()*1.3+.3, ph:Math.random()*6.3, sp:.6+Math.random()*1.8, z:Math.random()}));
  let shoot = null, nextShoot = 4000;

  function home(n){
    if (mobile) return {x:(.07 + (n.x-.3)/.65*.86)*W, y:H*.56 + n.y*H*.30};
    return {x:(.5 + (n.x-.3)/.65*.46)*W, y:H*.1 + n.y*H*.74};
  }
  function resize(){
    const r = cv.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio||1, 2); W = r.width; H = r.height; mobile = W < 760;
    cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    nodes.forEach(n => { const h=home(n); n.hx=h.x; n.hy=h.y; if(n.px===undefined){n.px=h.x;n.py=h.y;} });
  }
  addEventListener('resize', () => { nodes.forEach(n=>{n.px=undefined}); resize(); draw(performance.now()); });

  let mouse = {x:-999,y:-999}, drag=null, downAt=null, moved=false, active=null, hover=null, fg='';
  const pt = e => { const r=cv.getBoundingClientRect(); return {x:e.clientX-r.left, y:e.clientY-r.top}; };
  const hit = p => { let best=null, bd=1e9; nodes.forEach(n=>{ const d=Math.hypot(n.px-p.x,n.py-p.y); if(d<n.r+14 && d<bd){bd=d;best=n;} }); return best; };

  cv.addEventListener('pointermove', e => {
    mouse = pt(e);
    if (drag){ if (Math.hypot(mouse.x-downAt.x, mouse.y-downAt.y) > 5) moved = true; drag.px = mouse.x; drag.py = mouse.y; drag.vx=drag.vy=0; }
    hover = hit(mouse); cv.style.cursor = drag ? 'grabbing' : hover ? 'pointer' : 'grab';
  });
  cv.addEventListener('pointerleave', () => { mouse={x:-999,y:-999}; hover=null; });
  cv.addEventListener('pointerdown', e => {
    const p = pt(e); downAt = p; moved=false; drag = hit(p);
    if (drag){ cv.setPointerCapture(e.pointerId); cv.classList.add('dragging'); }
  });
  cv.addEventListener('pointerup', () => {
    if (drag && !moved){ stopPath(); show(drag); }
    if (drag && moved){ drag.hx = drag.px; drag.hy = drag.py; }
    drag=null; cv.classList.remove('dragging');
  });

  const card = document.getElementById('nodeCard');
  const hint = document.getElementById('hint');
  const tagEl = document.getElementById('nodeTag'), titleEl = document.getElementById('nodeTitle'), textEl = document.getElementById('nodeText');
  const tagBg = c => /^#?f{3,6}$/i.test(c.replace('#','')) || c.toLowerCase()==='#e2e8f0' ? '#E9E4FF' : c;
  function burst(n, c){ for (let i=0;i<4;i++) E.forEach(ed => { if (ed.a===n||ed.b===n) pulses.push({e:ed, t:-i*.25, dir: ed.a===n?1:-1, c}); }); }
  function show(n){
    active = n;
    const g = groups[n.g];
    tagEl.textContent = g.name; tagEl.style.background = tagBg(g.c);
    titleEl.textContent = n.t; textEl.textContent = n.d;
    card.classList.add('show'); hint.style.opacity = 0;
    burst(n, g.c);
  }
  function hideCard(){ card.classList.remove('show'); active=null; }
  document.getElementById('nodeClose').addEventListener('click', () => { hideCard(); stopPath(); });
  addEventListener('keydown', e => { if (e.key==='Escape'){ hideCard(); stopPath(); } });

  // keyboard access to every node
  const kb = document.getElementById('kbdNodes');
  nodes.forEach(n => { const b=document.createElement('button'); b.type='button'; b.textContent=n.t; b.addEventListener('click',()=>{ stopPath(); show(n); }); kb.appendChild(b); });

  // skill filters
  const fbtns = [...document.querySelectorAll('#filters button')];
  fbtns.forEach(b => b.addEventListener('click', () => {
    stopPath(); hideCard();
    fg = b.dataset.g;
    fbtns.forEach(x => x.setAttribute('aria-pressed', x===b));
    if (fg) nodes.filter(n=>n.g===fg).forEach(n => burst(n, groups[fg].c));
  }));

  // career path
  const pathBtn = document.getElementById('pathBtn');
  let path = null; // {t, last, done}
  function showStep(k){
    const [id, when, title, text] = story[k]; const n = byId[id];
    active = n;
    tagEl.textContent = `Step ${k+1} of ${story.length}, ${when}`; tagEl.style.background = tagBg(groups[n.g].c);
    titleEl.textContent = title; textEl.textContent = text;
    card.classList.add('show'); hint.style.opacity = 0;
    burst(n, groups[n.g].c);
  }
  function startPath(){
    fg=''; fbtns.forEach((x,i) => x.setAttribute('aria-pressed', i===0));
    path = {t: reduce ? story.length-1 : 0, last:-1, done: reduce};
    if (reduce){ showStep(story.length-1); }
    pathBtn.setAttribute('aria-pressed','true'); pathBtn.querySelector('span').textContent = 'Playing my path';
  }
  function stopPath(){ if (!path) return; path = null; pathBtn.setAttribute('aria-pressed','false'); pathBtn.querySelector('span').textContent = 'Show my path'; }
  pathBtn.addEventListener('click', () => { if (path && !path.done) { stopPath(); hideCard(); } else startPath(); });

  // ambient pulses
  setInterval(() => { if (document.hidden || reduce || path) return; const ed=E[Math.floor(Math.random()*E.length)]; if (fg && ed.a.g!==fg && ed.b.g!==fg) return; pulses.push({e:ed,t:0,dir:Math.random()<.5?1:-1,c:groups[ed.a.g].c}); }, 420);

  let lastT = 0;
  function step(t){
    const dt = Math.min(64, t - (lastT||t)); lastT = t;
    nodes.forEach(n => {
      if (n===drag) return;
      const fx = Math.sin(t*.0006 + n.ph)*10, fy = Math.cos(t*.0005 + n.ph*1.3)*8;
      let ax = (n.hx + fx - n.px)*.012, ay = (n.hy + fy - n.py)*.012;
      const dx = n.px-mouse.x, dy = n.py-mouse.y, d = Math.hypot(dx,dy);
      if (d < 110 && d > 0 && !drag){ const f=(110-d)/110*1.6; ax += dx/d*f; ay += dy/d*f; }
      n.vx = (n.vx+ax)*.86; n.vy = (n.vy+ay)*.86; n.px += n.vx; n.py += n.vy;
    });
    if (path && !path.done){
      path.t = Math.min(story.length-1, path.t + dt/1500);
      const k = Math.floor(path.t + 1e-6);
      if (k !== path.last){ path.last = k; showStep(k); }
      if (path.t >= story.length-1){ path.done = true; pathBtn.querySelector('span').textContent = 'Replay my path'; }
    }
    if (!reduce){
      nextShoot -= dt;
      if (nextShoot <= 0 && !shoot){ const fromLeft = Math.random()<.5; shoot = {x: W*(.35+Math.random()*.6), y: H*(.02+Math.random()*.25), vx:(fromLeft?1:-1)*(5+Math.random()*3), vy:2+Math.random()*1.5, life:1}; nextShoot = 6000 + Math.random()*7000; }
      if (shoot){ shoot.x += shoot.vx*dt/16; shoot.y += shoot.vy*dt/16; shoot.life -= dt/1100; if (shoot.life<=0) shoot=null; }
    }
  }

  function dimOf(n){
    if (path) return story.some(s=>s[0]===n.id) ? 1 : .22;
    if (fg) return n.g===fg ? 1 : .16;
    return 1;
  }
  function draw(t){
    ctx.clearRect(0,0,W,H);
    // stars with gentle parallax
    const mx = mouse.x>-900 ? (mouse.x-W/2) : 0, my = mouse.y>-900 ? (mouse.y-H/2) : 0;
    stars.forEach(s => {
      const a = .25 + .55*(.5+.5*Math.sin(t*.001*s.sp + s.ph));
      ctx.globalAlpha = a; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x*W - mx*.015*s.z, s.y*H - my*.015*s.z, s.r, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // shooting star
    if (shoot){
      const tx = shoot.x - shoot.vx*18, ty = shoot.y - shoot.vy*18;
      const g = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${.9*shoot.life})`); g.addColorStop(.3, `rgba(165,243,252,${.5*shoot.life})`); g.addColorStop(1,'rgba(52,211,153,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(tx, ty); ctx.stroke();
    }
    const focus = active || hover;
    // aurora edges
    E.forEach(ed => {
      const on = focus && (ed.a===focus||ed.b===focus);
      const dim = Math.min(dimOf(ed.a), dimOf(ed.b));
      const base = on ? .85 : .22*dim + (fg && dim===1 ? .25 : 0);
      const shimmer = .6 + .4*Math.sin(t*.0015 + ed.a.ph + ed.b.ph);
      const g = ctx.createLinearGradient(ed.a.px, ed.a.py, ed.b.px, ed.b.py);
      g.addColorStop(0, rgba(groups[ed.a.g].c, base*shimmer)); g.addColorStop(1, rgba(groups[ed.b.g].c, base*shimmer));
      ctx.strokeStyle = g; ctx.lineWidth = on ? 2.4 : 1.4;
      ctx.beginPath(); ctx.moveTo(ed.a.px,ed.a.py); ctx.lineTo(ed.b.px,ed.b.py); ctx.stroke();
    });
    // career path trail
    if (path){
      const pts = story.map(s => byId[s[0]]);
      const k = Math.floor(path.t), f = path.t - k;
      ctx.save();
      const g = ctx.createLinearGradient(pts[0].px, pts[0].py, pts[pts.length-1].px, pts[pts.length-1].py);
      g.addColorStop(0,'#F472B6'); g.addColorStop(.35,'#34D399'); g.addColorStop(.7,'#22D3EE'); g.addColorStop(1,'#A78BFA');
      ctx.strokeStyle = g; ctx.lineWidth = 4; ctx.lineCap='round'; ctx.lineJoin='round';
      ctx.shadowColor = 'rgba(52,211,153,.9)'; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.moveTo(pts[0].px, pts[0].py);
      for (let i=1;i<=k;i++) ctx.lineTo(pts[i].px, pts[i].py);
      let hx = pts[k].px, hy = pts[k].py;
      if (k < pts.length-1){ hx = pts[k].px + (pts[k+1].px-pts[k].px)*f; hy = pts[k].py + (pts[k+1].py-pts[k].py)*f; ctx.lineTo(hx, hy); }
      ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#A5F3FC'; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(hx, hy, 4.5, 0, 6.283); ctx.fill();
      ctx.restore();
    }
    // pulses
    for (let i=pulses.length-1;i>=0;i--){
      const p=pulses[i]; p.t += .012; if (p.t>1){pulses.splice(i,1);continue;} if (p.t<0) continue;
      const s = p.dir>0 ? p.t : 1-p.t, a=p.e.a, b=p.e.b;
      const x = a.px+(b.px-a.px)*s, y = a.py+(b.py-a.py)*s;
      ctx.fillStyle = p.c; ctx.globalAlpha = Math.sin(p.t*Math.PI) * Math.min(dimOf(a), dimOf(b));
      ctx.beginPath(); ctx.arc(x,y,3,0,6.283); ctx.fill(); ctx.globalAlpha=1;
    }
    // star nodes
    nodes.forEach(n => {
      const c = groups[n.g].c, on = n===focus, dim = dimOf(n);
      const tw = 1 + .06*Math.sin(t*.003 + n.ph);
      const r = n.r * (on ? 1.15 : 1) * tw * (fg && dim===1 ? 1.08 : 1);
      ctx.globalAlpha = dim;
      const glow = ctx.createRadialGradient(n.px,n.py,0,n.px,n.py,r*2.8);
      glow.addColorStop(0, rgba(c,.55)); glow.addColorStop(.45, rgba(c,.16)); glow.addColorStop(1, rgba(c,0));
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(n.px,n.py,r*2.8,0,6.283); ctx.fill();
      if (n.r >= 13){
        const L = r*2.3*(.85+.15*Math.sin(t*.002+n.ph)), rot = Math.sin(t*.0003+n.ph)*.15;
        ctx.save(); ctx.translate(n.px,n.py); ctx.rotate(rot);
        [[L,0],[0,L]].forEach(([lx,ly]) => {
          const sg = ctx.createLinearGradient(-lx,-ly,lx,ly);
          sg.addColorStop(0,'rgba(255,255,255,0)'); sg.addColorStop(.5,'rgba(255,255,255,.7)'); sg.addColorStop(1,'rgba(255,255,255,0)');
          ctx.strokeStyle = sg; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-lx,-ly); ctx.lineTo(lx,ly); ctx.stroke();
        });
        ctx.restore();
      }
      const core = ctx.createRadialGradient(n.px - r*.3, n.py - r*.3, 0, n.px, n.py, r);
      core.addColorStop(0,'#FFFFFF'); core.addColorStop(.35, c); core.addColorStop(1, c);
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(n.px,n.py,r,0,6.283); ctx.fill();
      if (on){ ctx.strokeStyle='rgba(255,255,255,.95)'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(n.px,n.py,r+5,0,6.283); ctx.stroke(); }
      const fs = mobile ? 11 : 13;
      ctx.font = `600 ${fs}px "Instrument Sans", system-ui, sans-serif`;
      ctx.fillStyle = on ? T['--label-on'] : T['--label'];
      ctx.textAlign = 'center'; ctx.fillText(n.t, n.px, n.py + r + fs + 6);
      ctx.globalAlpha = 1;
    });
  }
  let running = true;
  function loop(t){ if (running){ step(t); draw(t); } requestAnimationFrame(loop); }
  new IntersectionObserver(es => { running = es[0].isIntersecting; }).observe(cv);
  resize();
  if (reduce){ const still = () => { step(performance.now()); draw(0); }; still(); ['pointermove','pointerup'].forEach(ev => cv.addEventListener(ev, still)); document.getElementById('explore').addEventListener('click', () => setTimeout(still, 0)); }
  else requestAnimationFrame(loop);

  // depth on scroll: the starfield drifts away as you leave the hero
  const aur = document.querySelector('.hero .aurora');
  if (!reduce) addEventListener('scroll', () => {
    const y = scrollY, h = innerHeight; if (y > h*1.2) return;
    cv.style.transform = `translateY(${y*.28}px)`; cv.style.opacity = Math.max(0, 1 - y/h*.9);
    if (aur) aur.style.transform = `translateY(${y*.12}px)`;
  }, {passive:true});

  /* ---------- Route fill on scroll ---------- */
  const route = document.getElementById('route'), fill = document.getElementById('fill');
  const stops = [...route.querySelectorAll('.stop')];
  function routeUpdate(){
    const r = route.getBoundingClientRect(), full = r.height;
    route.style.setProperty('--full', full+'px');
    const prog = Math.max(0, Math.min(full, innerHeight*.6 - r.top));
    fill.style.height = (reduce ? full : prog) + 'px';
    stops.forEach(s => { const pin = s.querySelector('.pin').getBoundingClientRect(); s.classList.toggle('lit', reduce || pin.top - r.top < prog + 10); });
  }
  addEventListener('scroll', routeUpdate, {passive:true}); addEventListener('resize', routeUpdate); routeUpdate();

  /* ---------- Flip cards ---------- */
  const flips = [...document.querySelectorAll('.flip')];
  flips.forEach(f => f.addEventListener('click', () => f.setAttribute('aria-pressed', f.getAttribute('aria-pressed')==='true' ? 'false' : 'true')));
  const fa = document.getElementById('flipAll');
  fa.addEventListener('click', () => {
    const anyFront = flips.some(f => f.getAttribute('aria-pressed')==='false');
    flips.forEach((f,i) => setTimeout(() => f.setAttribute('aria-pressed', anyFront?'true':'false'), reduce?0:i*120));
    fa.textContent = anyFront ? 'Flip them back' : 'Flip them all';
  });

  /* ---------- Bento reveal + countdown ---------- */
  const bento = document.getElementById('bento');
  new IntersectionObserver((es,o) => { if (es[0].isIntersecting){ bento.classList.add('in'); o.disconnect(); } }, {threshold:.25}).observe(bento);
  const exam = new Date('2026-12-04T09:00:00');
  const days = Math.ceil((exam - new Date())/864e5);
  const cd = document.getElementById('countdown'), ct = document.getElementById('countText');
  if (days > 1){ cd.textContent = days + ' days'; ct.textContent = 'until my AWS Certified Cloud Practitioner exam on 4 December 2026.'; }
  else if (days >= 0){ cd.textContent = 'Exam week'; ct.textContent = 'AWS Certified Cloud Practitioner, 4 December 2026. Wish me luck!'; }
  else { cd.textContent = 'Done'; ct.textContent = 'AWS Certified Cloud Practitioner exam taken in December 2026.'; }

  /* ---------- Architecture explainer ---------- */
  const say = document.getElementById('archSay');
  const svc = {
    cf:'<b>CloudFront</b> serves the website quickly from locations close to each student, over HTTPS.',
    s3:'<b>S3</b> stores the static website files: the HTML, CSS and JavaScript.',
    api:'<b>API Gateway</b> is the front door for data: it receives requests to add, edit and search terms.',
    lam:'<b>Four Lambda functions</b> in Python do the work: create, read, update and search terms.',
    ddb:'<b>DynamoDB</b> stores every term, and refuses duplicates on its own.',
    sam:'<b>AWS SAM</b> defines all of this as code, so one command deploys the whole app.'
  };
  document.querySelectorAll('.svc').forEach(g => {
    const on = () => { document.querySelectorAll('.svc').forEach(x=>x.classList.remove('on')); g.classList.add('on'); say.innerHTML = svc[g.dataset.k]; };
    g.addEventListener('mouseenter', on); g.addEventListener('focus', on); g.addEventListener('click', on);
  });

  /* ---------- Mini glossary ---------- */
  const terms = [
    ['Lambda','Runs your code without servers to manage. You pay only while it runs.'],
    ['S3','Object storage for files of any size, from images to whole websites.'],
    ['CloudFront','A content delivery network that serves content from locations near your users.'],
    ['DynamoDB','A fast, fully managed NoSQL database.'],
    ['API Gateway','Creates and manages APIs that sit in front of your code.'],
    ['CloudWatch','Collects metrics and logs, and raises alarms when something looks wrong.'],
    ['Cost Explorer','Shows where your AWS money goes, and how spend changes over time.'],
    ['IAM','Controls who can do what in your AWS account.'],
    ['VPC','Your own private network inside AWS.'],
    ['ECS Fargate','Runs containers without managing the servers underneath.'],
    ['SNS','Sends notifications to people or systems, for example when an alarm fires.'],
    ['Bedrock','Access to foundation models for building generative AI apps.'],
    ['Terraform','Not AWS, but my favourite way to describe AWS infrastructure as code.']
  ];
  const gq = document.getElementById('gq'), gl = document.getElementById('gl');
  function renderG(){
    const q = gq.value.trim().toLowerCase();
    const hits = terms.filter(([a,b]) => !q || (a+' '+b).toLowerCase().includes(q)).slice(0, q ? 13 : 3);
    gl.innerHTML = hits.length ? hits.map(([a,b]) => `<li><b>${a}</b>${b}</li>`).join('') : '<li class="empty">No match yet. The real app lets students add it.</li>';
  }
  gq.addEventListener('input', renderG); renderG();


  /* ---------- Cursor light (desktop mouse only) ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce){
    document.querySelectorAll('.card, .tile, .arch, .mini').forEach(el => {
      el.classList.add('glow');
      const edge = document.createElement('span'); edge.className = 'edge'; edge.setAttribute('aria-hidden','true'); el.appendChild(edge);
    });
    const orb = document.createElement('div'); orb.id = 'cursorGlow'; orb.setAttribute('aria-hidden','true'); document.body.appendChild(orb);
    let tx = innerWidth/2, ty = innerHeight/2, ox = tx, oy = ty, raf = 0;
    const tick = () => { ox += (tx-ox)*.12; oy += (ty-oy)*.12; orb.style.transform = `translate(${ox}px,${oy}px)`; raf = (Math.abs(tx-ox)+Math.abs(ty-oy) > .5) ? requestAnimationFrame(tick) : 0; };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY; orb.classList.add('on');
      if (!raf) raf = requestAnimationFrame(tick);
      const g = e.target.closest && e.target.closest('.glow');
      if (g){ const r = g.getBoundingClientRect(); g.style.setProperty('--mx', (e.clientX-r.left)+'px'); g.style.setProperty('--my', (e.clientY-r.top)+'px'); }
    }, {passive:true});
    document.addEventListener('pointerleave', () => orb.classList.remove('on'));
    document.documentElement.addEventListener('mouseleave', () => orb.classList.remove('on'));
  }

  /* ---------- Contact night sky ---------- */
  (() => { const sky = document.getElementById('sky'); if (!sky) return; const pts = [];
    for (let i=0;i<140;i++){ const x=Math.round(Math.random()*2000), y=Math.round(Math.random()*900), a=(.3+Math.random()*.7).toFixed(2); pts.push(`${x}px ${y}px 0 ${Math.random()<.15?'1px':'0'} rgba(255,255,255,${a})`); }
    sky.style.boxShadow = pts.join(','); })();


  /* ---------- Toast ---------- */
  const toastEl = document.createElement('div'); toastEl.className='toast'; toastEl.setAttribute('role','status'); document.body.appendChild(toastEl);
  let toastT; const toast = msg => { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(()=>toastEl.classList.remove('show'), 2200); };
  const copyEmail = async () => { try { await navigator.clipboard.writeText('zhasminangelova@gmail.com'); toast('Email copied: zhasminangelova@gmail.com'); } catch { toast('My email is zhasminangelova@gmail.com'); } };

  /* ---------- Scroll progress + scrollspy ---------- */
  const prog = document.getElementById('prog');
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')].filter(a => a.getAttribute('href') !== '#contact');
  const spySecs = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function onScrollUI(){
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max>0 ? scrollY/max : 0})`;
    let cur = null; spySecs.forEach(sec => { if (sec.getBoundingClientRect().top < innerHeight*.4) cur = sec; });
    navLinks.forEach(a => a.classList.toggle('on', cur && a.getAttribute('href') === '#'+cur.id));
  }
  addEventListener('scroll', onScrollUI, {passive:true}); onScrollUI();

  /* ---------- Quick menu (command palette) ---------- */
  const cmdk = document.getElementById('cmdk'), kq = document.getElementById('kq'), klist = document.getElementById('klist');
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.getElementById('kKey').textContent = isMac ? '⌘K' : 'Ctrl K';
  const go = id => document.getElementById(id).scrollIntoView({behavior: reduce ? 'auto' : 'smooth'});
  const toHero = fn => { scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); setTimeout(fn, reduce ? 0 : 450); };
  const openLink = url => { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); };
  const filterBtn = g => document.querySelector(`#filters button[data-g="${g}"]`);
  const cmds = [
    {g:'Explore', t:'Play my career path', i:'spark', sub:'Hero', run:() => toHero(() => document.getElementById('pathBtn').click())},
    {g:'Explore', t:'Highlight FinOps skills', i:'coins', sub:'Hero', run:() => toHero(() => filterBtn('fin').click())},
    {g:'Explore', t:'Highlight Observability skills', i:'bell', sub:'Hero', run:() => toHero(() => filterBtn('obs').click())},
    {g:'Explore', t:'Highlight Infrastructure as code', i:'code', sub:'Hero', run:() => toHero(() => filterBtn('iac').click())},
    {g:'Explore', t:'Highlight AWS services', i:'cloud', sub:'Hero', run:() => toHero(() => filterBtn('aws').click())},
    {g:'Go to', t:'My journey', i:'pin', sub:'Section', run:() => go('journey')},
    {g:'Go to', t:'What the restaurant taught me', i:'glass', sub:'Section', run:() => go('carry')},
    {g:'Go to', t:'What I do now', i:'chart', sub:'Section', run:() => go('now')},
    {g:'Go to', t:'AWS Services Glossary project', i:'box', sub:'Section', run:() => go('projects')},
    {g:'Go to', t:'Toolkit and training', i:'cal', sub:'Section', run:() => go('toolkit')},
    {g:'Go to', t:'Contact', i:'chat', sub:'Section', run:() => go('contact')},
    {g:'Contact', t:'Copy my email', i:'copy', sub:'zhasminangelova@gmail.com', run:copyEmail},
    {g:'Contact', t:'Open LinkedIn', i:'link', sub:'New tab', run:() => openLink('https://www.linkedin.com/in/zhasmina-angelova/')},
    {g:'Contact', t:'Open GitHub', i:'link', sub:'New tab', run:() => openLink('https://github.com/ZhAngelova')}
  ];
  let shown = [], sel = 0, lastFocus = null;
  function renderK(){
    const q = kq.value.trim().toLowerCase();
    shown = cmds.filter(c => !q || (c.t+' '+c.g+' '+c.sub).toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length-1));
    if (!shown.length){ klist.innerHTML = '<li class="none">Nothing matches. Try "path", "email" or "projects".</li>'; kq.setAttribute('aria-activedescendant',''); return; }
    let html = '', grp = '';
    shown.forEach((c,i) => {
      if (c.g !== grp){ grp = c.g; html += `<li class="grp" role="presentation">${grp}</li>`; }
      html += `<li role="option" id="k${i}" data-i="${i}" aria-selected="${i===sel}"><svg class="ic" aria-hidden="true"><use href="#i-${c.i}"/></svg>${c.t}<span class="sub">${c.sub}</span></li>`;
    });
    klist.innerHTML = html; kq.setAttribute('aria-activedescendant', 'k'+sel);
    const cur = document.getElementById('k'+sel); if (cur) cur.scrollIntoView({block:'nearest'});
  }
  function openK(){ lastFocus = document.activeElement; cmdk.hidden = false; kq.value=''; sel=0; renderK(); kq.focus(); }
  function closeK(){ cmdk.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function runK(i){ const c = shown[i]; if (!c) return; closeK(); c.run(); }
  document.getElementById('kOpen').addEventListener('click', openK);
  kq.addEventListener('input', () => { sel = 0; renderK(); });
  kq.addEventListener('keydown', e => {
    if (e.key==='ArrowDown'){ e.preventDefault(); sel = (sel+1) % Math.max(1,shown.length); renderK(); }
    else if (e.key==='ArrowUp'){ e.preventDefault(); sel = (sel-1+shown.length) % Math.max(1,shown.length); renderK(); }
    else if (e.key==='Enter'){ e.preventDefault(); runK(sel); }
    else if (e.key==='Escape'){ e.preventDefault(); closeK(); }
    else if (e.key==='Tab'){ e.preventDefault(); }
  });
  klist.addEventListener('mousemove', e => { const li = e.target.closest('li[role=option]'); if (li && +li.dataset.i !== sel){ sel = +li.dataset.i; renderK(); } });
  klist.addEventListener('click', e => { const li = e.target.closest('li[role=option]'); if (li) runK(+li.dataset.i); });
  cmdk.addEventListener('click', e => { if (e.target === cmdk) closeK(); });
  addEventListener('keydown', e => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); cmdk.hidden ? openK() : closeK(); }
    else if (e.key==='/' && !typing && cmdk.hidden){ e.preventDefault(); openK(); }
  });

  /* ---------- Subtle 3D tilt on bento tiles (desktop mouse) ---------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce){
    document.querySelectorAll('.tile').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
        el.classList.add('tilting'); el.style.transform = `perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg) translateY(-2px)`;
      });
      el.addEventListener('pointerleave', () => { el.classList.remove('tilting'); el.style.transform = ''; });
    });
  }

  /* ---------- Copy email ---------- */
  document.getElementById('copyMail').addEventListener('click', async () => {
    const out = document.getElementById('copied');
    try { await navigator.clipboard.writeText('zhasminangelova@gmail.com'); out.textContent = 'Email copied. Speak soon!'; toast('Email copied'); }
    catch { out.textContent = 'Copy didn\'t work here. My email is zhasmina' + 'ngelova@gmail.com'; }
  });
})();
