// Shared behaviour for every Girls Mentorship page: menu dropdowns, mobile menu,
// preview-only forms, and the phone sticky bar.
(function(){
  // Desktop dropdowns: open on click or hover, close on outside click / Escape
  var tops=[].slice.call(document.querySelectorAll(".menu-top"));
  function closeAll(except){tops.forEach(function(b){if(b!==except){b.parentNode.classList.remove("open");b.setAttribute("aria-expanded","false");}});}
  tops.forEach(function(b){
    var li=b.parentNode, t;
    b.addEventListener("click",function(e){e.stopPropagation();var o=!li.classList.contains("open");closeAll(b);li.classList.toggle("open",o);b.setAttribute("aria-expanded",o?"true":"false");});
    li.addEventListener("mouseenter",function(){if(matchMedia("(hover:hover)").matches){clearTimeout(t);closeAll(b);li.classList.add("open");b.setAttribute("aria-expanded","true");}});
    li.addEventListener("mouseleave",function(){if(matchMedia("(hover:hover)").matches){t=setTimeout(function(){li.classList.remove("open");b.setAttribute("aria-expanded","false");},150);}});
  });
  document.addEventListener("click",function(e){if(!e.target.closest(".menu"))closeAll();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeAll();closeMenu();}});

  // Mobile menu
  var mnav=document.getElementById("mnav"),burger=document.getElementById("burger"),mclose=document.getElementById("mclose");
  function openMenu(){mnav.hidden=false;burger.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";mclose.focus();}
  function closeMenu(){if(!mnav||mnav.hidden)return;mnav.hidden=true;burger.setAttribute("aria-expanded","false");document.body.style.overflow="";burger.focus();}
  if(burger){burger.addEventListener("click",openMenu);mclose.addEventListener("click",closeMenu);}

  // Forms in the preview don't send anything: show the success state instead
  document.querySelectorAll("form[data-preview-form]").forEach(function(f){
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var ok=f.parentNode.querySelector(".ok"); if(ok) ok.hidden=false;
      var swap=f.getAttribute("data-swap"); if(swap){var a=document.getElementById(swap);if(a){f.closest("[data-form-wrap]").hidden=true;a.hidden=false;a.focus&&a.focus();}}
    });
  });

  // Phone sticky bar: after the hero, hidden while the target section is on screen
  var bar=document.querySelector(".mbar");
  if(bar){
    var hero=document.querySelector("main > section"),target=document.querySelector(bar.getAttribute("data-hide-at")||"#none");
    var onScroll=function(){
      var past=hero?window.scrollY>hero.offsetTop+hero.offsetHeight-80:true,at=false;
      if(target){var r=target.getBoundingClientRect();at=r.top<innerHeight&&r.bottom>0;}
      bar.classList.toggle("show",past&&!at);
    };
    addEventListener("scroll",onScroll,{passive:true});onScroll();
  }
})();
