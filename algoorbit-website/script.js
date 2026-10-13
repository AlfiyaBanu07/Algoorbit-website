const $=s=>document.querySelectorAll(s),nav=document.getElementById('nav'),menu=document.getElementById('menu'),hd=document.querySelector('header'),bar=document.getElementById('bar');
menu.onclick=()=>{menu.setAttribute('aria-expanded',nav.classList.toggle('show'))};
$('nav li>button').forEach(b=>b.onclick=e=>{const li=b.parentElement,w=li.classList.contains('open');$('nav li.open').forEach(x=>x.classList.remove('open'));if(!w)li.classList.add('open');b.setAttribute('aria-expanded',!w);e.stopPropagation()});
document.onclick=()=>$('nav li.open').forEach(x=>x.classList.remove('open'));
document.onkeydown=e=>{if(e.key==='Escape')$('nav li.open').forEach(x=>x.classList.remove('open'))};
addEventListener('scroll',()=>{hd.classList.toggle('sc',scrollY>10);bar.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$('.card,.st li,details,.sh,.frame:not(.hero .frame),.q,.note,figure').forEach(el=>{const sib=[...el.parentElement.children].indexOf(el);el.classList.add('rv');el.style.transitionDelay=Math.min(sib,5)*90+'ms';io.observe(el)});
const t=document.getElementById('type');
if(t){const sync=()=>$('.ex').forEach(x=>x.classList.toggle('show',x.dataset.for===t.value));const q=new URLSearchParams(location.search).get('type');if(q)t.value=q;t.onchange=sync;sync();
document.getElementById('f').onsubmit=e=>{e.preventDefault();/* TODO: send to your backend or a form service; show the message only after a successful response */const o=document.getElementById('ok');o.style.display='block';o.focus();e.target.reset();sync()}}
