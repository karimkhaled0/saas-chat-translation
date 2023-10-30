import DeleteChatButton from "./DeleteChatButton";
import InviteUser from "./InviteUser";
import UpdateChat from "./UpdateChat";

type Props = {
  chatId: string;
};

const AdminControls = ({ chatId }: Props) => {
  return (
    <div className="sm:flex sm:justify-end sm:space-x-2 m-5 mb-0 grid grid-cols-2 gap-4">
      <InviteUser chatId={chatId} />
      <UpdateChat chatId={chatId} />
      <DeleteChatButton chatId={chatId} />
    </div>
  );
};

export default AdminControls;
