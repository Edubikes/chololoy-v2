/* EN / ES language switch: remembers the choice; a flag click always wins. */
(function(){
  var K='chololoy-lang',d=document;
  var cur=/^es/i.test(d.documentElement.lang)?'es':'en';
  function get(){try{return localStorage.getItem(K)}catch(e){return null}}
  function set(v){try{localStorage.setItem(K,v)}catch(e){}}
  d.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('.lang-sw a[data-lang]');
    if(a)set(a.getAttribute('data-lang'));
  },true);
  var s=get();
  if((s==='es'||s==='en')&&s!==cur){
    var m=d.querySelector('meta[name="lang-alt"]');
    if(m){
      try{location.replace(new URL(m.getAttribute('content'),location.href).href+location.search+location.hash)}catch(e){}
    }
  }
})();
