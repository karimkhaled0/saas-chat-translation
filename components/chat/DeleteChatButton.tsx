"use client";

import { useState } from "react";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useAdminId from "@/hooks/useAdminId";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  chatId: string;
};

const DeleteChatButton = ({ chatId }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const adminId = useAdminId({ chatId });
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    toast({
      title: "Deleting chat...",
      description: "Please wait while we delete the chat.",
      duration: 3000,
    });

    console.log("Deleting chat...", chatId);

    await fetch(`/api/chat/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId: chatId, id: session?.user.id }),
    })
      .then(() => {
        toast({
          title: "Chat deleted",
          description: "Chat deleted successfully.",
          className: "bg-green-500 text-white",
          duration: 3000,
        });
        router.replace("/chat");
      })
      .catch((error) => {
        console.log(error.message);
        toast({
          title: "Chat delete failed",
          description: "Chat delete failed.",
          className: "bg-red-500 text-white",
          duration: 3000,
        });
      })
      .finally(() => setOpen(false));
  };

  return (
    session?.user.id === adminId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"destructive"}>Delete Chat</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure ?</DialogTitle>
            <DialogDescription>
              This will delete the chat for all members.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 space-x-2">
            <Button variant={"destructive"} onClick={handleDelete}>
              Delete
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

export default DeleteChatButton;
