# HoralNet

Moderní webová stránka internetového poskytovatele v Goralii – návrh redesignu webu [horalnet.cz](https://www.horalnet.cz/).

Texty, ceny, lokality, tým, aktuality a obrázky maskota Horáčka jsou převzaty z původního webu HoralNET s.r.o.

## Co web obsahuje

- **Úvod** s maskotem Horáčkem, hlavní nabídkou a kontakty
- **Internet** – tarify Optika+ a WIFI+ (akce 199 Kč / měs.)
- **SledovaniTV** – balíček Mini za 49 Kč / měs.
- **MESH** – Wi-Fi v každém rohu domu za 95 Kč / měs.
- **Pokrytí** – interaktivní vyhledávání obce s filtrem podle technologie (bezdrát / optika / LAN)
- **Náš tým**, **Aktuálně**, **Kontakt** s poptávkovým formulářem (otevře e-mail na posta@horalnet.cz)
- Patička se všemi dokumenty (smlouva, VOP, ceník, GDPR, DSA …), odkazy na původní PDF

## Technologie

Čisté HTML, CSS a JavaScript – bez build kroku a bez závislostí. Plně responzivní (mobil, tablet, desktop), respektuje `prefers-reduced-motion`.

```
index.html
assets/
  css/styles.css
  js/main.js
  img/            # obrázky ve formátu WebP
```

## Spuštění

Stačí otevřít `index.html` v prohlížeči, nebo spustit lokální server:

```bash
python3 -m http.server 8000
```

a otevřít [https://sulii01.github.io/HoralNet/](https://sulii01.github.io/HoralNet/)

Web lze nasadit na libovolný statický hosting (GitHub Pages, Netlify, klasický webhosting).
