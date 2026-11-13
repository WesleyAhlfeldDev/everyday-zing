// The legal pages, written for how the new site actually works (Next.js on
// Vercel, Neon database, Vercel Analytics, no comments, no ad cookies).
//
//   npm run seed:pages -- --legal    (overwrites the legal pages with this text)
//
// Before going live, fill in BUSINESS once the client confirms the LLC's legal
// name (see the "Legal Pages Questions" doc). These are careful templates, not
// legal advice.

const BUSINESS = 'Every Day Zing'; // TODO: the LLC's registered name, e.g. "Every Day Zing LLC"
const SITE = 'everyday-zing.com';
const EMAIL = 'carolb1107@gmail.com';
const STATE = 'Texas';
const UPDATED = 'November 13, 2026';

const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const updated = `<p><em>Last updated ${UPDATED}</em></p>`;

export const LEGAL_CONTENT = {
  'privacy-policy': {
    title: 'Privacy Policy',
    subtext: 'What this site collects, why, and how to ask me to change or delete it.',
    body: `${updated}
<p>This policy explains how ${BUSINESS} (“we”, “us”) handles personal information on ${SITE} (the “site”). The short version: we collect only what you choose to send us, we never sell it, and you can ask us to delete it at any time.</p>

<h2>What we collect</h2>
<h3>Information you give us</h3>
<ul>
  <li><strong>Becoming a Zinger (newsletter):</strong> your first name, your email address and the page you signed up on.</li>
  <li><strong>The contact form:</strong> your first and last name, email address, subject and message.</li>
  <li><strong>Giveaways:</strong> whatever the giveaway asks for (usually a name and email, and a mailing address if you win).</li>
</ul>
<h3>Information collected automatically</h3>
<ul>
  <li><strong>Visit statistics:</strong> we use Vercel Web Analytics to count page views. It does not use cookies and does not identify you; it records things like the page viewed, the referring site, the country and the device type, in aggregate.</li>
  <li><strong>Server logs:</strong> our hosting provider, Vercel, keeps short-lived technical logs (including IP addresses) to run the site and protect it from abuse.</li>
</ul>
<p>We do not collect payment details, and we do not knowingly collect sensitive information such as health or financial data.</p>

<h2>How we use it</h2>
<ul>
  <li>To send the Zinger emails you asked for: new posts, giveaways, specials and partner deals.</li>
  <li>To reply to your messages.</li>
  <li>To run giveaways, contact winners and deliver prizes.</li>
  <li>To understand which posts people read, so we can write more of what’s useful.</li>
  <li>To keep the site secure and to meet legal obligations.</li>
</ul>

<h2>Who we share it with</h2>
<p>We do not sell or rent your personal information, and we do not share it for targeted advertising. We share it only with the service providers that run the site for us, and only so they can do that work:</p>
<ul>
  <li><strong>Vercel</strong> (hosting, analytics and image storage), United States.</li>
  <li><strong>Neon</strong> (the database that stores sign-ups and messages), hosted on Amazon Web Services in the United States.</li>
  <li><strong>An email service provider</strong> that sends the newsletter on our behalf.</li>
  <li><strong>Giveaway partners</strong>, only when a brand ships a prize directly to a winner and only with the winner’s agreement.</li>
</ul>
<p>We may also disclose information if the law requires it, to protect our rights or someone’s safety, or as part of a sale or transfer of the business.</p>

<h2>Affiliate links and other websites</h2>
<p>Some links on the site are affiliate links (see the <a href="/disclaimer-disclosure">Disclaimer &amp; Disclosure</a>). When you click one, the store you visit (for example Amazon) may set its own cookies to credit the sale. That store’s privacy policy applies there, not this one. The same is true for Instagram, Facebook and any other site we link to or embed.</p>

<h2>Cookies</h2>
<p>The site itself does not set cookies for visitors. See the <a href="/cookie-policy">Cookie Policy</a> for the details, including cookies other companies may set.</p>

<h2>How long we keep it</h2>
<ul>
  <li><strong>Newsletter:</strong> until you unsubscribe or ask us to delete it.</li>
  <li><strong>Messages:</strong> up to two years, unless we need them longer for an ongoing conversation or a legal reason.</li>
  <li><strong>Giveaway entries:</strong> until the giveaway ends and the prize is delivered, then up to one year for our records (longer if tax rules require it).</li>
</ul>

<h2>Your choices and rights</h2>
<p>Wherever you live, you can ask us to:</p>
<ul>
  <li>tell you what personal information we hold about you and give you a copy;</li>
  <li>correct it;</li>
  <li>delete it;</li>
  <li>stop sending you emails (every email also has an unsubscribe link).</li>
</ul>
<p>Email ${mail} or use the <a href="/contact">contact form</a>. We may ask you to confirm your email address so we know the request is yours, and we will reply within 45 days. We will never treat you differently for using these rights. Residents of states with their own privacy laws (such as California, Colorado, Virginia and Texas) have these rights under those laws too, including the right to appeal a decision by replying to our answer.</p>

<h2>Children</h2>
<p>The site is written for adults. We do not knowingly collect personal information from children under 13. If you believe a child has sent us information, email ${mail} and we will delete it.</p>

<h2>Security</h2>
<p>We use reputable providers, encrypted connections (HTTPS) and a password-protected dashboard. No website can promise perfect security, but we take reasonable steps to protect what you share.</p>

<h2>Visitors outside the United States</h2>
<p>The site is run from the United States and your information is stored there. By using the site you understand that it will be handled under US law.</p>

<h2>Changes to this policy</h2>
<p>If we change this policy we will update the date at the top. Significant changes will also be mentioned in the newsletter.</p>

<h2>Contact</h2>
<p>${BUSINESS}, ${STATE}, United States. Email ${mail}.</p>`,
  },

  'terms-and-conditions': {
    title: 'Terms and Conditions',
    subtext: 'The ground rules for using this site.',
    body: `${updated}
<p>These terms apply to your use of ${SITE} (the “site”), run by ${BUSINESS} (“we”, “us”). By using the site you agree to them. If you don’t agree, please don’t use the site.</p>

<h2>What the site is</h2>
<p>Every Day Zing is a personal lifestyle blog. Posts share personal experiences and opinions about style, recipes, skincare, money, home and favourite finds. Nothing on the site is professional advice; please read the <a href="/disclaimer-disclosure">Disclaimer &amp; Disclosure</a>.</p>

<h2>Our content</h2>
<p>The writing, photos, graphics and logo on the site belong to us or to the people who licensed them to us, and are protected by copyright and trademark law. You’re welcome to:</p>
<ul>
  <li>read, print or save posts for your own personal, non-commercial use;</li>
  <li>share a link to any post;</li>
  <li>quote a short excerpt with credit to Every Day Zing and a link back to the original post.</li>
</ul>
<p>Please ask first before republishing a whole post, using our photos, or using anything from the site commercially. Pinning or sharing a post through the share tools of Pinterest, Instagram or Facebook is fine.</p>

<h2>What you send us</h2>
<p>When you send us a message, sign up for the newsletter or enter a giveaway, you confirm that the information is yours and accurate. If you send us ideas, tips or feedback, we may use them without owing you anything; we’ll never publish your name or message without asking.</p>

<h2>Acceptable use</h2>
<p>Please don’t misuse the site: no attempts to break or overload it, no scraping or copying content in bulk, no spam through the forms, and nothing unlawful. We may block access for anyone who does.</p>

<h2>Affiliate links, products and other websites</h2>
<p>The site links to stores and other websites we don’t control, and some of those links earn us a commission. We aren’t responsible for other websites, their products, prices, shipping, returns or privacy practices. Any purchase is between you and the store. Prices and availability change, so always check the store before you buy.</p>

<h2>Giveaways</h2>
<p>Every giveaway follows our <a href="/giveaway-rules">Giveaway Official Rules</a> plus the details in that giveaway’s post. If the two disagree, the giveaway post wins for that giveaway.</p>

<h2>No warranties</h2>
<p>The site and everything on it are provided “as is”. We try to keep things accurate and up to date but make no promises that the content is complete, correct or current, or that the site will always be available or free of errors.</p>

<h2>Limitation of liability</h2>
<p>To the fullest extent the law allows, ${BUSINESS} and the people behind it are not liable for any indirect, incidental or consequential loss, or for any loss arising from your use of the site, its content, or any product, service or website it mentions or links to. Where liability can’t be excluded, it is limited to $100. Some places don’t allow these limits, so they may not all apply to you.</p>

<h2>Indemnity</h2>
<p>If you misuse the site or break these terms and someone makes a claim against us because of it, you agree to cover the reasonable costs that result.</p>

<h2>Governing law</h2>
<p>These terms are governed by the laws of the State of ${STATE} and of the United States, without regard to conflict-of-law rules. Any dispute will be heard only in the state or federal courts located in ${STATE}, and you agree to those courts’ jurisdiction.</p>

<h2>Changes</h2>
<p>We may update these terms from time to time. The date at the top shows the latest version, and using the site after a change means you accept it.</p>

<h2>Contact</h2>
<p>Questions about these terms? Email ${mail}.</p>`,
  },

  'cookie-policy': {
    title: 'Cookie Policy',
    subtext: 'Short, because the site barely uses any.',
    body: `${updated}
<p>Cookies are small files a website stores in your browser. This page explains which ones you may meet on ${SITE}.</p>

<h2>Cookies the site sets</h2>
<p><strong>None for visitors.</strong> Reading posts, searching, signing up for the newsletter or sending a message does not store any cookies from us.</p>
<p>Our visit statistics come from Vercel Web Analytics, which counts page views without cookies and without identifying you.</p>
<p>The only cookie the site sets is a sign-in cookie for the site owner’s dashboard. It is strictly necessary and is never set for visitors.</p>

<h2>Cookies other companies may set</h2>
<ul>
  <li><strong>Affiliate links:</strong> when you click a link to a store such as Amazon, that store may set cookies on its own site to credit the sale. They’re governed by that store’s cookie policy.</li>
  <li><strong>Embedded content:</strong> some posts include content from Instagram, Facebook, YouTube or Pinterest. When it loads, those companies may set cookies under their own policies.</li>
</ul>
<p>We don’t use advertising or tracking cookies, and we don’t let ad networks place cookies through the site. If that ever changes we will update this page and ask for your consent where the law requires it.</p>

<h2>Controlling cookies</h2>
<p>You can block or delete cookies in your browser settings at any time. Blocking cookies won’t stop this site from working.</p>

<h2>Contact</h2>
<p>Questions? Email ${mail}. See also our <a href="/privacy-policy">Privacy Policy</a>.</p>`,
  },

  'disclaimer-disclosure': {
    title: 'Disclaimer & Disclosure',
    subtext: 'How this blog earns money, and what it is (and isn’t).',
    body: `${updated}
<h2>Affiliate links</h2>
<p>Some links on Every Day Zing are affiliate links. If you click one and buy something, ${BUSINESS} may earn a small commission at <strong>no extra cost to you</strong>. Affiliate links appear in posts, on the <a href="/shop">Shop</a> page, in the newsletter and on our social media.</p>
<p><strong>As an Amazon Associate I earn from qualifying purchases.</strong> Our Amazon storefront and many Amazon links in posts are affiliate links.</p>
<p>Commissions help keep the blog running. They never change what I recommend: I only share things I have used, enjoyed, or researched and would happily buy myself.</p>

<h2>Sponsored posts and gifted products</h2>
<p>Sometimes a brand pays for a post or sends a product for free. When that happens, the post says so clearly near the top (for example “Sponsored” or “Gifted”). Opinions are always my own, and a brand never gets to approve what I say about its product.</p>

<h2>Giveaways</h2>
<p>Giveaways follow our <a href="/giveaway-rules">Giveaway Official Rules</a>. If a brand provides the prize, the giveaway post names the brand.</p>

<h2>Not professional advice</h2>
<p>Everything on Every Day Zing is personal experience and opinion, shared to inspire and inform. It is not medical, health, nutritional, financial, tax, legal or other professional advice.</p>
<ul>
  <li><strong>Health, wellness and skincare:</strong> talk to your doctor or another qualified professional before changing your diet, exercise, skincare or medication. Patch-test new products and check ingredients for allergies.</li>
  <li><strong>Money:</strong> posts in The Money Tree describe what has worked for me. Your situation is different; please talk to a qualified financial or tax professional before making financial decisions.</li>
  <li><strong>Recipes:</strong> check ingredients for allergens, follow safe food-handling practice, and treat nutrition figures (if any) as estimates.</li>
  <li><strong>Home and DIY:</strong> follow manufacturers’ instructions and use common sense with tools and products.</li>
</ul>
<p>You are responsible for how you use anything you read here.</p>

<h2>Accuracy</h2>
<p>I work to keep posts accurate, but details change: prices, availability, store policies and product formulas especially. Always check with the store or brand before you buy.</p>

<h2>Use of AI tools</h2>
<p>I sometimes use artificial-intelligence tools to help refine wording, organise ideas, and create or enhance images. All content is chosen, reviewed and guided by me.</p>

<h2>Questions</h2>
<p>Email ${mail} if you have any questions about how the blog works with brands.</p>`,
  },

  'giveaway-rules': {
    title: 'Giveaway Official Rules',
    subtext: 'The standing rules for every Every Day Zing giveaway.',
    body: `${updated}
<p><strong>NO PURCHASE OR PAYMENT OF ANY KIND IS NECESSARY TO ENTER OR WIN. A PURCHASE WILL NOT INCREASE YOUR CHANCES OF WINNING. VOID WHERE PROHIBITED.</strong></p>
<p>These rules apply to every giveaway run by ${BUSINESS} on ${SITE}, in our emails, or on our social media accounts (each a “Giveaway”). Each Giveaway also has an announcement (a blog post, email or social post) that gives its prize, dates and how to enter (the “Giveaway Details”). If the Giveaway Details and these rules disagree, the Giveaway Details win for that Giveaway.</p>

<h2>1. Sponsor</h2>
<p>The sponsor is ${BUSINESS}, ${STATE}, United States (“Sponsor”), unless the Giveaway Details name a brand partner as sponsor or co-sponsor.</p>

<h2>2. Who can enter</h2>
<p>Open to legal residents of the 50 United States and the District of Columbia who are 18 or older (or the age of majority where they live, if higher) when they enter. Not open to employees, contractors or immediate family members (spouse, parents, children, siblings and their spouses) or household members of Sponsor or of any brand partner supplying the prize.</p>

<h2>3. Giveaway period</h2>
<p>Each Giveaway starts and ends on the dates and times (US Central Time) stated in its Giveaway Details. Entries received outside that period are not counted.</p>

<h2>4. How to enter</h2>
<p>Enter as described in the Giveaway Details, for example by signing up for the newsletter or commenting on a post. Every Giveaway has a free way to enter. Unless the Giveaway Details say otherwise, the limit is one entry per person. Entries made with scripts, bots, multiple accounts or fake identities are void.</p>

<h2>5. Choosing a winner</h2>
<p>Within 7 days after the Giveaway ends, Sponsor will choose the winner(s) in a random drawing from all eligible entries. The odds of winning depend on the number of eligible entries received.</p>

<h2>6. Telling the winner</h2>
<p>Winners are contacted by the email address or social media account they used to enter. A winner must reply within 72 hours and may be asked to confirm eligibility and give a mailing address. If a winner does not reply in time, is not eligible, or the prize is returned undeliverable, the prize may be forfeited and another winner chosen.</p>
<p><strong>Watch out for scams:</strong> we will never ask you to pay anything, buy anything, or share bank or card details to claim a prize. Impersonator accounts sometimes message giveaway entrants; we only contact winners from our official accounts.</p>

<h2>7. Prizes</h2>
<p>The prize and its approximate retail value (“ARV”) are stated in the Giveaway Details. Prizes are awarded “as is”, cannot be transferred or exchanged for cash, and may be replaced by a prize of equal or greater value if the original becomes unavailable. Product warranties, if any, come from the manufacturer. Winners are responsible for any taxes; if a winner’s prizes from Sponsor total $600 or more in a calendar year, the winner must provide a completed IRS Form W-9 and will receive a Form 1099.</p>

<h2>8. Publicity</h2>
<p>Except where prohibited by law, by accepting a prize a winner agrees that Sponsor may announce their first name, last initial and state, and share their prize photos if they send any, without further payment.</p>

<h2>9. Social media</h2>
<p>Giveaways run on social media are in no way sponsored, endorsed, administered by or associated with Instagram, Facebook (Meta) or any other platform. By entering, you release those platforms from any responsibility for the Giveaway.</p>

<h2>10. General conditions</h2>
<p>Sponsor may disqualify anyone who tampers with entries or breaks these rules. If a Giveaway can’t run as planned because of fraud, technical failures or anything else beyond Sponsor’s control, Sponsor may cancel, change or pause it and, where appropriate, choose a winner from eligible entries received before the problem. Sponsor’s decisions are final.</p>

<h2>11. Release and limitation of liability</h2>
<p>By entering, you agree to release and hold harmless Sponsor, any brand partner, and their owners, employees and agents from any claims, injury, loss or damage arising from the Giveaway or from accepting or using a prize, to the fullest extent the law allows. Sponsor is not responsible for lost, late or misdirected entries, or for prizes lost or damaged in shipping.</p>

<h2>12. Disputes</h2>
<p>These rules are governed by the laws of the State of ${STATE}. Any dispute will be resolved individually, without class actions, in the state or federal courts located in ${STATE}.</p>

<h2>13. Privacy</h2>
<p>Information collected for a Giveaway is handled under our <a href="/privacy-policy">Privacy Policy</a>. A brand partner receives a winner’s shipping details only to deliver the prize.</p>

<h2>14. Winners list</h2>
<p>For the name of a Giveaway’s winner, email ${mail} within 60 days after the Giveaway ends, with the Giveaway’s name in the subject line.</p>`,
  },
};
