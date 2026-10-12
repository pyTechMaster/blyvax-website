/* Blyvax — visitor analytics (loads ONLY after the visitor accepts)
   1) Google Analytics 4  -> paste your Measurement ID, e.g. 'G-ABC123XYZ9'
   2) Microsoft Clarity   -> paste your Project ID,    e.g. 'abcd1234ef'
   Leave a value empty ('') to switch that tool off. If both are empty,
   nothing loads and the cookie banner is not shown. */
(function(){
  var GA_ID = 'G-D0XDEYH4FL';       // <-- paste Google Analytics Measurement ID here
  var CLARITY_ID = 'ywhqmbbhvq';  // <-- paste Microsoft Clarity Project ID here

  var KEY='devox-consent', loaded=false;
  var get=function(){try{return localStorage.getItem(KEY)}catch(e){return null}};
  var set=function(v){try{v?localStorage.setItem(KEY,v):localStorage.removeItem(KEY)}catch(e){}};

  function track(name,label){
    try{ if(window.gtag) gtag('event',name,{event_label:label,page_path:location.pathname}); }catch(e){}
    try{ if(window.clarity) clarity('event',name); }catch(e){}
  }

  function load(){
    if(loaded) return; loaded=true;
    if(GA_ID){
      var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;document.head.appendChild(s);
      window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
      gtag('js',new Date());gtag('config',GA_ID,{anonymize_ip:true});
    }
    if(CLARITY_ID){
      (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script',CLARITY_ID);
    }
    // Button / link click tracking
    document.addEventListener('click',function(e){
      var a=e.target.closest('a,button');if(!a)return;
      var h=a.getAttribute('href')||'',txt=(a.textContent||a.getAttribute('aria-label')||'').trim().slice(0,60);
      if(h.indexOf('wa.me')>-1||a.id==='waBtn'||a.id==='rWaBtn') return track('whatsapp_click',txt||'WhatsApp');
      if(h.indexOf('tel:')===0) return track('phone_click',h);
      if(h.indexOf('mailto:')===0) return track('email_click',h);
      if(h.indexOf('onrender.com')>-1) return track('live_project_click',h);
      if(a.classList.contains('theme-toggle')) return track('theme_toggle',txt);
      if(a.classList.contains('btn')) track('button_click',txt);
    },true);
    var f=document.getElementById('contactForm');
    if(f) f.addEventListener('submit',function(){track('form_submit','contact form')});
    var r=document.getElementById('reviewForm');
    if(r) r.addEventListener('submit',function(){track('review_request','free website review')});
  }

  function banner(){
    if(document.getElementById('cookieBar')) return;
    var b=document.createElement('div');b.id='cookieBar';b.className='cookie-bar';b.setAttribute('role','dialog');b.setAttribute('aria-label','Cookie consent');
    b.innerHTML='<p>We use analytics cookies to count visitors and see which pages and buttons are used, so we can improve the site. See our <a href="privacy.html">Privacy Policy</a>.</p><div><button type="button" data-c="no">Decline</button><button type="button" data-c="yes" class="yes">Accept</button></div>';
    b.addEventListener('click',function(e){var c=e.target.getAttribute&&e.target.getAttribute('data-c');if(!c)return;
      set(c==='yes'?'granted':'denied');b.remove();if(c==='yes')load();});
    document.body.appendChild(b);
  }

  function init(){
    if(!GA_ID&&!CLARITY_ID) return;
    var v=get(); if(v==='granted') load(); else if(v!=='denied') banner();
    document.addEventListener('click',function(e){
      var t=e.target.closest&&e.target.closest('[data-cookie-settings]');if(!t)return;
      e.preventDefault();set(null);banner();
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
