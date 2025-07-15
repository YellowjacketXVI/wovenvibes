// ### external libraries
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// ### environment configuration
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ### download a product from Shopify and store it in Supabase
async function syncProduct(productId) {
  if (!SHOP_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
    throw new Error('Shopify credentials missing');
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase credentials missing');
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2023-01/products/${productId}.json`, {
    headers: {
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status}`);
  }
  const { product } = await res.json();
  const { data, error } = await supabase
    .from('products')
    .upsert({ id: product.id, data: product });
  if (error) throw error;
  return data;
}

// ### export API
module.exports = { syncProduct };
