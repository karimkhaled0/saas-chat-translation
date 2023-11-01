import { getServerSession } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";
import Logo from "./Logo";
import UserButton from "./UserButton";
import { authOptions } from "@/auth";
import Link from "next/link";
import { FilesIcon, MessagesSquareIcon } from "lucide-react";
import CreateChatButton from "../chat/CreateChatButton";
import UpgradeBanner from "./UpgradeBanner";
import LanguageSelect from "./LanguageSelect";
import FileUploadButton from "./FileUploadButton";

type Props = {};

const Header = async (props: Props) => {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav
        className="flex flex-col sm:flex-row items-center 
      p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto space-y-5 sm:space-y-0"
      >
        <Logo />

        <div className="flex-1 flex items-center justify-end space-x-4">
          {session && (
            <>
              <Link href={"/documents"} prefetch={false}>
                <FilesIcon />
              </Link>
              <Link href={"/chat"} prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-white" />
              </Link>
            </>
          )}
          {/* DarkModeToggle */}
          <DarkModeToggle />

          {/* UserButton */}
          <UserButton session={session} />
        </div>
      </nav>
      {/* upgrade banner */}
      <UpgradeBanner />

      <div className="flex items-center justify-center space-x-5">
        {/* Language selecter */}
        <LanguageSelect page="chat" />
        <CreateChatButton />
      </div>
    </header>
  );
};

export default Header;
