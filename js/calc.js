/* Blyvax price calculator — edit PRICES below to change any number */
(function(){
  var root=document.getElementById('calcApp');if(!root)return;
  var PRICES={
    types:{
      site:{name:'Business website',base:12999,incl:5,extra:1500,service:'Web Development',desc:'Company, portfolio or landing site'},
      shop:{name:'Online store',base:29999,incl:12,extra:2000,service:'E-commerce Solutions',desc:'Sell products with cart & checkout'},
      app:{name:'Custom web app',base:39999,incl:10,extra:3000,service:'Custom Web App',desc:'Dashboards, portals, booking systems'}
    },
    features:[
      {id:'seo',name:'SEO setup',cost:5000},
      {id:'blog',name:'Blog / CMS',cost:6000},
      {id:'pay',name:'Payment gateway',cost:7000,hide:['shop']},
      {id:'admin',name:'Admin dashboard',cost:11000,hide:['shop','app']},
      {id:'lang',name:'Multi-language',cost:4000},
      {id:'anim',name:'3D & premium animations',cost:8000},
      {id:'brand',name:'Logo & brand kit',cost:3000}
    ],
    fastMultiplier:1.25, rangeLow:.9, rangeHigh:1.15
  };
  var S={type:'site',pages:5,feats:{},fast:false,shown:0};
  var inr=function(n){return '₹'+Math.round(n).toLocaleString('en-IN');};
  var r500=function(n){return Math.round(n/500)*500;};

  root.innerHTML=
   '<div class="calc-main">'+
    '<div class="calc-step"><h3><b>1</b>What are you building?</h3><div class="calc-types" id="cTypes"></div></div>'+
    '<div class="calc-step"><h3><b>2</b>How many pages / screens?</h3>'+
      '<div class="calc-range"><input type="range" id="cPages" min="1" max="25" value="5" aria-label="Number of pages"><output id="cPagesOut">5</output></div>'+
      '<p class="calc-hint" id="cPagesHint"></p></div>'+
    '<div class="calc-step"><h3><b>3</b>Any extras?</h3><div class="calc-feats" id="cFeats"></div></div>'+
    '<div class="calc-step"><h3><b>4</b>How soon do you need it?</h3><div class="calc-time" id="cTime">'+
      '<button type="button" data-fast="0" class="on"><strong>Standard</strong><span>3–4 weeks</span></button>'+
      '<button type="button" data-fast="1"><strong>Fast track</strong><span>~2 weeks · +25%</span></button></div></div>'+
   '</div>'+
   '<aside class="calc-sum"><span class="calc-label">Your estimate</span>'+
    '<div class="calc-price" id="cPrice">₹0</div><p class="calc-note">One-time build cost. Final quote after a short call.</p>'+
    '<ul class="calc-break" id="cBreak"></ul>'+
    '<a class="btn btn-coral btn-block" id="cQuote" href="contact.html">Get exact quote</a>'+
    '<a class="calc-wa" id="cWa" target="_blank" rel="noopener" href="#">or discuss on WhatsApp</a></aside>';

  var $=function(id){return document.getElementById(id);};

  function buildTypes(){
    $('cTypes').innerHTML=Object.keys(PRICES.types).map(function(k){var t=PRICES.types[k];
      return '<button type="button" data-type="'+k+'" class="'+(k===S.type?'on':'')+'"><strong>'+t.name+'</strong><span>'+t.desc+'</span><em>from '+inr(t.base)+'</em></button>';}).join('');
  }
  function buildFeats(){
    $('cFeats').innerHTML=PRICES.features.filter(function(f){return !(f.hide||[]).includes(S.type);}).map(function(f){
      return '<button type="button" data-feat="'+f.id+'" class="'+(S.feats[f.id]?'on':'')+'" aria-pressed="'+!!S.feats[f.id]+'"><i></i>'+f.name+'<em>+'+inr(f.cost)+'</em></button>';}).join('');
  }
  function calc(){
    var t=PRICES.types[S.type],lines=[['Base · '+t.name,t.base]],sub=t.base;
    var extra=Math.max(0,S.pages-t.incl);
    if(extra){var c=extra*t.extra;lines.push([extra+' extra page'+(extra>1?'s':''),c]);sub+=c;}
    PRICES.features.forEach(function(f){if(S.feats[f.id]&&!(f.hide||[]).includes(S.type)){lines.push([f.name,f.cost]);sub+=f.cost;}});
    if(S.fast){var up=sub*(PRICES.fastMultiplier-1);lines.push(['Fast-track delivery',up]);sub+=up;}
    return {lines:lines,lo:r500(sub*PRICES.rangeLow),hi:r500(sub*PRICES.rangeHigh),t:t};
  }
  function tween(to){
    var from=S.shown,t0=null;S.shown=to;
    (function s(t){t0=t0||t;var p=Math.min((t-t0)/450,1),e=1-Math.pow(1-p,3);
      $('cPrice').textContent=inr(from+(to-from)*e);if(p<1)requestAnimationFrame(s);})(performance.now());
  }
  function render(){
    var r=calc(),t=r.t;
    $('cPagesOut').textContent=S.pages;
    $('cPagesHint').textContent=t.incl+' included in the base price · each extra '+inr(t.extra);
    $('cBreak').innerHTML=r.lines.map(function(l){return '<li><span>'+l[0]+'</span><b>'+inr(l[1])+'</b></li>';}).join('');
    var shownLo=S.shown;
    var el=$('cPrice');
    // animate low end, show as range
    var from=S.lo||0,t0=null;S.lo=r.lo;
    (function s(ts){t0=t0||ts;var p=Math.min((ts-t0)/450,1),e=1-Math.pow(1-p,3);
      el.textContent=inr(from+(r.lo-from)*e)+' – '+inr(r.hi);if(p<1)requestAnimationFrame(s);})(performance.now());
    var feats=PRICES.features.filter(function(f){return S.feats[f.id]&&!(f.hide||[]).includes(S.type);}).map(function(f){return f.name;});
    var msg='Price estimate request\nProject: '+t.name+'\nPages/screens: '+S.pages+'\nExtras: '+(feats.join(', ')||'none')+'\nTimeline: '+(S.fast?'Fast track (~2 weeks)':'Standard (3–4 weeks)')+'\nEstimate shown: '+inr(r.lo)+' – '+inr(r.hi);
    $('cQuote').href='contact.html?service='+encodeURIComponent(t.service)+'&est='+encodeURIComponent(msg);
    $('cWa').href='https://wa.me/918433682989?text='+encodeURIComponent('Hi Blyvax,\n'+msg);
  }
  root.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.dataset.type){S.type=b.dataset.type;S.pages=Math.max(S.pages,1);buildTypes();buildFeats();}
    else if(b.dataset.feat){S.feats[b.dataset.feat]=!S.feats[b.dataset.feat];buildFeats();}
    else if(b.dataset.fast!==undefined){S.fast=b.dataset.fast==='1';[].forEach.call($('cTime').children,function(x){x.classList.toggle('on',x===b);});}
    else return;
    render();
  });
  $('cPages').addEventListener('input',function(e){S.pages=+e.target.value;
    e.target.style.setProperty('--p',((S.pages-1)/24*100)+'%');render();});
  $('cPages').style.setProperty('--p','16.6%');
  buildTypes();buildFeats();render();
})();
