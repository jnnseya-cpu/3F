import type { Language } from './translations';

/**
 * Reframed conversion-funnel copy (hero + register + primary CTAs) in all 5
 * languages. Kept isolated from the large translations.ts so it's easy to hand
 * to native reviewers.
 *
 * ⚠️ NATIVE REVIEW REQUIRED before launch for ln / kg / ts / sw — these are
 * AI-authored (same status as the Lingala/Swahili blog articles). French (fr)
 * is authoritative; any missing key falls back to fr at render time.
 */
export const FUNNEL: Record<Language, Record<string, string>> = {
  fr: {
    'home.badge1': 'Adhésion gratuite',
    'home.badge2': 'Chaque franc traçable publiquement',
    'home.h1a': 'Ils ont pris votre voix',
    'home.h1b': 'et votre argent.',
    'home.h1c': 'Reprenez le pouvoir.',
    'home.sub': "Pendant des décennies, les partis ont encaissé vos cotisations puis oublié votre village. Le Congo D'Abord est construit autrement : chaque cotisation est suivie publiquement, et chaque candidat est choisi par un score de mérite que ni l'argent, ni la tribu, ni le piston ne peuvent truquer.",
    'home.money': "Vous ne payez pas pour adhérer. Vous adhérez pour reprendre le contrôle.",
    'home.cta1': "Prendre ma place — c'est gratuit",
    'home.cta2': 'Voir où va chaque dollar',
    'reg.title': "Inscription — Le Congo D'Abord",
    'reg.sub': 'Rejoignez le mouvement citoyen pour un Congo meilleur',
    'reg.launch': 'Lancement national le 4 janvier 2027 — inscrivez-vous avant le grand jour',
  },
  ln: {
    'home.badge1': 'Kokota ya ofele',
    'home.badge2': 'Mbongo nyonso emonanaka polele',
    'home.h1a': 'Bazwaki mongongo na yo',
    'home.h1b': 'na mbongo na yo.',
    'home.h1c': 'Zwa nguya lisusu.',
    'home.sub': "Mibu ebele, ba parti bazwaki makabo na bino mpe babosanaki mboka na bino. Congo Liboso etongami ndenge mosusu : likabo nyonso emonanaka polele, mpe moto nyonso aponami na motango ya mérite oyo mbongo, libota to kanga-kanga ekoki kobebisa te.",
    'home.money': "Ofutaka te mpo na kokota. Okoti mpo na kozwa bokonzi lisusu.",
    'home.cta1': 'Zwa esika na ngai — ya ofele',
    'home.cta2': 'Tala esika mbongo ekei',
    'reg.title': "Kokoma — Congo Liboso",
    'reg.sub': 'Kota na mouvement ya bana-mboka mpo na Kongo ya malamu',
    'reg.launch': 'Ebandeli ya ekolo: 4 janvier 2027 — kokoma liboso ya mokolo monene',
  },
  kg: {
    'home.badge1': 'Kukota ya ofele',
    'home.badge2': 'Mbongo yawonso yimonikini pwelele',
    'home.h1a': 'Babongidi mungungu waku',
    'home.h1b': 'ye mbongo yaku.',
    'home.h1c': 'Baka kinguzulu diaka.',
    'home.sub': "Bamvu miyingi, mapaati mabongidi makabu meno bosi mabungidi vata dieno. Kongo Ya Disu ditungidi mu mpila yankaka : dikabu diawonso dimonikini pwelele, ye ndwenga yawonso yisolwa mu ntalu ya mérite yina mbongo, kanda vova luzolo lulendi bebisa ko.",
    'home.money': "Kufutanga ko mu kukota. Ukotanga mu baka kinguzulu diaka.",
    'home.cta1': 'Baka fulu kiami — ya ofele',
    'home.cta2': 'Tala kwe mbongo keti',
    'reg.title': "Kusonika — Kongo Ya Disu",
    'reg.sub': 'Kota mu mouvement ya bantu mu Kongo yambote',
    'reg.launch': 'Lubantiku lwa nsi: 4 janvier 2027 — sonika ntete lumbu kinene',
  },
  ts: {
    'home.badge1': 'Kubwela kwa ofele',
    'home.badge2': 'Makuta onso adi amueneka patoke',
    'home.h1a': 'Bakuata dieyi diebe',
    'home.h1b': 'ne makuta ebe.',
    'home.h1c': 'Angata bukokeshi kabidi.',
    'home.sub': "Bidimu bia bungi, ba paati bakuata milambu yenu, kunyima bapua musoko wenu. Kongo Wa Dibue mmuibaka mushindu mukuabu : mulambu onso udi umueneka patoke, ne muntu onso mmusungudibua ku tshalu tshia mérite tshidi makuta, tshisamba anyi bulunda kabiyi mua kunyanga.",
    'home.money': "Kuena ufuta bua kubwela to. Udi ubwela bua kuangata bukokeshi kabidi.",
    'home.cta1': 'Angata muaba wanyi — wa ofele',
    'home.cta2': 'Tangila kudi makuta aya',
    'reg.title': "Kufunda — Kongo Wa Dibue",
    'reg.sub': 'Bwela mu mouvement wa bena-tshisamba bua Kongo muimpe',
    'reg.launch': 'Ntuadijilu wa ditunga: 4 janvier 2027 — funda kumpala kwa dituku dinene',
  },
  sw: {
    'home.badge1': 'Uanachama bila malipo',
    'home.badge2': 'Kila senti inafuatiliwa hadharani',
    'home.h1a': 'Walichukua sauti yako',
    'home.h1b': 'na pesa yako.',
    'home.h1c': 'Rudisha madaraka.',
    'home.sub': "Kwa miongo kadhaa, vyama vilichukua michango yenu kisha vikasahau kijiji chenu. Congo Kwanza imejengwa tofauti: kila mchango unafuatiliwa hadharani, na kila mgombea anachaguliwa kwa alama ya sifa ambayo pesa, kabila wala upendeleo haviwezi kupotosha.",
    'home.money': "Hulipi ili kujiunga. Unajiunga ili kurudisha madaraka.",
    'home.cta1': 'Chukua nafasi yangu — bila malipo',
    'home.cta2': 'Ona pesa inakoenda',
    'reg.title': "Kujisajili — Congo Kwanza",
    'reg.sub': 'Jiunge na harakati ya wananchi kwa Kongo bora',
    'reg.launch': 'Uzinduzi wa taifa: 4 Januari 2027 — jisajili kabla ya siku kuu',
  },
};
