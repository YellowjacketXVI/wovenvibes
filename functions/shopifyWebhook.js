// ### external libraries
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// ### environment configuration
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// ### create clients and express app
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const app = express();
app.use(bodyParser.json({ type: '*/*' }));

// ### validate the Shopify webhook signature
function verifyHmac(req) {
  const digest = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(req.rawBody, 'utf8')
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(req.get('X-Shopify-Hmac-Sha256')));
}

// ### process incoming Shopify webhook
app.post('/webhook', async (req, res) => {
  if (!verifyHmac(req)) {
    return res.status(401).send('Invalid signature');
  }
  const event = req.get('X-Shopify-Topic');
  const payload = req.body;
  if (event === 'orders/create' || event === 'fulfillments/create') {
    await supabase.from('orders').upsert({ id: payload.id, data: payload });
  }
  res.sendStatus(200);
});

// ### export express handler
module.exports = app;
