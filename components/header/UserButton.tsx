"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";
import { Button } from "../ui/button";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useSubscriptionStore } from "@/store/store";
import LoadingSpinner from "./LoadingSpinner";
import { StarIcon } from "lucide-react";
import ManageAccountButton from "../home/ManageAccountButton";

type Props = {
  session: Session | null;
};

const UserButton = ({ session }: Props) => {
  // subscription listener ...
  const subscription = useSubscriptionStore((state) => state.subscription);

  if (!session)
    return (
      <Button variant={"outline"} onClick={() => signIn()}>
        Sign In
      </Button>
    );

  return (
    session && (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar name={session.user?.name} image={session.user?.image!} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="w-fit">
            {session.user?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* loading spinner for subscriotion */}
          {subscription === undefined && (
            <DropdownMenuItem className="flex items-center justify-center">
              <LoadingSpinner />
            </DropdownMenuItem>
          )}

          {/* Pro start */}
          {subscription?.role === "pro" && (
            <>
              <DropdownMenuLabel
                className="flex items-center justify-center text-xs space-x-1 
              text-[#E935C1] animate-pulse
              "
              >
                <StarIcon fill="#E935C1" />
                <p className="text-lg">PRO</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <ManageAccountButton />
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default UserButton;
