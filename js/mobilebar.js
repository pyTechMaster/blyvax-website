/* Mobile sticky Call / WhatsApp bar */
(function(){
  var bar=document.createElement('div');bar.className='mbar';bar.setAttribute('role','navigation');
  var phone='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.3 1.800.6 2.800.7a2 2 0 0 1 1.700 2z"/></svg>';
  var wa='<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3.400 8.600 3.400 15.500c0 2.400.7 4.700 1.900 6.600L3 29l7.100-2.200A12.600 12.600 0 0 0 16 28c7 0 12.600-5.600 12.600-12.500S23 3 16 3zm5.700 18.400c-.3.800-1.500 1.500-2.100 1.500-.6.100-1.200.1-1.900-.1-.4-.1-1-.3-1.700-.6-3-1.300-5-4.300-5.100-4.500-.2-.2-1.200-1.600-1.200-3s.8-2.200 1-2.500c.3-.3.600-.4.800-.4h.6c.2 0 .5-.1.7.5l1 2.300c.1.200.1.400 0 .6l-.4.600-.5.500c-.2.200-.3.400-.1.700.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.5.100.7-.1l1-1.200c.2-.3.400-.2.700-.1l2.200 1.100c.3.100.5.200.6.300.1.200.1.800-.2 1.600z"/></svg>';
  var msg=encodeURIComponent("Hi Blyvax, I'd like to discuss a project.");
  bar.innerHTML='<a class="mbar-call" href="tel:+918433682989" aria-label="Call Blyvax">'+phone+'<span>Call now</span></a>'+
    '<a class="mbar-wa" href="https://wa.me/918433682989?text='+msg+'" target="_blank" rel="noopener">'+wa+'<span>WhatsApp</span></a>';
  document.body.appendChild(bar);document.body.classList.add('has-mbar');
  /* hide while typing so the keyboard never covers the form */
  document.addEventListener('focusin',function(e){if(/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))bar.classList.add('away');});
  document.addEventListener('focusout',function(){bar.classList.remove('away');});
})();
