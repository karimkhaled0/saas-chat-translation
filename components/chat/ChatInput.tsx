"use client";
import { useSession } from "next-auth/react";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User, limitedMessageRef, messageRef } from "@/lib/converters/message";
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { useSubscriptionStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { useState } from "react";

type Props = {
  chatId: string;
};

const formSchema = z.object({
  input: z.string().max(1000),
});

const ChatInput = ({ chatId }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const inputCopy = values.input;
    form.reset();

    if (!session?.user) return;
    if (inputCopy.length === 0) return;

    const messages = (
      await getDocs(limitedMessageRef(chatId, session.user.id))
    ).docs.map((doc) => doc.data()).length;

    const isPro =
      subscription?.role === "pro" && subscription.status === "active";

    if (messages === 17) {
      toast({
        title: "You have 3 messages left!",
        description:
          "You have 3 messages left for the FREE plan. Please upgrade to pro for unlimted chatting.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Upgrade to Pro"
            onClick={() => router.push("/register")}
          >
            Upgrade to Pro
          </ToastAction>
        ),
      });
    }

    if (!isPro && messages >= 20) {
      toast({
        title: "Free plan limit reached!",
        description:
          "You have reached the limit of 20 messages for the FREE plan. Please upgrade to pro for unlimted chatting.",
        variant: "destructive",
        action: (
          <ToastAction
            altText="Upgrade to Pro"
            onClick={() => router.push("/register")}
          >
            Upgrade to Pro
          </ToastAction>
        ),
      });
      return;
    }

    const userToStore: User = {
      id: session.user.id!,
      name: session.user.name!,
      email: session.user.email!,
      image: session.user.image || "",
    };

    await addDoc(messageRef(chatId), {
      input: inputCopy,
      timestamp: serverTimestamp(),
      user: userToStore,
    });
  };

  return (
    <div className="sticky bottom-0">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex space-x-2 p-2 rounded-t-xl max-w-4xl mx-auto bg-white
         border dark:bg-slate-800"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-none bg-transparent dark:placeholder:text-white/70"
                    placeholder="Enter message in ANY language..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-violet-600 text-white hover:text-black"
          >
            Send
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;
