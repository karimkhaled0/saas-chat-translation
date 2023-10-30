import { authOptions } from "@/auth";
import AdminControls from "@/components/chat/AdminControls";
import ChatInput from "@/components/chat/ChatInput";
import ChatMemberBadge from "@/components/chat/ChatMemberBadge";
import ChatMessages from "@/components/chat/ChatMessages";
import { chatMembersRef } from "@/lib/converters/chatMembers";
import { sortedMessageRef } from "@/lib/converters/message";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await getServerSession(authOptions);
  const initialMessages = (await getDocs(sortedMessageRef(chatId))).docs.map(
    (doc) => doc.data()
  );

  const isMember = (await getDocs(chatMembersRef(chatId))).docs
    .map((doc) => doc.id)
    .includes(session?.user.id!);

  if (!isMember) {
    redirect("/chat?error=permission");
  }

  return (
    <>
      {/* AdminControls */}
      <AdminControls chatId={chatId} />
      {/* ChatMemberBadge */}
      <ChatMemberBadge chatId={chatId} />
      {/* ChatMessages */}
      <div className="flex-1">
        <ChatMessages
          chatId={chatId}
          session={session}
          initialMessages={initialMessages}
        />
      </div>

      {/* ChatInput */}
      <ChatInput chatId={chatId} />
    </>
  );
};

export default ChatPage;
