/* Book a free call — slot picker (IST) → WhatsApp + email */
(function(){
  var root=document.getElementById('bookApp');if(!root)return;
  var WA='918433682989',HOURS=[10,11,12,14,15,16,17,18];
  var S={date:null,slot:null};
  var ist=function(){return new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));};
  var now=ist();
  var D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var days=[];
  for(var i=0;days.length<6&&i<14;i++){
    var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+i);
    if(d.getDay()===0)continue;               /* closed Sundays */
    var left=HOURS.filter(function(h){return i>0||h>=now.getHours()+2;});
    if(!left.length)continue;                 /* today fully gone */
    days.push({d:d,i:i,hours:left});
  }
  var label=function(x){return (x.i===0?'Today':x.i===1?'Tomorrow':D[x.d.getDay()])+'|'+x.d.getDate()+' '+M[x.d.getMonth()];};
  var fmt=function(h){return (h>12?h-12:h)+':00 '+(h>=12?'PM':'AM');};
  var full=function(x){return D[x.d.getDay()]+', '+x.d.getDate()+' '+M[x.d.getMonth()]+' '+x.d.getFullYear();};

  root.innerHTML=
   '<div class="book-main"><h3><b>1</b>Pick a day</h3><div class="book-days" id="bDays"></div>'+
   '<h3 class="mt"><b>2</b>Pick a time <small>(IST)</small></h3><div class="book-slots" id="bSlots"><p class="calc-hint">Choose a day first.</p></div></div>'+
   '<div class="book-side"><h3><b>3</b>Your details</h3>'+
    '<div class="field"><label for="bName">Your name</label><input id="bName" autocomplete="name" placeholder="Your name"></div>'+
    '<div class="field"><label for="bPhone">Phone / WhatsApp</label><input id="bPhone" type="tel" autocomplete="tel" placeholder="+91 00000 00000"></div>'+
    '<div class="field"><label for="bTopic">What is it about?</label><select id="bTopic"><option>New website</option><option>Online store</option><option>Custom web app</option><option>Redesign / improvements</option><option>Not sure yet</option></select></div>'+
    '<p class="book-pick" id="bPick">No time selected yet</p>'+
    '<button type="button" class="btn btn-wa btn-block" id="bGo">Book my free call</button>'+
    '<p class="book-fine">15–30 minute call. Free, no obligation. We confirm on WhatsApp.</p><p class="book-ok" id="bOk" role="status"></p></div>';
  var $=function(id){return document.getElementById(id);};

  $('bDays').innerHTML=days.map(function(x,k){var p=label(x).split('|');
    return '<button type="button" data-d="'+k+'"><span>'+p[0]+'</span><strong>'+p[1]+'</strong></button>';}).join('');
  function paint(){
    [].forEach.call($('bDays').children,function(b,k){b.classList.toggle('on',S.date===k);});
    var x=days[S.date];
    $('bSlots').innerHTML=x?x.hours.map(function(h){return '<button type="button" data-h="'+h+'" class="'+(S.slot===h?'on':'')+'">'+fmt(h)+'</button>';}).join(''):'<p class="calc-hint">Choose a day first.</p>';
    $('bPick').textContent=(x&&S.slot!==null)?full(x)+' · '+fmt(S.slot)+' IST':'No time selected yet';
  }
  root.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.dataset.d!==undefined){S.date=+b.dataset.d;S.slot=null;paint();}
    else if(b.dataset.h!==undefined){S.slot=+b.dataset.h;paint();}
  });
  $('bGo').addEventListener('click',function(){
    var ok=$('bOk');ok.className='book-ok';
    var name=$('bName').value.trim(),phone=$('bPhone').value.trim();
    if(S.date===null||S.slot===null){ok.textContent='Please pick a day and a time first.';ok.classList.add('show','err');return;}
    if(!name){ok.textContent='Please enter your name.';ok.classList.add('show','err');$('bName').focus();return;}
    if(phone.replace(/\D/g,'').length<10){ok.textContent='Please enter a valid phone number.';ok.classList.add('show','err');$('bPhone').focus();return;}
    var when=full(days[S.date])+' at '+fmt(S.slot)+' IST',topic=$('bTopic').value;
    var msg='Hi Blyvax, I would like to book a free call.\n\nName: '+name+'\nPhone: '+phone+'\nTopic: '+topic+'\nPreferred time: '+when;
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
    var key=document.querySelector('input[name=access_key]');
    if(key){fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
      body:JSON.stringify({access_key:key.value,subject:'Call booking request — '+when,from_name:'Blyvax Website',name:name,phone:phone,topic:topic,preferred_time:when})}).catch(function(){});}
    ok.textContent='Done! WhatsApp opened with your request for '+when+'. Press Send there to confirm.';ok.classList.add('show');
  });
  paint();
})();
