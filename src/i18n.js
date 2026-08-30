'use strict';
/* i18n — nenhum texto hardcoded nas cenas: tudo vem de src/lang/*.json.
   Para adicionar um idioma: criar src/lang/<código>.json e registrar em FILES. */
const I18N = {
  FILES: { pt: 'src/lang/pt-BR.json', en: 'src/lang/en.json' },
  dict: {},
  async load() {
    const entries = await Promise.all(
      Object.entries(this.FILES).map(async ([k, path]) => {
        try { return [k, await fetch(path).then(r => r.json())]; }
        catch (e) { console.warn('i18n: falha ao carregar', path, e); return [k, {}]; }
      })
    );
    entries.forEach(([k, d]) => { this.dict[k] = d; });
  }
};

let LANG = 'pt';
try { LANG = localStorage.getItem('robo_lang') || 'pt'; } catch (e) {}

function T(k) {
  const d = I18N.dict;
  return (d[LANG] && d[LANG][k]) || (d.pt && d.pt[k]) || k;
}
function setLang(l) {
  LANG = l;
  try { localStorage.setItem('robo_lang', l); } catch (e) {}
}
