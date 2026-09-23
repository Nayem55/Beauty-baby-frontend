// The supplied HTML remains the source of truth for the storefront design.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const original=readFileSync('Assets/beauty-baby-ecommerce-prototype.html','utf8');
mkdirSync('public/assets',{recursive:true}); mkdirSync('src/design',{recursive:true});
const logo=original.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
writeFileSync('public/assets/brand.png',Buffer.from(logo[1],'base64'));
writeFileSync('src/design/prototype.css',original.match(/<style>([\s\S]*?)<\/style>/)[1]);
let main=original.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1].replaceAll(/data:image\/png;base64,[A-Za-z0-9+/=]+/g,'/assets/brand.png');
main=main.replace(/ onclick="[^"]*"/g,'');
main=main.replace(/<div class="categories">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/,'<div class="categories" id="homeCategories"></div></div></section>');
main=main.replace(/<div class="bundle-options" id="bundleOptions">[\s\S]*?<\/div><div class="bundle-progress">/,'<div class="bundle-options" id="bundleOptions"></div><div class="bundle-progress">');
main=main.replace(/<div class="ugc-track">[\s\S]*?<\/div><\/div>\s*<\/section>/,'<div class="ugc-track" id="homeCommunity"></div></div></section>');
main=main.replace('href="#shop"','href="/shop"').replace('href="#gifts"','href="#story"');
main=main.replace('href="#" class="btn btn-ghost"','href="/pages/about" class="btn btn-ghost"');
main=main.replace('Pick any three favorites. The progress bar and total update instantly — a small interaction that makes gifting feel playful.','Pick three little favorites for a thoughtful gift. We’ll bring them together in one lovely order.');
writeFileSync('src/design/home.html',main);
const products=Function('return '+original.match(/const products=(\[[\s\S]*?\]);/)[1])();
writeFileSync('server/prototype-products.json',JSON.stringify(products,null,2));
console.log('Extracted the original stylesheet, home layout, embedded logo, and sample catalog.');
