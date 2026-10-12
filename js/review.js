/* Free website review: email via Web3Forms, or WhatsApp (no server needed) */
(function(){
  var form=document.getElementById('reviewForm');if(!form)return;
  var ok=document.getElementById('reviewMsg'),wa=document.getElementById('rWaBtn');
  var v=function(id){return (document.getElementById(id).value||'').trim();};
  function say(t,err){ok.textContent=t;ok.classList.add('show');ok.style.color=err?'#E5484D':'';}
  function fixUrl(u){u=u.trim();if(!u)return '';if(!/^https?:\/\//i.test(u))u='https://'+u;
    try{var x=new URL(u);if(x.hostname.indexOf('.')<1)return '';return x.href;}catch(e){return '';}}
  function data(){
    var site=fixUrl(v('rSite'));
    if(!site){say('Please enter a valid website address, like yourshop.com',true);document.getElementById('rSite').focus();return null;}
    if(!form.reportValidity())return null;
    return {site:site,name:v('rName'),phone:v('rPhone'),email:v('rEmail'),goal:v('rGoal'),notes:v('rNotes')};
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();var d=data();if(!d)return;
    var btn=form.querySelector('button[type="submit"]'),txt=btn.textContent;btn.textContent='Sending...';btn.disabled=true;
    var p={access_key:form.access_key.value,subject:'Free website review request: '+d.site,from_name:'Blyvax Website',
      botcheck:form.botcheck.checked,name:d.name,phone:d.phone,email:d.email||'not given',website:d.site,goal:d.goal,notes:d.notes||'-'};
    fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(p)})
      .then(function(r){return r.json()}).then(function(j){
        if(j.success){say("Thanks! We've received your link and will send your free review within 2 business days.");form.reset();}
        else say('Something went wrong: '+(j.message||'please try WhatsApp instead.'),true);})
      .catch(function(){say('Network error. Please use the WhatsApp button instead.',true)})
      .finally(function(){btn.textContent=txt;btn.disabled=false;});
  });
  wa.addEventListener('click',function(){
    var d=data();if(!d)return;
    var msg=['Hi Blyvax, I would like a free website review.','','Website: '+d.site,'Name: '+d.name,'Phone: '+d.phone]
      .concat(d.email?['Email: '+d.email]:[]).concat(['Goal: '+d.goal]).concat(d.notes?['','Notes: '+d.notes]:[]).join('\n');
    window.open('https://wa.me/918433682989?text='+encodeURIComponent(msg),'_blank','noopener');
    say('WhatsApp opened with your details. Just press Send there.');
  });
})();
