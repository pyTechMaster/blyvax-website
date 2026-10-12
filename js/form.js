/* Contact form: "Send on WhatsApp" (email is handled in script.js via Web3Forms) */
(function(){
  var form=document.getElementById('contactForm'),btn=document.getElementById('waBtn');
  if(!form||!btn)return;
  btn.addEventListener('click',function(){
    if(!form.reportValidity())return;
    var v=function(id){return (document.getElementById(id).value||'').trim();};
    var msg=['Hi Blyvax, I have a project enquiry.','',
      'Name: '+v('name'),'Email: '+v('email')]
      .concat(v('phone')?['Phone: '+v('phone')]:[])
      .concat(['Service: '+v('service'),'','Details: '+v('message')]).join('\n');
    window.open('https://wa.me/918433682989?text='+encodeURIComponent(msg),'_blank','noopener');
    var ok=document.getElementById('formSuccess');
    ok.textContent='WhatsApp opened with your message — just press Send there.';ok.classList.add('show');
  });
})();

/* Prefill from the price calculator (?service=...&est=...) */
(function(){
  var q=new URLSearchParams(location.search),m=document.getElementById('message'),s=document.getElementById('service');
  if(m&&q.get('est'))m.value=q.get('est');
  if(s&&q.get('service')){[].some.call(s.options,function(o){if(o.text.indexOf(q.get('service'))===0){s.value=o.value||o.text;return true;}});}
})();
