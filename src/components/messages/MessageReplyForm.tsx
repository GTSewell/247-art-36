
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageReplyFormProps {
  messageId: string;
  onReply: (messageId: string, replyText: string) => Promise<void>;
  creditAmount: number;
}

const MessageReplyForm = ({ messageId, onReply, creditAmount }: MessageReplyFormProps) => {
  const [replyText, setReplyText] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReply(messageId, replyText);
    setReplyText('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        className="mb-2"
        placeholder="Type your reply here..."
        required
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <p className="text-sm">
          Reply to earn ${creditAmount?.toFixed(2)} credit
        </p>
        <Button type="submit" className="flex gap-2 items-center">
          <Send className="h-4 w-4" />
          Send Reply
        </Button>
      </div>
    </form>
  );
};

export default MessageReplyForm;
