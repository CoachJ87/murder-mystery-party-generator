
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import MysteryForm from "@/components/MysteryForm";
import { useAuth } from "@/context/AuthContext";
import { Message, FormValues } from "@/components/types";
import { Wand2 } from "lucide-react";
import { ConversationManager } from "@/components/creation/ConversationManager";

const MysteryCreation = () => {
  const [saving, setSaving] = useState(false);
  const [showChatUI, setShowChatUI] = useState(false);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isEditing && id) {
      loadExistingConversation(id);
    }
  }, [id]);

  const extractTitleFromMessages = (messages: any[]) => {
    if (!messages || messages.length === 0) return null;
    
    // Look through AI messages for titles
    const titlePattern = /#\s*["']?([^"'\n#]+)["']?(?:\s*-\s*A MURDER MYSTERY)?/i;
    const alternativeTitlePattern = /title:\s*["']?([^"'\n]+)["']?/i;
    
    for (const message of messages) {
      if (message.role === 'assistant' || message.is_ai) {
        const content = message.content || '';
        
        // Try to find title in markdown format
        const titleMatch = content.match(titlePattern);
        if (titleMatch && titleMatch[1]) {
          return formatTitle(titleMatch[1]);
        }
        
        // Try alternative format
        const altMatch = content.match(alternativeTitlePattern);
        if (altMatch && altMatch[1]) {
          return formatTitle(altMatch[1]);
        }
      }
    }
    
    return null;
  };
  
  const formatTitle = (title: string) => {
    // Convert to title case (first letter of each word capitalized)
    return title
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const loadExistingConversation = async (conversationId: string) => {
    try {
      console.log("Loading conversation with ID:", conversationId);
      const { data, error } = await supabase
        .from("conversations")
        .select("*, messages(*)")
        .eq("id", conversationId)
        .single();

      if (error) {
        console.error("Error loading conversation:", error);
        toast.error("Failed to load conversation data");
        return [];
      }

      if (data) {
        console.log("Loaded conversation data:", data);
        setShowChatUI(true);
        setConversationId(data.id);
        
        if (data.mystery_data) {
          setFormData(data.mystery_data as FormValues);
        }
        
        // If this conversation has messages, we can also try to extract a title
        if (data.messages && data.messages.length > 0) {
          const aiTitle = extractTitleFromMessages(data.messages);
          if (aiTitle) {
            // Update the conversation with the AI-generated title
            await supabase
              .from("conversations")
              .update({
                title: aiTitle,
                updated_at: new Date().toISOString()
              })
              .eq("id", conversationId);
          }
        }
        
        return [];
      } else {
        console.log("No conversation data found");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load conversation");
    }
    return [];
  };

  const saveMessage = async (message: Message) => {
    if (!isAuthenticated || !user || !conversationId) {
      console.log("Cannot save message: missing auth or conversation ID");
      return;
    }
    
    try {
      console.log("Saving message to database:", message);
      const { error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          content: message.content,
          role: message.is_ai ? "assistant" : "user",
        });
        
      if (error) {
        console.error("Error saving message:", error);
        toast.error("Failed to save message");
      } else {
        console.log("Message saved successfully");
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSave = async (data: FormValues) => {
    try {
      setSaving(true);
      console.log("formData on save:", data);

      await new Promise<void>((resolve) => {
        setFormData(data);
        resolve();
      });

      if (isAuthenticated && user) {
        let newConversationId = id;

        if (!isEditing) {
          const { data: newConversation, error } = await supabase
            .from("conversations")
            .insert({
              title: data.title || `${data.theme} Mystery`,
              mystery_data: data,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) {
            console.error("Error saving mystery:", error);
            toast.error("Failed to save mystery data");
          } else if (newConversation) {
            newConversationId = newConversation.id;
            setConversationId(newConversationId);
          }
        } else {
          const { error } = await supabase
            .from("conversations")
            .update({
              title: data.title || `${data.theme} Mystery`,
              mystery_data: data,
              updated_at: new Date().toISOString(),
            })
            .eq("id", id);

          if (error) {
            console.error("Error updating mystery:", error);
            toast.error("Failed to update mystery data");
          }
        }

        setShowChatUI(true);
        if (newConversationId && newConversationId !== id) {
          navigate(`/mystery/edit/${newConversationId}`, { replace: true });
        }
      } else {
        setShowChatUI(true);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error saving mystery:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} mystery`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMessages = async (messages: Message[]) => {
    console.log("Saving messages:", messages.length);
    
    if (!messages.length) return;
    
    // Find the latest message that hasn't been saved yet
    const latestMessage = messages[messages.length - 1];
    await saveMessage(latestMessage);
    
    // Look for title in AI messages and update conversation title if found
    if (conversationId) {
      const aiTitle = extractTitleFromMessages(messages);
      if (aiTitle) {
        await supabase
          .from("conversations")
          .update({
            title: aiTitle,
            updated_at: new Date().toISOString()
          })
          .eq("id", conversationId);
      }
    }
  };

  const handleGenerateMystery = () => {
    if (conversationId) {
      navigate(`/mystery/preview/${conversationId}`);
    } else {
      toast.error("Please save your mystery first");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isEditing ? "Edit Mystery" : "Create New Mystery"}
            </h1>
            <p className="text-muted-foreground">
              {showChatUI
                ? "Chat with our AI to refine your murder mystery"
                : "Start your new mystery by selecting from the options below."}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {showChatUI ? (
                <ConversationManager
                  conversationId={conversationId}
                  formData={formData}
                  onSaveMessages={handleSaveMessages}
                  userId={user?.id}
                  isEditing={isEditing}
                />
              ) : (
                <MysteryForm
                  onSave={handleSave}
                  isSaving={saving}
                />
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center gap-4">
            {showChatUI && (
              <Button
                onClick={handleGenerateMystery}
                className="bg-[#F97316] hover:bg-[#FB923C] text-white font-semibold"
              >
                <Wand2 className="mr-2 h-5 w-5" /> Generate Mystery
              </Button>
            )}
            {showChatUI ? null : (
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MysteryCreation;
