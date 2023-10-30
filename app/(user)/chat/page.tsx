import ChatList from "@/components/chat/ChatList";
import ChatPermessionError from "@/components/chat/ChatPermessionError";

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
      {error === "permission" && (
        <div className="m-2">
          <ChatPermessionError />
        </div>
      )}

      {/* ChatList */}
      <ChatList />
    </div>
  );
};

export default ChatsPage;
