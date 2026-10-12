// Blyvax — shared behaviour

document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // Active nav link based on current page
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // Pricing monthly/yearly toggle
  const priceToggle = document.getElementById('priceToggle');
  if (priceToggle) {
    const amounts = document.querySelectorAll('[data-monthly]');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const yearlyLabel = document.getElementById('yearlyLabel');
    priceToggle.addEventListener('click', () => {
      const yearly = priceToggle.classList.toggle('on');
      amounts.forEach(el => {
        el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
      });
      monthlyLabel.classList.toggle('active', !yearly);
      yearlyLabel.classList.toggle('active', yearly);
    });
  }

  // Contact form — submits to Web3Forms
  const form = document.getElementById('contactForm');
  if (form) {
    const success = document.getElementById('formSuccess');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            success.textContent = "Thanks — your message has been sent. We'll reply within one business day.";
            success.classList.add('show');
            form.reset();
          } else {
            const apiMessage = (data.message || (data.body && data.body.message) || 'Unknown error');
            success.textContent = 'Error: ' + apiMessage;
            success.classList.add('show');
            console.error('Web3Forms error:', data);
          }
        })
        .catch((err) => {
          success.textContent = 'Network error. Please email us directly at sakshipardeshi705@gmail.com.';
          success.classList.add('show');
          console.error('Fetch failed:', err);
        })
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }

});
/* Dark / Light theme toggle */
(function(){
  var root=document.documentElement,css=document.getElementById('themeCss');
  if(!css)return;
  var sun='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var moon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var b=document.createElement('button');b.className='theme-toggle';b.type='button';
  function paint(){var light=root.getAttribute('data-theme')==='light';
    b.innerHTML=(light?moon:sun)+'<span>'+(light?'Dark mode':'Light mode')+'</span>';
    b.setAttribute('aria-label',light?'Switch to dark mode':'Switch to light mode');}
  b.addEventListener('click',function(){
    var light=root.getAttribute('data-theme')!=='light';
    if(light)root.setAttribute('data-theme','light');else root.removeAttribute('data-theme');
    css.disabled=light;
    try{localStorage.setItem('devox-theme',light?'light':'dark')}catch(e){}
    paint();
  });
  paint();document.body.appendChild(b);
})();
