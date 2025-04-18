
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Message, FormValues } from "@/components/types";
import MysteryChat from "@/components/MysteryChat";

interface ConversationManagerProps {
  conversationId: string | null;
  formData: FormValues | null;
  onSaveMessages: (message: Message) => Promise<void>;
  userId: string | undefined;
  isEditing: boolean;
}

export const ConversationManager = ({
  conversationId,
  formData,
  onSaveMessages,
  userId,
  isEditing
}: ConversationManagerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (conversationId && !initialDataLoaded) {
      loadExistingConversation(conversationId);
      setInitialDataLoaded(true);
    }
  }, [conversationId, initialDataLoaded, isEditing]);

  const loadExistingConversation = async (id: string) => {
    try {
      console.log("Loading conversation with ID:", id);
      setIsLoadingHistory(true);
      
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load conversation messages");
        return;
      }

      if (data && data.length > 0) {
        console.log("Loaded messages:", data.length);
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
          content: msg.content,
          is_ai: msg.role === "assistant",
          timestamp: new Date(msg.created_at || Date.now())
        }));
        
        // Sort messages by timestamp to ensure proper order
        formattedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setMessages(formattedMessages);
        
        // If there's form data and first message is from user, ensure it's included in the history
        if (formData && formData.additionalDetails && (!formattedMessages[0] || formattedMessages[0].is_ai)) {
          const initialUserMessage = constructInitialMessage(formData);
          if (initialUserMessage) {
            setMessages([initialUserMessage, ...formattedMessages]);
          }
        }
      } else {
        console.log("No messages found for conversation:", id);
        
        // If no messages but we have form data, construct the initial message
        if (formData) {
          const initialUserMessage = constructInitialMessage(formData);
          if (initialUserMessage) {
            setMessages([initialUserMessage]);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load conversation");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Helper to construct the initial message from form data
  const constructInitialMessage = (data: FormValues): Message | null => {
    let initialChatMessage = `Let's create a murder mystery`;
    if (data.theme) {
      initialChatMessage += ` with a ${data.theme} theme`;
    }
    if (data.playerCount) {
      initialChatMessage += ` for ${data.playerCount} players`;
    }
    if (data.hasAccomplice !== undefined) {
      initialChatMessage += data.hasAccomplice ? `, including an accomplice` : `, without an accomplice`;
    }
    if (data.scriptType) {
      initialChatMessage += ` with ${data.scriptType} scripts`;
    }
    if (data.additionalDetails) {
      initialChatMessage += `. Additional details: ${data.additionalDetails}`;
    }
    initialChatMessage += ".";

    return {
      id: "initial-message",
      content: initialChatMessage,
      is_ai: false,
      timestamp: new Date(0), // Use oldest possible date to ensure it's first
    };
  };

  // Adapter function to handle the updated onSave prop type
  const handleSaveMessage = (message: Message) => {
    if (onSaveMessages) {
      return onSaveMessages(message);
    }
    return Promise.resolve();
  };

  // Create a special system message to help maintain context
  const createSystemMessage = (formData: FormValues | null) => {
    if (!formData) return "";
    
    let systemMessage = "This is a murder mystery creation conversation. ";
    systemMessage += "Here are the user's confirmed preferences that you should remember and not ask about again: ";
    
    if (formData.theme) {
      systemMessage += `Theme: ${formData.theme}. `;
    }
    if (formData.playerCount) {
      systemMessage += `Player count: ${formData.playerCount}. `;
    }
    if (formData.hasAccomplice !== undefined) {
      systemMessage += `Accomplice: ${formData.hasAccomplice ? "Yes" : "No"}. `;
    }
    if (formData.scriptType) {
      systemMessage += `Script type: ${formData.scriptType}. `;
    }
    
    systemMessage += "Please remember these details throughout our conversation and don't ask about them again.";
    return systemMessage;
  };

  return (
    <div className="w-full h-full">
      <MysteryChat
        initialTheme={formData?.theme || ""}
        initialPlayerCount={formData?.playerCount}
        initialHasAccomplice={formData?.hasAccomplice}
        initialScriptType={formData?.scriptType}
        initialAdditionalDetails={formData?.additionalDetails}
        savedMysteryId={conversationId || undefined}
        onSave={handleSaveMessage}
        initialMessages={messages}
        isLoadingHistory={isLoadingHistory}
        systemInstruction={createSystemMessage(formData)}
      />
    </div>
  );
};
