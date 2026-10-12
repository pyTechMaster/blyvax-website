/* Projects page: category filter */
(function(){
  var box=document.getElementById('filters');if(!box)return;
  var cards=[].slice.call(document.querySelectorAll('.work[data-cat]'));
  function apply(f){
    cards.forEach(function(c){
      var show=f==='all'||c.dataset.cat.split(' ').indexOf(f)>-1;
      c.hidden=!show;
      if(show){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');}
    });
    [].forEach.call(box.children,function(b){b.classList.toggle('on',b.dataset.f===f);});
    try{history.replaceState(null,'',f==='all'?location.pathname:'#'+f);}catch(e){}
  }
  box.addEventListener('click',function(e){var b=e.target.closest('button');if(b)apply(b.dataset.f);});
  var h=location.hash.slice(1);if(['ecommerce','ml','webapp'].indexOf(h)>-1)apply(h);
})();
