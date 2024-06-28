ID-SK 2 Frontend
=====================

ID-SK 2 Frontend je jednotný dizajnový systém elektronických služieb Slovenska, ktorý má za cieľ zjednotiť používateľské rozhrania a spôsob komunikácie s používateľom pri poskytovaní elektronických služieb na Slovensku.

ID-SK 2 Frontend obsahuje zdrojový kód, ktorý vychádza z britského dizajn manuálu elektronických služieb GOV.UK.

Živé príklady ID-SK komponentov s pokynmi ako ich využiť pri tvorbe vlastnej služby nájdete na [Dizajn manuále ID-SK](https://idsk2.gov.sk/).

## Kontakt na tím
ID-SK je tvorený pod záštitou Oddelenia behaviorálnych inovácií (oKPS) Ministerstva investícií, regionálneho rozvoja a informatizácie. Pre viac informácií svoje otázky smerujte na e-mail [ID-SK tímu idsk@mirri.gov.sk](mailto:idsk@mirri.gov.sk).

Našli ste v ID-SK chybu alebo chcete navrhnúť zmenu? Môžete tak urobiť priamo na [https://github.com/id-sk/id-sk-frontend/issues](https://github.com/id-sk/id-sk-frontend/issues).

## Rýchly štart
Sú dva spôsoby, ako začať používať ID-SK Frontend vo vašej aplikácii.

### 1. Inštaláciou npm (odporúčame)
Odporúčame nainštalovať si ID-SK Frontend zo správcu balíčkov platformy [Node (NPM)](https://www.npmjs.com/package/@id-sk/frontend).

### 2. Inštaláciou kompilovaných súborov
Môžete si tiež stiahnuť skompilované a minifikované prvky (CSS, Javascript) z [GitHub] (https://github.com/id-sk/id-sk-frontend/tree/master/dist).
Po inštalácii budete môcť vo vašej službe používať kód z dizajn systému ID-SK.

## Podpora prehliadačov
ID-SK Frontend vám umožní budovať služby, ktoré sú v súlade s pokynmi uvedenými v [metodickom usmernení](https://idsk2.gov.sk/uvod/metodika-ucd).
ID-SK Frontend oficiálne podporuje nasledovné prehliadače:

| Operačný systém | Prehliadač | Podpora |
|--|--|--|
| Windows | Internet Explorer 8-10 | funkčný |
| Windows | Internet Explorer 11 | vyhovujúci |
| Windows | Edge (posledné 2 verzie) | vyhovujúci |
| Windows | Google Chrome (posledné 2 verzie) | vyhovujúci |
| Windows | Mozilla Firefox (posledné 2 verzie) | vyhovujúci |
| macOS | Safari 9+ | vyhovujúci | 
| macOS | Google Chrome (posledné 2 verzie) | vyhovujúci | 
| macOS | Mozilla Firefox (posledné 2 verzie) | vyhovujúci |
| iOS | Safari for iOS 9.3+ | vyhovujúci |
| iOS | Google Chrome (posledné 2 verzie) | vyhovujúci |
| Android | Google Chrome (posledné 2 verzie) | vyhovujúci |
| Android | Samsung Internet (posledné 2 verzie) | vyhovujúci |

„Vyhovujúci“ znamená, že komponenty musia vyzerať i fungovať rovnako dobre ako v iných moderných prehliadačoch.

„Funkčný“ znamená, že komponenty nemusia v danom prehliadači vyzerať dokonale, ale musia byť stále použiteľné bez chýb.

V prípade, že v aplikácii generujete CSS súbory, ktorých súčasťou sú ID-SK štýly, na podporu prehliadača Internet Explorer 8 je potrebné vygenerovať a zahrnúť aj separátne štýly.

## Asistenčné technológie
ID-SK Frontend vám umožní budovať služby, ktoré sú v súlade s pokynmi uvedenými v [metodickom usmernení](https://idsk2.gov.sk/uvod/metodika-ucd).

ID-SK Frontend oficiálne podporuje nasledovné asistenčné technológie:

| Softvér| Verzia| Typ| Prehliadač |
|--|--|--|--|
| JAWS | 15 alebo novšia | čítačka obrazovky | Internet Explorer 11 |
| ZoomText | 10.11 alebo novšia | zväčšovacia lupa | Internet Explorer 11 |
| Dragon NaturallySpeaking | 11 alebo novšia | rozpoznávač reči | Internet Explorer 11 |
| NVDA | 2016 alebo novšia | čítačka obrazovky | Firefox (najnovšie verzie) |
| VoiceOver | 7.0 alebo novšia | čítačka obrazovky | Safari na iOS10 a OS X |

Okrem toho testujeme, či je všetok obsah prístupný iba pomocou klávesnice.

Naším cieľom je podporovať používateľov, ktorí potrebujú upravené farby webových stránok, ktoré navštevujú. Testujeme to zmenou farieb v prehliadači Firefox, povolením režimu „Vysoký kontrast“ v operačnom systéme Windows a použitím doplnku „Vysoký kontrast“ pre prehliadač Chrome.

## Ako prispieť k ID-SK

Ak nám chcete pomôcť rozšíriť ID-SK Frontend, [pozrite si návod](https://github.com/id-sk/id-sk-frontend/blob/master/CONTRIBUTING.md)
