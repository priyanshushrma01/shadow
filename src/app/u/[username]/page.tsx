"use client";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import Navbar from "@/components/Navbar";

function UsernamePage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError?.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reloadMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/suggest-messages");
      const data = response.data.data[0].content.parts[0].text;
      const questions = data.split("||").map((question: string) => question.trim());
      setMessages(questions);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError?.response?.data.message ?? "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    reloadMessages();
  }, [reloadMessages]);

  const sendMessage = async (event: React.MouseEvent<HTMLDivElement>) => {
    const content = (event.target as HTMLDivElement).innerText;
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content,
      });
      toast({
        title: response.data.success ? response.data.message : "Failed",
        variant: response.data.success ? "default" : "destructive",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError?.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="my-8 mx-2 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-center text-5xl mb-8 font-bold">Public Profile Link</h1>
        <div>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">
                      Send Anonymous Messages to @{params.username}
                    </FormLabel>
                    <Textarea
                      className="resize-none text-lg p-5"
                      placeholder="Write your message here ..."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex mt-5 justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please Wait
                    </>
                  ) : (
                    "Send It"
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
          <div className="mt-8 mb-8">
            <Button className="mb-3" onClick={reloadMessages}>
              Reload
            </Button>
            <Separator />
          </div>
          {isLoading ? (
            <div className="flex justify-center mt-32 text-xl">
              <Loader2 className="animate-spin h-10 w-10" />
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                onClick={sendMessage}
                className="flex hover:cursor-pointer justify-center p-4 m-2 bg-slate-300 w-1/2 rounded-xl mx-auto"
              >
                {message}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

UsernamePage.displayName = "UsernamePage";
export default UsernamePage;
