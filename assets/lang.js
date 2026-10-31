/* EN / ES language switch: remembers the choice; a flag click always wins.
   Navigation stays on this deployment (github.io/chololoy-v2 or a root custom domain).
   Canonical and hreflang <link> tags are not used as destinations. */
(function(){
  var K='chololoy-lang',d=document;
  var cur=/^es/i.test(d.documentElement.lang)?'es':'en';
  var PROD=/^(www\.)?chololoy\.com$/i;
  function get(){try{return localStorage.getItem(K)}catch(e){return null}}
  function set(v){try{localStorage.setItem(K,v)}catch(e){}}
  function projectBase(){
    var p=location.pathname;
    return (p==='/chololoy-v2'||p.indexOf('/chololoy-v2/')===0)?'/chololoy-v2':'';
  }
  /* Map a language or in-site URL onto the current host. Relative links stay relative to this page. */
  function onThisSite(raw){
    var u=new URL(raw,location.href);
    if(!PROD.test(u.hostname)) return u.href;
    var path=u.pathname||'/';
    if(path.charAt(0)!=='/') path='/'+path;
    if(path.indexOf('/cdn/')===0) return u.href;
    return location.origin+projectBase()+path+u.search+u.hash;
  }
  function isProd(raw){
    try{return PROD.test(new URL(raw,location.href).hostname)}catch(e){return false}
  }
  /* Header, nav, footer, logo, and flags: never leave the preview for an in-site chololoy.com URL.
     The script is in <head>, so rewrite anchors after the body exists. */
  function rewrite(){
    d.querySelectorAll('a[href]').forEach(function(a){
      var raw=a.getAttribute('href');
      if(!raw||!isProd(raw)) return;
      var path=new URL(raw,location.href).pathname||'/';
      if(path.indexOf('/cdn/')===0) return;
      a.setAttribute('href',onThisSite(raw));
    });
  }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',rewrite);
  else rewrite();
  d.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('.lang-sw a[data-lang]');
    if(!a) return;
    set(a.getAttribute('data-lang'));
    var raw=a.getAttribute('href')||'';
    if(!isProd(raw)) return;
    e.preventDefault();
    location.href=onThisSite(raw);
  },true);
  var s=get();
  if((s==='es'||s==='en')&&s!==cur){
    var m=d.querySelector('meta[name="lang-alt"]');
    var raw=m&&m.getAttribute('content');
    if(raw){
      try{
        var dest=onThisSite(raw);
        if(dest.indexOf('?')===-1) dest+=location.search;
        if(dest.indexOf('#')===-1) dest+=location.hash;
        location.replace(dest);
      }catch(e){}
    }
  }
})();
