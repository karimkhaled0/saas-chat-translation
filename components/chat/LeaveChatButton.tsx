"use client";
import useAdminId from "@/hooks/useAdminId";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import { toast, useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { chatMembersRef } from "@/lib/converters/chatMembers";
import LoadingSpinner from "../header/LoadingSpinner";

type Props = {
  chatId: string;
};

const LeaveChatButton = ({ chatId }: Props) => {
  const { data: session } = useSession();
  const adminId = useAdminId({ chatId });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (adminId) {
      setLoading(false); // Set loading to false when adminId is available
    }
  }, [adminId]);

  if (loading) {
    return;
  }

  const handleLeaveChat = async () => {
    toast({
      title: "Leaving chat...",
      description: "Please wait while we leave the chat.",
      duration: 3000,
    });

    // return only the memberRef of the current user
    const memberRef = (await getDocs(chatMembersRef(chatId))).docs
      .map((doc) => {
        return {
          data: doc.data(),
          ref: doc.ref,
        };
      })
      .find((user) => user.data.userId === session?.user.id);

    deleteDoc(memberRef?.ref!)
      .then(() => {
        toast({
          title: "Left chat",
          description: "You have left the chat.",
          duration: 3000,
        });
        router.push("/chat");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message,
          duration: 3000,
        });
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    session?.user.id !== adminId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>Leave Chat</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure ?</DialogTitle>
            <DialogDescription>
              You will no longer be able to access this chat.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 space-x-2">
            <Button variant={"destructive"} onClick={handleLeaveChat}>
              Leave
            </Button>

            <Button variant={"outline"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};

export default LeaveChatButton;
