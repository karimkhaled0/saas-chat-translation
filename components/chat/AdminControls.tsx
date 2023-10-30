import DeleteChatButton from "./DeleteChatButton";
import InviteUser from "./InviteUser";

type Props = {
  chatId: string;
};

const AdminControls = ({ chatId }: Props) => {
  return (
    <div className="flex justify-end space-x-2 m-5 mb-0">
      <InviteUser chatId={chatId} />
      <DeleteChatButton chatId={chatId} />
    </div>
  );
};

export default AdminControls;
