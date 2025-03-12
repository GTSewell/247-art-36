
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InquiryType, PurchaseItem } from "./types";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface MessageFormValues {
  inquiryType: InquiryType;
  message: string;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: PurchaseItem | null;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, purchase }) => {
  const form = useForm<MessageFormValues>({
    defaultValues: {
      inquiryType: "shipping",
      message: purchase ? `Hello, I have a question about my order #${purchase.id} - ${purchase.title}.` : "",
    },
  });

  const handleSubmit = (values: MessageFormValues) => {
    if (!purchase) return;
    
    toast.success(`Message sent regarding order #${purchase.id} (${values.inquiryType})`);
    console.log("Message submitted:", values);
    onClose();
  };

  if (!purchase) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact 247 Support</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <h3 className="font-medium">Order Details</h3>
                <div className="mt-2 text-sm">
                  <p><strong>Order:</strong> #{purchase.id}</p>
                  <p><strong>Item:</strong> {purchase.title}</p>
                  <p><strong>Price:</strong> {purchase.price}</p>
                  <p><strong>Date:</strong> {purchase.date}</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="inquiryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inquiry Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an inquiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="damaged">Damaged Item</SelectItem>
                        <SelectItem value="faulty">Faulty Item</SelectItem>
                        <SelectItem value="shipping">Shipping Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your message here..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
