/* Blyvax 3D: card tilt (all pages) + Three.js hero scene (home) */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hover=matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* 1) 3D tilt on cards */
  if(hover&&!reduce){
    document.querySelectorAll('.tile,.price,.work,.t-card,.mini-quote,.quote-feature,.form-panel,.info li').forEach(function(el){
      el.classList.add('tilt');
      el.addEventListener('mousemove',function(e){
        var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(900px) rotateX('+(-y*9)+'deg) rotateY('+(x*11)+'deg) translateZ(8px)';
      });
      el.addEventListener('mouseleave',function(){el.style.transform='';});
    });
    /* hero mockup parallax */
    var hx=document.querySelector('.hx'),sc=document.querySelector('.hx-scene');
    if(hx&&sc){hx.addEventListener('mousemove',function(e){
      var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
      sc.style.transform='rotateX('+(8-y*10)+'deg) rotateY('+(-16+x*14)+'deg)';});
      hx.addEventListener('mouseleave',function(){sc.style.transform='';});}
  }

  /* 2) Three.js hero scene */
  var cv=document.getElementById('hx3d');
  if(!cv||reduce)return;
  function boot(){
    if(!window.THREE)return;            /* offline / blocked: CSS hero stays */
    var T=THREE,hero=cv.parentElement,small=innerWidth<700;
    var ren=new T.WebGLRenderer({canvas:cv,alpha:true,antialias:!small});
    ren.setPixelRatio(Math.min(devicePixelRatio,small?1.5:2));
    var scene=new T.Scene(),cam=new T.PerspectiveCamera(45,1,.1,100);cam.position.z=11;
    scene.add(new T.AmbientLight(0xffffff,.5));
    var l1=new T.PointLight(0x5b8bff,2.2,60);l1.position.set(6,6,8);scene.add(l1);
    var l2=new T.PointLight(0xff6b57,1.8,60);l2.position.set(-7,-4,6);scene.add(l2);
    var g=new T.Group();scene.add(g);
    function mesh(geo,mat,x,y,z){var m=new T.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m;}
    var knot=mesh(new T.TorusKnotGeometry(1.15,.36,small?80:140,16),new T.MeshStandardMaterial({color:0x2f5bff,metalness:.7,roughness:.25}),5.2,1.2,-2);
    var ico=mesh(new T.IcosahedronGeometry(1.4,1),new T.MeshBasicMaterial({color:0x7ea0ff,wireframe:true,transparent:true,opacity:.55}),-6.2,2.6,-4);
    var ring=mesh(new T.TorusGeometry(.9,.18,16,60),new T.MeshStandardMaterial({color:0xff6b57,metalness:.5,roughness:.3}),-5,-3,-1);
    var oct=mesh(new T.OctahedronGeometry(.7),new T.MeshStandardMaterial({color:0x2ee6a6,metalness:.6,roughness:.25}),6.4,-3.2,-1);
    var sph=mesh(new T.SphereGeometry(.45,24,24),new T.MeshStandardMaterial({color:0xffc857,metalness:.4,roughness:.3}),-1.5,3.6,-3);
    var n=small?60:160,p=new Float32Array(n*3);
    for(var i=0;i<n*3;i++)p[i]=(Math.random()-.5)*(i%3===2?10:26);
    var pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(p,3));
    var pts=new T.Points(pg,new T.PointsMaterial({color:0x9db6ff,size:.05,transparent:true,opacity:.8}));scene.add(pts);
    var mx=0,my=0,tx=0,ty=0,run=true,t0=0;
    hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;});
    function size(){var w=hero.clientWidth,h=hero.clientHeight;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();g.scale.setScalar(Math.min(1,w/1100)+(small?.15:0));}
    size();addEventListener('resize',size);
    new IntersectionObserver(function(en){run=en[0].isIntersecting;if(run)loop();}).observe(hero);
    function loop(t){
      if(!run)return;requestAnimationFrame(loop);
      t=(t||0)/1000;mx+=(tx-mx)*.05;my+=(ty-my)*.05;
      g.rotation.y=mx*.5;g.rotation.x=my*.35;
      knot.rotation.x=t*.4;knot.rotation.y=t*.55;knot.position.y=1.2+Math.sin(t)*.35;
      ico.rotation.y=t*.3;ico.rotation.x=t*.2;ico.position.y=2.6+Math.sin(t*.8+1)*.3;
      ring.rotation.x=t*.6;ring.rotation.y=t*.3;ring.position.y=-3+Math.sin(t*.9+2)*.3;
      oct.rotation.y=t*.7;oct.rotation.z=t*.4;oct.position.y=-3.2+Math.sin(t*1.1)*.3;
      sph.position.y=3.6+Math.sin(t*1.2+3)*.25;
      pts.rotation.y=t*.02;
      ren.render(scene,cam);
    }
    loop();cv.classList.add('on');
  }
  if(window.THREE)boot();else{
    var s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload=boot;document.head.appendChild(s);
  }
})();
