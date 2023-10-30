"use client";

import { MessageSquarePlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useSubscriptionStore } from "@/store/store";
import { useToast } from "../ui/use-toast";
import LoadingSpinner from "../header/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import { getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import {
  addChatRef,
  chatMembersCollectionGroupRef,
} from "@/lib/converters/chatMembers";
import { ToastAction } from "../ui/toast";

type Props = {
  isLarge?: boolean;
};

const CreateChatButton = ({ isLarge }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);

  const createNewChat = async () => {
    if (!session?.user.id) return;

    setLoading(true);
    toast({
      title: "Creating new chat...",
      description: "Please wait while we create your new chat.",
      duration: 3000,
    });

    // check if user is about to exceed the free plan limit of 3 chats
    const chatLimit = (
      await getDocs(chatMembersCollectionGroupRef(session.user.id))
    ).docs.map((doc) => doc.data()).length;

    const isPro =
      subscription?.role === "pro" && subscription.status === "active";

    if (!isPro && chatLimit >= 3) {
      toast({
        title: "Free plan limit reached!",
        description:
          "You have reached the limit of 3 chats for the FREE plan. Please upgrade to pro for unlimted chatting.",
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

    const chatId = uuidv4();

    await setDoc(addChatRef(chatId, session.user.id), {
      userId: session.user.id!,
      email: session.user.email!,
      timestamp: serverTimestamp(),
      isAdmin: true,
      chatId: chatId,
      image: session.user.image || "",
    })
      .then(() => {
        toast({
          title: "Chat created!",
          description: "Your chat has been created.",
          className: "bg-green-500 text-white",
          duration: 2000,
        });
        router.push(`/chat/${chatId}`);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Chat creation failed!",
          description: "There was an error creating your chat.",
          className: "bg-red-500 text-white",
          duration: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isLarge) {
    return (
      <Button onClick={createNewChat} variant={"default"}>
        {loading ? <LoadingSpinner /> : "Create a new Chat"}
      </Button>
    );
  }

  return (
    <Button onClick={createNewChat} variant={"secondary"}>
      <MessageSquarePlusIcon />
    </Button>
  );
};

export default CreateChatButton;
