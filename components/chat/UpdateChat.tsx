"use client";
import { useState } from "react";
import { Trash, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import useAdminId from "@/hooks/useAdminId";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  ChatMembers,
  chatMembersCollectionGroupRef,
  chatMembersRef,
} from "@/lib/converters/chatMembers";
import { deleteDoc, doc, getDocs } from "firebase/firestore";

type Props = {
  chatId: string;
};

const UpdateChat = ({ chatId }: Props) => {
  const { data: session } = useSession();
  const adminId = useAdminId({ chatId });
  const [open, setOpen] = useState(false);
  const [members, loading, error] = useCollectionData<ChatMembers>(
    chatMembersRef(chatId)
  );

  const handleDelete = async (userId: string) => {
    const membersRef = (await getDocs(chatMembersRef(chatId))).docs;

    const numberOfMembers = membersRef.length;
    if (numberOfMembers === 1) {
      console.log("cannot delete last member");
      return;
    }

    const memberRef = membersRef.find(
      (member) => member.data().userId === userId
    );

    deleteDoc(memberRef?.ref!);
  };

  return (
    session?.user.id === adminId && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"default"} className="bg-green-700 text-white">
            Update Chat
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Members</DialogTitle>
            <DialogDescription>
              {members?.map((member) => {
                return member.userId !== adminId ? (
                  <div
                    key={member.userId}
                    className="flex items-center space-x-2 space-y-3 mt-5"
                  >
                    <div className="flex-1 flex items-center space-x-2">
                      <User />
                      <p>{member.email}</p>
                    </div>
                    <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(member.userId)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    key={member.userId}
                    className="flex items-center space-x-2 space-y-3 mt-5"
                  >
                    <div className="flex-1 flex items-center space-x-2">
                      <User />
                      <p>{member.email}</p>
                    </div>
                    <p className="text-indigo-400 animate-pulse">Admin</p>
                  </div>
                );
              })}
            </DialogDescription>
          </DialogHeader>

          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    )
  );
};

export default UpdateChat;
