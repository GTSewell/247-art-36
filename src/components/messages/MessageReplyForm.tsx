
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageReplyFormProps {
  messageId: string;
  onReply: (messageId: string, replyText: string) => Promise<void>;
  creditAmount: number;
}

const MessageReplyForm = ({ messageId, onReply, creditAmount }: MessageReplyFormProps) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onReply(messageId, replyText);
      setReplyText('');
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        className="mb-2"
        placeholder="Type your reply here..."
        required
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="flex justify-between items-center">
        <p className="text-sm">
          Reply to earn ${creditAmount?.toFixed(2)} credit
        </p>
        <Button 
          type="submit" 
          className="flex gap-2 items-center"
          disabled={isSubmitting || !replyText.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default MessageReplyForm;
