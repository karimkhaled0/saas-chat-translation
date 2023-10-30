"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import {
  addChatRef,
  chatMembersCollectionGroupRef,
  chatMembersRef,
} from "@/lib/converters/chatMembers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getUserByEmailRef } from "@/lib/converters/user";
import { useToast } from "@/components/ui/use-toast";
import useAdminId from "@/hooks/useAdminId";
import { PlusCircleIcon } from "lucide-react";
import ShareLink from "./ShareLink";
import { useSubscriptionStore } from "@/store/store";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";

type Props = {
  chatId: string;
};

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const InviteUser = ({ chatId }: Props) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const adminId = useAdminId({ chatId });
  const subscription = useSubscriptionStore((state) => state.subscription);

  const [open, setOpen] = useState(false);
  const [openInviteLink, setOpenInviteLink] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onsubmit = async (values: z.infer<typeof formSchema>) => {
    if (!session?.user.id) return;

    toast({
      title: "Sending invite...",
      description: "Please wait while we send the invite to the user.",
    });

    // check if user is about to exceed the free plan limit
    const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    const isPro =
      subscription?.role === "pro" && subscription.status === "active";

    if (!isPro && noOfUsersInChat >= 2) {
      toast({
        title: "Free plan limit reached!",
        description:
          "You have reached the limit of 2 users for the FREE plan. Please upgrade to pro for unlimted chatting.",
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

    const querySnapshot = await getDocs(getUserByEmailRef(values.email));

    // check if invited user exceeds the free plan limit
    const chatLimit = (
      await getDocs(
        chatMembersCollectionGroupRef(querySnapshot.docs[0].data().id)
      )
    ).docs.map((doc) => doc.data()).length;

    if (chatLimit >= 3) {
      toast({
        title: "Free plan limit reached!",
        description:
          "This user has reached the limit of 3 chats for the FREE plan. Please ask them to upgrade to pro for unlimted chatting.",
        variant: "destructive",
      });
      return;
    }

    // check if user exists in this chat
    const userInChat = (await getDocs(chatMembersRef(chatId))).docs
      .map((doc) => doc.data())
      .some((user) => user.email === values.email);

    if (querySnapshot.empty) {
      toast({
        title: "User not found!",
        description:
          "The user you are trying to add is not registered. Please ask them to register first.",
        variant: "destructive",
      });

      return;
    }
    // check if user is in chat
    else if (userInChat) {
      toast({
        title: "User already in chat!",
        description: "The user you are trying to add is already in the chat.",
        variant: "destructive",
      });

      return;
    } else {
      const user = querySnapshot.docs[0].data();

      await setDoc(addChatRef(chatId, user.id), {
        userId: user.id!,
        email: user.email!,
        image: user.image || "",
        timestamp: serverTimestamp(),
        chatId: chatId,
        isAdmin: false,
      }).then(() => {
        setOpen(false);

        toast({
          title: "Added to chat!",
          description: "The user has been added to the chat.",
          className: "bg-green-500 text-white",
          duration: 3000,
        });

        setOpenInviteLink(true);
      });
    }

    form.reset();
  };

  return (
    adminId === session?.user?.id && (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircleIcon className="mr-1" />
              Add User to Chat
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add User to Chat</DialogTitle>
              <DialogDescription>
                Enter the email address of the user you want to add to this
                chat!{" "}
                <span className="text-indigo-600 font-bold">
                  ( Note: They must be registered )
                </span>
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                className="flex flex-col space-y-2"
                onSubmit={form.handleSubmit(onsubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="jhon@doe.comd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="ml-auto sm:w-fit w-full">Add to Chat</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <ShareLink
          isOpen={openInviteLink}
          setIsOpen={setOpenInviteLink}
          chatId={chatId}
        />
      </>
    )
  );
};

export default InviteUser;
