import re,json,sys,html as H
TOK=re.compile(r'(<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>|<noscript\b.*?</noscript>|<[^>]+>)',re.S|re.I)
SEC=re.compile(r'<(section|header|footer)\b[^>]*?(?:id="([^"]+)"|aria-label="([^"]+)")?[^>]*>',re.I)
def extract(src):
    assert '{{' not in src
    parts=TOK.split(src); out=[]; fields={}; order=[]; sec='head'; n={}
    inbody=False; title=False
    seen={}
    def add(kind,val,extra=None):
        if kind in('video','link') and val in seen: return '{{'+seen[val]+'}}'
        n[sec]=n.get(sec,0)+1
        k=f"{re.sub(r'[^a-z0-9]+','_',sec.lower()).strip('_')}__{kind}{n[sec]}"
        fields[k]={'type':kind,'section':sec,'default':val}; order.append(k)
        if kind in('video','link'): seen[val]=k
        return '{{'+k+'}}'
    for p in parts:
        if not p: continue
        if p.startswith('<') and not p.startswith('<!--') :
            low=p[:12].lower()
            if low.startswith('<body'): inbody=True
            if low.startswith('<title'): title=True
            if low.startswith('</title'): title=False
            m=re.match(r'<(section|header|footer)\b',p,re.I)
            if m:
                i=re.search(r'\bid="([^"]+)"',p) or re.search(r'aria-label="([^"]+)"',p) or re.search(r'class="([^" ]+)',p)
                sec=i.group(1) if i else m.group(1)
            if inbody and not p.lower().startswith(('<script','<style','<noscript')):
                tag=re.match(r'<(\w+)',p)
                tag=tag.group(1).lower() if tag else ''
                def rep(attr,kind):
                    nonlocal p
                    mm=re.search(r'(\s%s=")([^"]+)(")'%attr,p)
                    if mm and not mm.group(2).startswith('data:'):
                        p=p[:mm.start(2)]+add(kind,mm.group(2))+p[mm.end(2):]
                if tag=='img': rep('src','img'); rep('alt','text')
                if tag in('video','source'): rep('src','video'); rep('data-src','video'); rep('poster','img')
                rep('data-full','video'); rep('data-title','text'); rep('data-meta','text')
                if tag=='a':
                    mm=re.search(r'\shref="([^"]+)"',p)
                    if mm and (mm.group(1).startswith(('http','mailto:','tel:')) ): rep('href','video' if '.mp4' in mm.group(1) else 'link')
                if tag in('input','textarea'): rep('placeholder','text')
            out.append(p); continue
        if p.startswith('<'): out.append(p); continue
        s=p.strip()
        if (inbody or title) and s and re.search(r'[A-Za-zÁ-ú0-9]',s) :
            a=p.index(s); out.append(p[:a]+add('text',s)+p[a+len(s):])
        else: out.append(p)
    t=''.join(out)
    def tagfix(m):
        tg=m.group(0); k=re.search(r'\ssrc="\{\{([a-z0-9_]+)\}\}"',tg)
        ss=re.search(r'\ssrcset="([^"]*)"',tg)
        if k and ss and fields[k.group(1)]['type']=='img':
            fields[k.group(1)]['srcset']=ss.group(1); tg=tg[:ss.start()]+'{{srcset:'+k.group(1)+'}}'+tg[ss.end():]
        return tg
    t=re.sub(r'<(img|source)\b[^>]*>',tagfix,t)
    return t,fields,order
def render(tpl,vals,fields=None):
    def ss(m):
        k=m.group(1); f=fields[k]
        return ' srcset="%s"'%f['srcset'] if vals[k]==f['default'] else ''
    tpl=re.sub(r'\{\{srcset:([a-z0-9_]+)\}\}',ss,tpl)
    return re.sub(r'\{\{([a-z0-9_]+)\}\}',lambda m:vals[m.group(1)],tpl)
if __name__=='__main__':
    src=open(sys.argv[1]).read(); t,f,o=extract(src)
    assert render(t,{k:v['default'] for k,v in f.items()},f)==src
    print(len(o),'fields'); import collections; print(collections.Counter(v['type'] for v in f.values()))
