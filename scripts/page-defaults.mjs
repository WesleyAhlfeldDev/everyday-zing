// Starting content for the pages WordPress builds with Elementor (their text
// is not in the REST API as fields). Copied from everyday-zing.com; edit it
// in the dashboard after the import.

const WP = 'https://everyday-zing.com/wp-content/uploads';

export const PAGE_DEFAULTS = {
  home: {
    hero: {
      title: 'Every Day Zing',
      subtext: 'A lifestyle blog by Carol Joy: outfits, recipes, skincare, money and the little finds that make an ordinary week sparkle.',
      cta_label: 'Read the newest post',
    },
    welcome: {
      title: 'So glad you’re here',
      text: 'Pull up a chair. Here’s what I’m wearing, cooking, reading and loving, with a little sparkle.',
      image: { url: `${WP}/2024/05/gold-cardigan-longher-hair.jpeg`, alt: 'Carol Joy in a gold cardigan' },
      image_2: { url: `${WP}/2020/10/Everyday-Zing-129-scaled.jpg`, alt: '' },
      cta: { title: 'More about me', url: '/about', target: '' },
    },
    shops: [
      { name: 'My Amazon Store', note: 'Everything I link, all in one place', url: 'https://www.amazon.com/shop/everydayzing' },
      { name: 'Nordstrom', note: 'Investment pieces and the Anniversary Sale', url: 'https://www.nordstrom.com/' },
      { name: 'Nordstrom Rack', note: 'Designer finds for less', url: 'https://www.nordstromrack.com/' },
      { name: 'Evereve', note: 'Denim and easy tops', url: 'https://evereve.com/' },
      { name: 'J.Jill', note: 'Soft layers that work all week', url: 'https://www.jjill.com/' },
      { name: 'Quince', note: 'Cashmere and linen basics', url: 'https://www.quince.com/' },
      { name: 'Zara', note: 'Trend pieces to mix in', url: 'https://www.zara.com/' },
      { name: 'H&M', note: 'Fun, affordable extras', url: 'https://www2.hm.com/en_us/index.html' },
      { name: 'Old Navy', note: 'Everyday staples', url: 'https://oldnavy.gap.com/' },
      { name: 'QVC', note: 'Beauty and home favourites', url: 'https://www.qvc.com/' },
      { name: 'Walmart', note: 'Quick runs and surprise wins', url: 'https://www.walmart.com/cp/clothing/5438' },
    ],
    follows: [
      { name: 'Lorafied Hacks', handle: 'lorafied', note: 'Home hacks that actually work', url: 'https://www.instagram.com/lorafied' },
      { name: 'Morgan Chomps', handle: 'morganchomps', note: 'Easy, delicious recipes', url: 'https://www.instagram.com/morganchomps' },
      { name: 'Remember Wynn', handle: 'rememberwynn18', note: 'A story worth following', url: 'https://www.instagram.com/rememberwynn18' },
      { name: 'Kingdom of Sequins', handle: 'kingdomofsequins', note: 'Sparkle, always', url: 'https://www.instagram.com/kingdomofsequins/' },
      { name: 'Wanda Loves Sharing', handle: 'wandalovessharing', note: 'Finds and favourites', url: 'https://www.instagram.com/wandalovessharing/' },
    ],
    instagram: {
      handle: 'everydayzing',
      text: 'Outfits, quick Walmart runs and the odd plot twist, posted most days.',
      prints: [],
    },
    join: {
      text: 'New posts, specials and partner deals by email, and nothing you don’t need.',
    },
  },
  about: {
    hero: {
      title: 'Hi, I’m Carol Joy',
      subtext: 'A working empty-nester in a house full of men, sharing the things that put a little zing in every day.',
    },
    image: { url: `${WP}/2024/05/gold-cardigan-longher-hair.jpeg`, alt: 'Carol Joy in a gold cardigan' },
    body: `<p>I’m a dedicated, working empty-nester, and in a family of males (my husband, three sons and one cherished grandson) I occasionally like to indulge in some girls, bling and sparkle.</p>
<p>As a woman who has gracefully crossed the middle-aged milestone (well, maybe not so gracefully), I have an unquenchable thirst for knowledge, keeping a keen eye on technology, business, fashion, health, wellness and much more. That quest for sharing information is what started this blogging adventure.</p>
<p>By day I work in the hospitality industry, and in my spare time I volunteer for charity. My passion for life keeps growing every year, and with it my wish to mentor, inspire and add a dose of zing to every day.</p>
<h2>What lights you up?</h2>
<p>For me, it’s Every Day Zing. I love writing and sharing interests, thoughts and daily life. This is an open and honest place about making the best of whatever comes along.</p>
<p>The most useful things I learn come from family, friends, television and reading: a happy jumble of tips and tricks. I love taking what others share and making it my own, and I hope you’ll do the same here. Take what you need, use it, and pass it on.</p>
<p>Spread some zing every day. Ready to be inspired?</p>`,
  },
  blog: {
    hero: {
      title: 'The blog',
      subtext: 'Every post, newest first. Pick a chapter to narrow it down.',
    },
  },
  shop: {
    hero: {
      title: 'Shop my favourites',
      subtext: 'The stores I keep going back to, the things I love right now and everything I link, in one place.',
    },
    storefront: {
      title: 'My Amazon Store',
      text: 'Every product I’ve linked on the blog and on Instagram, sorted into lists you can browse.',
      url: 'https://www.amazon.com/shop/everydayzing',
      cta_label: 'Shop the storefront',
    },
    picks: [],
    stores: [],
    finds_category: 'shopping-finds',
    disclosure: 'Some links are affiliate links: I may earn a small commission, at no cost to you. I only share what I actually use.',
  },
  contact: {
    hero: {
      title: 'Say hello',
      subtext: 'Questions, ideas for a post, or a brand you’d like me to try? I read every message.',
    },
    email: '',
    note: 'For partnerships and collaborations, tell me a little about your brand and what you have in mind.',
  },
};
