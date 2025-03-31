
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SHOPIFY_DOMAIN = Deno.env.get("SHOPIFY_DOMAIN");
const SHOPIFY_ACCESS_TOKEN = Deno.env.get("SHOPIFY_ACCESS_TOKEN");

if (!SHOPIFY_DOMAIN || !SHOPIFY_ACCESS_TOKEN) {
  console.error("Missing required environment variables for Shopify API");
}

interface ShopifyRequestOptions {
  endpoint: string;
  method?: string;
  query?: string;
  variables?: Record<string, unknown>;
  body?: unknown;
}

async function shopifyRequest({ endpoint, method = "GET", query, variables, body }: ShopifyRequestOptions) {
  const url = `https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN!,
  };

  const requestBody = query
    ? JSON.stringify({
        query,
        variables,
      })
    : JSON.stringify(body);

  try {
    const response = await fetch(url, {
      method: "POST", // GraphQL always uses POST
      headers,
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`Shopify API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in Shopify API request:", error);
    throw error;
  }
}

// Query to get products, potentially filtered by artist tag
const PRODUCTS_QUERY = `
  query GetProducts($artistTag: String, $first: Int!) {
    products(first: $first, query: $artistTag) {
      edges {
        node {
          id
          title
          description
          handle
          availableForSale
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          tags
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split("/shopify/")[1] || "";
    
    // Handle different endpoints
    if (endpoint === "products") {
      const { artistId } = await req.json();
      
      // Format artist tag if provided
      const artistFilter = artistId ? `tag:artist-${artistId}` : "";
      
      const result = await shopifyRequest({
        endpoint: "products",
        query: PRODUCTS_QUERY,
        variables: {
          artistTag: artistFilter,
          first: 50, // Adjust as needed
        },
      });
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else if (endpoint === "checkout") {
      // Handle checkout creation
      const { items } = await req.json();
      
      // Create checkout in Shopify
      const CREATE_CHECKOUT_MUTATION = `
        mutation checkoutCreate($input: CheckoutCreateInput!) {
          checkoutCreate(input: $input) {
            checkout {
              id
              webUrl
              totalPriceV2 {
                amount
                currencyCode
              }
            }
            checkoutUserErrors {
              code
              field
              message
            }
          }
        }
      `;
      
      // Format line items for Shopify
      const lineItems = items.map(item => ({
        variantId: item.id,
        quantity: item.quantity
      }));
      
      const result = await shopifyRequest({
        endpoint: "checkout",
        query: CREATE_CHECKOUT_MUTATION,
        variables: {
          input: {
            lineItems
          }
        }
      });
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // If endpoint not found
    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
