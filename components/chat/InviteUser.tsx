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
import { subscriptionRef } from "@/lib/converters/subscription";

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

    // number of users in chat
    const noOfUsersInChat = (await getDocs(chatMembersRef(chatId))).docs.map(
      (doc) => doc.data()
    ).length;

    // check if user is pro
    const isPro =
      subscription?.role === "pro" && subscription.status === "active";

    // get user by email
    const querySnapshot = await getDocs(getUserByEmailRef(values.email));

    // check if user exists in db
    if (querySnapshot.empty) {
      toast({
        title: "User not found!",
        description:
          "The user you are trying to add is not registered. Please ask them to register first.",
        variant: "destructive",
      });

      return;
    }

    // check if user exists in chat
    const userInChat = (await getDocs(chatMembersRef(chatId))).docs
      .map((doc) => doc.data())
      .some((user) => user.email === values.email);

    // check if user exceeds 2 members in chat
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

    // check if user is trying to add themselves
    if (querySnapshot.docs[0].data().id === session?.user.id) {
      toast({
        title: "You can't add yourself!",
        description: "You can't add yourself to the chat.",
        variant: "destructive",
      });

      return;
    }

    // check if user is in chat
    if (userInChat) {
      toast({
        title: "User already in chat!",
        description: "The user you are trying to add is already in the chat.",
        variant: "destructive",
      });

      return;
    }

    // add user to chat
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
