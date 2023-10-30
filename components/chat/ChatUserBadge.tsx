import { MoreHorizontal, Trash } from "lucide-react";
import UserAvatar from "../header/UserAvatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dispatch, SetStateAction } from "react";

type Props = {
  key: string;
  member: {
    email: string;
    image: string;
    userId: string;
  };
  adminId: string;
};

const ChatUserBadge = ({ member, adminId }: Props) => {
  return (
    <Badge
      key={member.email}
      variant={"secondary"}
      className="h-14 p-5 pl-2 pr-5 flex space-x-2"
    >
      <div className="flex items-center space-x-2">
        <UserAvatar name={member.email} image={member.image} />
      </div>

      <div>
        <p>{member.email}</p>
        {member.userId === adminId && (
          <p className="text-indigo-400 animate-pulse">Admin</p>
        )}
      </div>
    </Badge>
  );
};

export default ChatUserBadge;
