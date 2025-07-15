// ### Shopify domain for storefront API calls
window.SHOPIFY_DOMAIN = "yourshop.myshopify.com";
// ### public storefront access token
window.SHOPIFY_ACCESS_TOKEN = "your_access_token";
// ### base URL for your Supabase project
window.SUPABASE_PROJECT_URL = "https://yourproject.supabase.co";
// ### edge function endpoint that proxies Shopify requests
window.SUPABASE_PROXY_URL = window.SUPABASE_PROJECT_URL + "/functions/v1/shopify-proxy";
// ### Supabase anon key
window.SUPABASE_ANON_KEY = "your_supabase_anon_key";
