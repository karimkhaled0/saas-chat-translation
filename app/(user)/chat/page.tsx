import ChatList from "@/components/chat/ChatList";

type Props = {
  params: {};
  searchParams: {
    error: string;
  };
};

const ChatsPage = ({ searchParams: { error } }: Props) => {
  return (
    <div>
      {/* Chat Permessions */}

      {/* ChatList */}
      <ChatList />
    </div>
  );
};

export default ChatsPage;
