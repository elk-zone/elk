/**
 * Instances with more than 50 moderation actions against them, per:
 * @source https://gist.github.com/yetzt/32c754fbe87009f8c161f40541147c70
 *
 * @usage ```
 * const breakfasts = ["bacon", "eggs", "oatmeal", "toast", "cereal"];
 * const order = "Let me get some sw.Bacon and eggs, please";
 *
 * order.match(new RegExp(`\\b(${breakfasts.join("|")})\\b`, "ig"));
 * // Returns ['eggs']
 *
 * ```
 */
const tdDomains: string[] = [
  'poa.st',
  'freespeechextremist.com',
  'pawoo.net',
  'gab.com',
  'baraag.net',
  'kiwifarms.cc',
  'shitposter.club',
  'bae.st',
  'noagendasocial.com',
  'gameliberty.club',
  'spinster.xyz',
  'gab.ai',
  'nicecrew.digital',
  'pieville.net',
  'yggdrasil.social',
  'sinblr.com',
  'iddqd.social',
  'detroitriotcity.com',
  'freecumextremist.com',
  'freeatlantis.com',
  'glindr.org',
  'brighteon.social',
  'beefyboys.win',
  'chudbuds.lol',
  'gleasonator.com',
  'neckbeard.xyz',
  'rdrama.cc',
  'freezepeach.xyz',
  'cawfee.club',
  'cum.salon',
  'ryona.agency',
  'varishangout.net',
  'nobodyhasthe.biz',
  'smuglo.li',
  'truthsocial.com',
  'solagg.com',
  'shortstackran.ch',
  'paypig.org',
  'posting.lolicon.rocks',
  'gitmo.life',
  'rakket.app',
  'mstdn.foxfam.club',
  'develop.gab.com',
  'anime.website',
  'kiwifarms.is',
  'humblr.social',
  '10minutepleroma.com',
  'honkwerx.tech',
  'newjack.city',
  'eientei.org',
  'leafposter.club',
  'weedis.life',
  'd-fens.systems',
  'eveningzoo.club',
  'kiwifarms.net',
  'bitcoinhackers.org',
  'truthsocial.co.in',
  'switter.at',
  'freefedifollowers.ga',
  'liberdon.com',
  'hunk.city',
  'glowers.club',
  'qoto.org',
  'seal.cafe',
  'sealion.club',
  'sleepy.cafe',
  'firedragonstudios.com',
  'gabfed.com',
  'gearlandia.haus',
  'jaeger.website',
  'toot.love',
  'nazi.social',
  'hentai.baby',
  'pooper.social',
  'pleroma.rareome.ga',
  'socnet.supes.com',
  'sneed.social',
  'search.fedi.app',
  'preteengirls.biz',
  'skippers-bin.com',
  'crypto-group-buy.com',
  'ligma.pro',
  'masochi.st',
  'unsafe.space',
  'youjo.love',
  'social.quodverum.com',
  'pedo.school',
  'nnia.space',
  'tastingtraffic.net',
  'raplst.town',
  'fedichive.tk',
  'bsd.moe',
  'fr13nd5.com',
  'catgirl.life',
  'degenerates.fail',
  'milker.cafe',
  'feminism.lgbt',
  'wagesofsinisdeath.com',
  'sneak.berlin',
  'exited.eu',
  'husk.site',
  'beefyboys.club',
  'ns.auction',
  'midnightride.rs',
  'gs.smuglo.li',
  'archivefedifor.fun',
  'a.sc',
  'wintermute.fr.to',
  'rage.lol',
  'justicewarrior.social',
  'mugicha.club',
  'outpoa.st',
  'freak.university',
  'frennet.link',
  'rainbowdash.net',
  'albin.social',
  'lets.saynoto.lgbt',
  'neenster.org',
  'cliterati.club',
  'freespeech.group',
  'coom.club',
  'comfyboy.club',
  'clubcyberia.co',
  'eatthebugs.social',
  'gab.protohype.net',
  'fedi.app',
  'tkammer.de',
  'melalandia.tk',
  'rapefeminists.network',
  'weeaboo.space',
  'lain.sh',
  'blob.cat',
  'wolfgirl.bar',
  'bajax.us',
  'springbo.cc',
  'wurm.host',
  'shigusegubu.club',
  'zztails.gay',
  'soykaf.com',
]

/**
 * Domains that don't meet the threshold for automatic exclusion, but are known to be havens
 * for hateful conduct or illegal content. These are applied as open-ended RegEx to prevent
 * ban evasion
 *
 * @source https://joinfediverse.wiki/FediBlock
 *
 * @usage ```
 * const breakfasts = ["bacon", "eggs", "oatmeal", "toast", "cereal"];
 * const order = "Let me get some sw.Bacon and eggs, please";
 *
 * order.match(new RegExp(`(${breakfasts.join("|")})\\b`, "ig"));
 * // Returns ['Bacon', 'eggs']
 *
 * ```
 */
const fbDomains: string[] = [
  '101010.pl',
  'kitsunemimi.club',
  'urspringer.de',
  'mastodon.cf',
  'valkyrie.world',
  'wiki-tube.de',
  'bitcoinhackers.org',
  'voring.me',
  'lgbtfree.zone',
  'workers.dev',
]

const otherDomains: string[] = [
  '101010',
  'kiwi',
  'loli',
  'lolli',
  'troll',
  'mastodong',
  'shitpos',
  'extremis',
  'antivaxxer',
  'genitalia',
  'fuck',
  'birdsite',
  'twitter',
  'porn',
  'higgers',
]

export function isReachableDomain(label: string): boolean {
  return (
    (label.match(new RegExp(`(${fbDomains.join('|')})\\b`, 'ig')) === null)
    && (label.match(new RegExp(`(${tdDomains.join('|')})\\b`, 'ig')) === null)
    && (label.match(new RegExp(`(${otherDomains.join('|')})`, 'ig')) === null)
    && (label.match(/[^\040-\176 \t\r\n]/gi) === null)
    && (label.match(/<[^>]+>/ig) === null)
  )
}
