# Odpočet — tabuľa + WhatsApp pripomienka

Jeden odpočet, dva výstupy. **Klapková odchodová tabuľa** na
[robkrzn.github.io/OdpocetSkola](https://robkrzn.github.io/OdpocetSkola/), ktorá sa posiela
ako link, a **denná WhatsApp pripomienka** o 15:00. Obe čítajú tie isté zastávky:
najprv začiatok školského roka, po ňom Testovanie 9.

Produktová pravda je v `PRODUCT.md`, vizuálny systém v `DESIGN.md`, pracovná príručka
v `CLAUDE.md`. Tento súbor je prevádzka: príkazy, secrets, Meta.

Text WhatsApp správy:

> Do Testovania 9 ti ostáva 195 dní 13 hodín 12 minút. Už sa pripravuješ?
>
> `[ Otvoriť odpočet ]` → https://robkrzn.github.io/OdpocetSkola/

| Súbor | Načo je |
|---|---|
| **`stops.js`** | **Zastávky. Jediné miesto, kde sa mení termín** — číta ho tabuľa, náhľad aj pripomienka |
| `index.html`, `style.css`, `main.js`, `fonts/` | Tabuľa. Statické, bez buildu, Pages ich servíruje priamo |
| `og.jpg` | Obrázok do náhľadu linku. Prekresľuje ho Actions, ručne naň nesiahaj |
| `send.js` | WhatsApp: odpočet, slovenské skloňovanie, kontrola hodiny, odoslanie do Mety |
| `.github/workflows/daily.yml` | Cron, ktorý `send.js` spúšťa |
| `.github/og.mjs` + `workflows/og.yml` | Prepis meta tagov a prekreslenie `og.jpg` |

---

## Príkazy

Všetky sa púšťajú z koreňa projektu:

```bash
cd "/Users/robkrzn/Documents/Projekty/OdpocetSkola"
```

### Test odpočtu — nič neposiela

```bash
node send.js --test
```

Prebehne 12 kontrol (skloňovanie `deň/dni/dní`, prepínanie zastávok, letný/zimný čas, stav po poslednej zastávke)
a vypíše aktuálny odpočet. Toto pusti po každej zmene v `send.js`.
Ak niečo nesedí, spadne s `AssertionError` a povie čo.

### Ako to vyzerá teraz — nič neposiela

```bash
node send.js
```

Mimo 15:00 vypíše `preskočené, v Europe/Bratislava je 18:00, posiela sa o 15:00`.
Takto si overíš, že kontrola hodiny funguje.

### Poslať správu OKAMŽITE, lokálne

```bash
read -rs "WA_TOKEN?Meta token: " && WA_PHONE_ID=<phone-number-id> WA_TO=<číslo> \
  WA_TOKEN="$WA_TOKEN" node send.js --force; unset WA_TOKEN
```

Hodnoty za `<…>` sú v `META.local.md` (neversionovaný, viď nižšie).

- `read -rs` — vypýta si token skryto, takže neskončí v histórii shellu
- `WA_TO=` — príjemca, vidíš ho priamo v príkaze, takže nepošleš omylom nesprávnemu človeku.
  Viac príjemcov oddelíš čiarkou: `WA_TO=4219xxxxxxxx,4219xxxxxxxx`
- `--force` — obíde kontrolu času a pošle hneď

Príjemcu si prepíš podľa potreby. **Číslo musí byť najprv overené v Mete** (viď Limity).

### Poslať cez GitHub Actions — testuje ostrú dennú cestu

```bash
gh workflow run daily.yml && sleep 6 && gh run watch
```

Príjemcu berie zo secretu `WA_TO`, nie z príkazu. `workflow_dispatch` automaticky pridá `--force`.

### Čo sa dialo

```bash
gh run list --limit 10          # zoznam behov, success/failure
gh run view --log-failed        # presná chyba posledného padnutého behu
```

---

## Secrets

Uložené na GitHube, v repe nie sú. Zobraziť sa nedajú, iba prepísať.

```bash
gh secret list                 # nazvy a datum zmeny
gh secret set WA_TOKEN         # vypýta si hodnotu skryto
```

| Secret | Hodnota | Odkiaľ |
|---|---|---|
| `WA_TOKEN` | permanentný token | business.facebook.com/settings/system-users |
| `WA_PHONE_ID` | viď `META.local.md` | Meta App → WhatsApp → API Setup |
| `WA_TO` | viď `META.local.md` | príjemcovia, oddelení čiarkou |

Za `gh secret set` ide **názov**, hodnota sa vkladá až do výzvy `? Paste your secret:`.

Formát čísla: medzinárodne, bez `+`, bez `00`, **bez vodiacej nuly**.
`0904 123 456` → `421904123456`

---

## Meta — kde čo je

| Čo | Kde |
|---|---|
| Phone Number ID, WABA ID, test číslo | App Dashboard → Případy použití → WhatsApp → Step 1. Try it out |
| Pridať/overiť príjemcu | tá istá stránka → `Recipient` dropdown |
| Permanentný token | [business.facebook.com/settings/system-users](https://business.facebook.com/settings/system-users) → `monitor-bot` → Generate new token, **Expiration: Never**, práva `whatsapp_business_messaging` + `whatsapp_business_management` |
| Template | [WhatsApp Manager](https://business.facebook.com/wa/manage/message-templates/) → `monitor_countdown` |

### Hodnoty projektu

**Tento repozitár je verejný.** Phone Number ID, WABA ID, Template ID a hlavne
čísla príjemcov preto **nie sú v gite** — sú v `META.local.md`, ktorý je
v `.gitignore`. Tam nájdeš aj hotový príkaz na kontrolu stavu template.

Ostrá pravda je v GitHub secrets a v Meta konzole; `META.local.md` je len ťahák
na disku. Keď si repo klonuješ inde, súbor tam nebude — hodnoty vyčítaj z Mety.

---

## Zmeny

| Chcem zmeniť | Kde |
|---|---|
| Hodinu odoslania | `SEND_AT_HOUR` v `send.js` **a zároveň** oba `cron` v `daily.yml` (cron je v UTC, preto sú dva — letný a zimný čas) |
| Dokedy smie meškajúci beh poslať | `SEND_UNTIL_HOUR` v `send.js` |
| Dátum alebo pridanie zastávky | `stops.js` — **jediné miesto**. Tabuľa, náhľad aj správa ho čítajú spoločne |
| Výkriky po tapnutí na tabuľu | `shouts` pri príslušnej zastávke v `stops.js` |
| Text správy alebo odkaz | vo WhatsApp Manageri, nie v kóde — `send.js` posiela len dve premenné (cieľ, odpočet), zvyšok textu aj URL tlačidlo sú v template |
| Príjemcu | `gh secret set WA_TO` |

Po zmene `send.js` vždy `node send.js --test`, potom commit a push — Actions berie kód z `main`.

---

## Limity a pasce

- **Max 5 príjemcov.** Testovacie číslo pošle iba na čísla pridané do Recipient listu v Mete.
  Overovací kód príde **na to číslo**, nie tebe — takže majiteľ telefónu ti ho musí preposlať.
- **Token expiruje**, ak nie je zo System users s `Expiration: Never`. Ten z API Setup platí 24 h
  a padne to na `Session has expired`.
- **Template má limit na počet premenných** voči dĺžke textu. Meta odmietne `Params Words Ratio
  Exceeds Limit` (veľa premenných na krátky text) aj `Leading or Trailing Params Not Allowed`
  (text nesmie začínať ani končiť premennou). Preto sú premenné len dve a veta okolo nich je fixná.
- **Po poslednej zastávke sa posielanie samo zastaví** — `send.js` vypíše `žiadna ďalšia zastávka`
  a skončí úspešne. Nebude tvrdiť `0 dní`.
- **GitHub vypne cron po 60 dňoch bez commitu.** Príde mail, klikneš enable. Zatiaľ to nehrozí:
  `og.yml` commituje pri každej zmene počtu dní v `og:title`, teda takmer denne. Je to náhodná,
  ale funkčná poistka — keby `og.yml` niekedy zmizol, cron pripomienky umrie s ním.
- **Cron mešká, aj niekoľko hodín, a niektoré dni beh vôbec nevznikne.** Actions cron je „best
  effort", nedá sa naň spoľahnúť na minútu. Preto sa `send.js` neriadi hodinou behu, ale premennou
  `SCHEDULE` (`github.event.schedule`) — tá povie, ktorý z dvoch cronov beh spustil, a meškaním sa
  nemení. Lokálne `SCHEDULE` nie je, tam stále rozhoduje hodina.
- **Meškajúci beh dobehne len do 21:59** (`SEND_UNTIL_HOUR`), teda má 7 hodín na to, aby sa
  GitHub spamätal. Neskôr sa zahodí — v noci sa spí a ráno je Paulinka v škole. Deň, keď GitHub beh vôbec nevytvorí, sa nedá zachrániť kódom.
  Text sa počíta až pri odosielaní, takže je vždy presný, len príde neskôr.
- **Odosielateľ je americké číslo** s menom "Test Number". Zmena na vlastnú SIM = prepísať `WA_PHONE_ID`,
  kód sa nemení.
