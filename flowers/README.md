# Bloom & Ruby — Shop Site

A one-page shop site: hero, an auto-rotating carousel of featured products, and a grid of everything currently for sale. Soft blush-and-blue palette, no build tools required — just HTML/CSS/JS.

## Files

- `index.html` — page structure
- `styles.css` — all styling (colors, layout, carousel, cards)
- `script.js` — loads `products.json` and builds the carousel + grid
- `products.json` — **the only file you need to edit to add/remove/update products**
- `images/` — placeholder flower graphics; swap these for real photos

## Adding or editing products

Open `products.json` in any text editor. It's a list of products like this:

```json
{
  "id": "p7",
  "name": "Sunflower Bunch",
  "price": "20.00",
  "image": "images/sunflower.jpg",
  "description": "A cheerful bunch of small sunflowers.",
  "category": "Bouquets",
  "featured": true,
  "soldOut": false,
  "stripeLink": "https://buy.stripe.com/xxxxxxxx"
}
```

- `id` — must be unique for each product (e.g. `p7`, `p8`...)
- `featured: true` puts it in the top carousel (keep it to ~3-5 items so it doesn't get crowded)
- `soldOut: true` grays out the Buy button and shows a "Sold Out" badge
- `image` — path to a photo in the `images/` folder (see below)
- `stripeLink` — leave blank until Stripe is set up (see next section); until then the Buy button opens a pre-filled email instead

To add a real photo: drop the image file into the `images/` folder, then set `"image"` to `"images/yourfile.jpg"`.

## Setting up real checkout (Stripe Payment Links)

You asked for real online payment, not just "contact to order." The simplest way to do that **without a backend server** is Stripe Payment Links — free to set up, no code:

1. An adult on the account creates a free account at stripe.com (Stripe requires the account holder to be 18+, so this should be you, not your son's girlfriend directly — she can still run the shop day-to-day).
2. In the Stripe Dashboard, go to **Payment Links** → **New**.
3. Add each product with its price and photo. Stripe hosts the checkout page and handles the card payment.
4. Copy the generated link (looks like `https://buy.stripe.com/xxxxxxxx`) and paste it into that product's `"stripeLink"` field in `products.json`.
5. Repeat for each product. Any product without a link falls back to "email to order" automatically, so you can turn Stripe on gradually.

Stripe takes a small standard processing fee per transaction (no monthly fee for Payment Links). Payouts go to whatever bank account is linked to the Stripe account.

## Branding

- Shop name "Bloom & Ruby" appears in the header and footer of `index.html` — search and replace with her real shop name if she'd rather use something else (e.g. "Bloomin' Ruby").
- Contact email/Instagram link are in the footer of `index.html`, and the email is also set at the top of `script.js` (`CONTACT_EMAIL`) — update both.
- Placeholder flower graphics are in `images/` — replace with real product photos whenever ready (square photos work best for the grid).

## Testing locally

Opening `index.html` directly by double-clicking may block the product data from loading (browsers restrict local file access). To preview properly, run a quick local server from this folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in a browser.

## Publishing the site for free

Easiest options, no cost:

- **Netlify Drop** — go to app.netlify.com/drop and drag this whole folder in. Get a live URL instantly.
- **GitHub Pages** — push this folder to a GitHub repo and enable Pages in the repo settings.

Either way, once it's live you can share the URL anywhere (Instagram bio, business cards, etc.).
