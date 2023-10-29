import { authOptions } from "@/auth";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { sortedMessageRef } from "@/lib/converters/message";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";

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

  return (
    <>
      {/* Admin Control */}

      {/* ChatMemberBadge */}

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
