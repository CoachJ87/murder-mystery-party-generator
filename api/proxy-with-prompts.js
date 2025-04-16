export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  console.log("----- NEW REQUEST TO PROXY-WITH-PROMPTS -----");
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    console.log(`Request method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);
    
    // Try to get the real IP for debugging
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    console.log(`Request from IP: ${ip}`);
    
    // Log all request headers for debugging
    const headers = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log("Request headers:", JSON.stringify(headers));
    
    // Try to parse the request body
    let requestBody;
    let rawBody = "";
    try {
      rawBody = await req.text();
      console.log(`Raw request body (first 200 chars): ${rawBody.substring(0, 200)}...`);
      requestBody = JSON.parse(rawBody);
      console.log("Successfully parsed request body");
    } catch (error) {
      console.log(`Error parsing request body: ${error.message}`);
      console.log(`Raw body: ${rawBody}`);
      requestBody = {};
    }

    // Always use mock for now
    console.log("Returning mock response for debugging");
    
    // Return mock response
    const mockResponse = {
      id: "msg_mock",
      type: "message",
      role: "assistant",
      content: [
        {
          type: "text",
          text: "# \"DEBUGGING MODE\" - A MURDER MYSTERY\n\n## PREMISE\nThis is a debug response to verify the API endpoint is being called correctly.\n\n## VICTIM\n**The API** - Mysteriously not showing any logs or errors.\n\n## MURDER METHOD\nThe murderer silently intercepted requests without leaving any trace in the Vercel logs.\n\n## CHARACTER LIST (4 PLAYERS)\n1. **The Frontend** - Sends requests but doesn't see proper responses.\n2. **The Backend** - Processes requests but might have issues.\n3. **The Environment Variables** - Might be missing or invalid.\n4. **The Claude API** - The external service that might be rejecting our calls.\n\nWould this murder mystery concept work for your event? You can continue to make edits, and once you're satisfied, press the 'Generate Mystery' button to create a complete game package with detailed character guides, host instructions, and all the game materials you'll need if you choose to purchase the full version!"
        }
      ],
      model: "claude-3-7-sonnet-20250219",
      stop_reason: "end_turn",
      usage: {
        input_tokens: 10,
        output_tokens: 200
      }
    };

    console.log("Sending successful mock response");
    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
      },
    });
  } catch (error) {
    console.error(`Unhandled error: ${error.message}`);
    console.error(error.stack);
    
    // Return error response
    return new Response(JSON.stringify({ 
      error: error.message || "Unknown error", 
      type: error.name || "Error",
      content: [
        {
          type: "text",
          text: `Debug error information: ${error.message}`
        }
      ]
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
      },
    });
  }
}
