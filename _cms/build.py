"""Arma index.html y es/index.html desde _cms/templates + _cms/content (lo que editan en Pages CMS)."""
import json,re,html as H,os
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
for lang,out,prefix in (('en','index.html',''),('es','es/index.html','../')):
    tpl=open(f'_cms/templates/home-{lang}.html').read(); meta=json.load(open(f'_cms/templates/home-{lang}.meta.json'))
    vals={k:v for sec in json.load(open(f'_cms/content/home-{lang}.json')).values() for k,v in sec.items()}
    def val(k):
        m=meta[k]; v=vals.get(k) or ''
        if v=='' or v==H.unescape(m['default']): return m['default']
        if m['type']=='img' and v.startswith(('assets/uploads','/assets/uploads')): v=prefix+v.lstrip('/')
        return H.escape(v,quote=True)
    def ss(mm):
        k=mm.group(1); return ' srcset="%s"'%meta[k]['srcset'] if val(k)==meta[k]['default'] else ''
    tpl=re.sub(r'\{\{srcset:([a-z0-9_]+)\}\}',ss,tpl)
    open(out,'w').write(re.sub(r'\{\{([a-z0-9_]+)\}\}',lambda mm:val(mm.group(1)),tpl)); print('ok',out)
