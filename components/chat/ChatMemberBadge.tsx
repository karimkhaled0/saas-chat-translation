"use client";

import useAdminId from "@/hooks/useAdminId";
import { ChatMembers, chatMembersRef } from "@/lib/converters/chatMembers";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "../header/LoadingSpinner";

import ChatUserBadge from "./ChatUserBadge";

type Props = {
  chatId: string;
};

const ChatMemberBadge = ({ chatId }: Props) => {
  const [members, loading, error] = useCollectionData<ChatMembers>(
    chatMembersRef(chatId)
  );

  const adminId = useAdminId({ chatId });

  if (loading && !members) return <LoadingSpinner />;

  return (
    !loading && (
      <div className="p-2 border rounded-xl m-5">
        <div
          className="flex flex-wrap justify-center md:justify-start 
            items-center gap-2 p-2"
        >
          {members?.map((member) => (
            <ChatUserBadge
              key={member.userId}
              member={member}
              adminId={adminId}
            />
          ))}
        </div>
      </div>
    )
  );
};

export default ChatMemberBadge;
