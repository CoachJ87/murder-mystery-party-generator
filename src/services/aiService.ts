
import { supabase } from "@/lib/supabase";

// Interface for messages sent to the API
interface ApiMessage {
  role: string;
  content: string;
}

// Local Message interface for compatibility
interface Message {
  is_ai?: boolean;
  content: string;
  role?: string;
}

export const getAIResponse = async (messages: ApiMessage[] | Message[], promptVersion: 'free' | 'paid', systemInstruction?: string): Promise<string> => {
  try {
    console.log(`DEBUG: Starting getAIResponse with ${messages.length} messages`);
    console.log(`DEBUG: Prompt version: ${promptVersion}`);
    
    // Convert messages to a standard format first
    const standardMessages = messages.map(msg => {
      if ('is_ai' in msg) {
        return {
          role: msg.is_ai ? "assistant" : "user",
          content: msg.content
        };
      }
      return msg;
    });
    
    // IMPORTANT: Filter out any system messages - they need to be handled separately
    const userAndAssistantMessages = standardMessages.filter(msg => msg.role !== 'system');
    
    // Get system instruction (use the provided systemInstruction parameter or the default)
    const markdownInstruction = "Please format your response using Markdown syntax with headings (##, ###), lists (-, 1., 2.), bold (**), italic (*), and other formatting as appropriate to structure the information clearly. Do not use a title at the beginning of your response unless you are presenting a complete murder mystery concept with a title, premise, victim details, and character list.";
    
    const effectiveSystemInstruction = systemInstruction || markdownInstruction;
    
    console.log(`DEBUG: Found ${userAndAssistantMessages.length} user/assistant messages`);
    console.log(`DEBUG: System instruction (truncated): ${effectiveSystemInstruction.substring(0, 50)}...`);

    // First try using the Supabase Edge Function
    try {
      console.log("DEBUG: Attempting to use mystery-ai Edge Function");
      
      // Format the request for the Edge Function - only send user/assistant messages
      const edgeFunctionPayload = {
        messages: userAndAssistantMessages,
        system: effectiveSystemInstruction, // Send as top-level system parameter
        promptVersion
      };

      console.log("DEBUG: Edge Function payload structure:", {
        messageCount: edgeFunctionPayload.messages.length,
        hasSystemInstruction: !!edgeFunctionPayload.system,
        systemInstructionPreview: edgeFunctionPayload.system ? 
          edgeFunctionPayload.system.substring(0, 30) + '...' : 'none'
      });

      const { data: functionData, error: functionError } = await supabase.functions.invoke('mystery-ai', {
        body: edgeFunctionPayload
      });

      // Handle Edge Function response
      if (functionData) {
        // If the Edge Function indicates it's missing configuration, quietly fall back to Vercel API
        if (functionData.error && (
          functionData.error.includes("Configuration error") || 
          functionData.error.includes("Missing Anthropic API key")
        )) {
          console.log("DEBUG: Edge Function not configured, falling back to Vercel API");
          return await fallbackToVercelApi(userAndAssistantMessages, effectiveSystemInstruction, promptVersion);
        }

        // For successful responses, return the content
        if (functionData.choices?.[0]?.message?.content) {
          return functionData.choices[0].message.content;
        }
      }

      // Handle explicit errors from the Edge Function
      if (functionError) {
        console.log("DEBUG: Edge Function error, falling back to Vercel API:", functionError);
        return await fallbackToVercelApi(userAndAssistantMessages, effectiveSystemInstruction, promptVersion);
      }

      console.log("DEBUG: Invalid response format from Edge Function, falling back");
      return await fallbackToVercelApi(userAndAssistantMessages, effectiveSystemInstruction, promptVersion);

    } catch (edgeFunctionError) {
      console.log("DEBUG: Edge Function exception, falling back to Vercel API:", edgeFunctionError);
      return await fallbackToVercelApi(userAndAssistantMessages, effectiveSystemInstruction, promptVersion);
    }
  } catch (error) {
    console.error(`DEBUG: Error in getAIResponse: ${error.message}`);
    return `There was an error: ${error.message}. Please try again.`;
  }
};

const fallbackToVercelApi = async (
  userAndAssistantMessages: ApiMessage[],
  systemInstruction: string,
  promptVersion: 'free' | 'paid'
): Promise<string> => {
  console.log("DEBUG: Using Vercel API fallback");
  const apiUrl = 'https://website-murder-mystery-party-generator.vercel.app/api/proxy-with-prompts';

  // Format request for the Vercel API - ensure system is sent as a separate parameter
  const requestBody = {
    messages: userAndAssistantMessages,
    system: systemInstruction, // Send as top-level system parameter
    promptVersion
  };

  console.log("DEBUG: Sending to Vercel API:", {
    messageCount: requestBody.messages.length,
    systemInstructionPreview: requestBody.system.substring(0, 30) + '...'
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DEBUG: API returned status ${response.status}: ${errorText}`);
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }

    throw new Error("Invalid response format from API");
  } catch (error) {
    console.error("DEBUG: Error in fallbackToVercelApi:", error);
    throw error;
  }
};
