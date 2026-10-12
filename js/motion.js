/* Scroll reveal, counters, progress bar */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* scroll progress bar */
  var bar=document.createElement('div');bar.className='scroll-bar';document.body.appendChild(bar);
  function prog(){var h=document.documentElement;var m=h.scrollHeight-h.clientHeight;bar.style.transform='scaleX('+(m>0?h.scrollTop/m:0)+')';}
  addEventListener('scroll',prog,{passive:true});prog();

  /* counters */
  function count(el){
    var m=el.textContent.match(/^([\d.]+)(.*)$/);if(!m)return;
    var end=parseFloat(m[1]),suf=m[2],dec=(m[1].split('.')[1]||'').length,dur=1600,t0=null;
    if(reduce){return;}
    el.textContent=(0).toFixed(dec)+suf;
    (function step(t){t0=t0||t;var p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,3);
      el.textContent=(end*e).toFixed(dec)+suf;if(p<1)requestAnimationFrame(step);})(performance.now());
  }
  var stats=document.querySelectorAll('.hx-trust b');
  if(stats.length){
    if('IntersectionObserver' in window&&!reduce){
      var so=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){
        stats.forEach(function(s,i){setTimeout(function(){count(s)},i*180)});so.disconnect();}});},{threshold:.6});
      so.observe(document.querySelector('.hx-trust'));
    }
  }
  /* About page: "120+ across 18 industries" */
  document.querySelectorAll('dd').forEach(function(d){
    var m=d.textContent.match(/^(\d+)\+(.*)$/);if(!m||reduce||!('IntersectionObserver' in window))return;
    var span=document.createElement('span');span.textContent=m[1]+'+';d.textContent='';d.appendChild(span);d.appendChild(document.createTextNode(m[2]));
    var o=new IntersectionObserver(function(en){if(en[0].isIntersecting){count(span);o.disconnect();}},{threshold:.8});o.observe(d);
  });

  /* reveal on scroll */
  if(reduce||!('IntersectionObserver' in window))return;
  var sel='.section-head,.tile,.work,.price,.step,.t-card,.mini-quote,.quote-feature,.cta,.info li,.form-panel,.story-visual,.founder,.hx-p-cards';
  var io=new IntersectionObserver(function(en){en.forEach(function(x){
    if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll(sel).forEach(function(el){
    if(el.closest('.hx'))return;
    var sib=Array.prototype.indexOf.call(el.parentNode.children,el);
    el.style.setProperty('--d',(Math.min(sib,5)*90)+'ms');
    el.classList.add('rv');io.observe(el);
  });
})();
