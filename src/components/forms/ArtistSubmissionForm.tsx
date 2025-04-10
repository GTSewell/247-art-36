
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  artistName: z.string().min(2, {
    message: "Artist name must be at least 2 characters.",
  }),
  instagramHandle: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  comments: z.string().optional(),
});

export function ArtistSubmissionForm() {
  const isMobile = useIsMobile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: "",
      instagramHandle: "",
      email: "",
      comments: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('artist_submissions')
        .insert({
          artist_name: values.artistName,
          instagram_handle: values.instagramHandle || null,
          email: values.email,
          comments: values.comments || null,
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast.success("Submission received! Thank you for your interest.");
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to submit form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="artistName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Artist Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter artist name" {...field} className="text-sm md:text-base" />
              </FormControl>
              <FormMessage className="text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagramHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Instagram Handle (optional)</FormLabel>
              <FormControl>
                <Input placeholder="@yourhandle" {...field} className="text-sm md:text-base" />
              </FormControl>
              <FormMessage className="text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" type="email" {...field} className="text-sm md:text-base" />
              </FormControl>
              <FormMessage className="text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">Additional Comments (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us more about your art..."
                  className="resize-none text-sm md:text-base"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs md:text-sm" />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">Submit Application</Button>
      </form>
    </Form>
  );
}
