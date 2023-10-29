import { authOptions } from "@/auth";
import { chatMembersCollectionGroupRef } from "@/lib/converters/chatMembers";
import { getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth";
import ChatListRows from "./ChatListRows";

type Props = {};

const ChatList = async (props: Props) => {
  const session = await getServerSession(authOptions);

  // get chats
  const chatsSnapshot = await getDocs(
    chatMembersCollectionGroupRef(session?.user.id!)
  );

  const initialChats = chatsSnapshot.docs.map((doc) => ({
    ...doc.data(),
    timestamp: null,
  }));

  return <ChatListRows initialChats={initialChats} />;
};

export default ChatList;
