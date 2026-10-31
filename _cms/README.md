# Editor visual gratis (Pages CMS) para Chololoy v2

**Qué editan:** todos los textos, fotos, links y URLs de video del home en inglés (`index.html`) y español (`es/index.html`). El diseño, animaciones y CSS no se tocan.

## Cómo entran Kristina y Patrick
1. Cada uno crea cuenta gratis en https://github.com/signup.
2. Eduardo los invita al repo `Edubikes/chololoy-v2`: Settings → Collaborators → Add people (rol **Write**).
3. Entran a https://app.pagescms.org → "Sign in with GitHub" → aceptan dar acceso → eligen `Edubikes/chololoy-v2` (rama `main`).
4. Menú izquierdo: **Home – English** o **Inicio – Español**. Cada sección de la página (Hero, Recipe Videos, FAQ…) es un bloque; cambian el texto o suben una foto y le dan **Save**.
5. Al guardar, GitHub Actions (`.github/workflows/cms-build.yml`) regenera el HTML en ~1 min y GitHub Pages lo publica.

## Técnico
- `_cms/templates/home-*.html`: HTML de la v2 con marcadores `{{clave}}` (generado por `extract.py`).
- `_cms/content/home-*.json`: lo que se edita.
- `python3 _cms/build.py` regenera. Si un campo queda igual o vacío, se usa el original byte por byte.
- Si cambian el diseño a mano en `index.html`, volver a generar plantillas con `extract.py` (ver script en el PR).
- Fotos subidas van a `assets/uploads/`.
