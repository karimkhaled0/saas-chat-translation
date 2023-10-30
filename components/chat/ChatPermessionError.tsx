import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import Link from "next/link";

type Props = {};

const ChatPermessionError = (props: Props) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex">
        <p className="flex-1">
          You don{"'"}t have permission to view this chat.
          <br />
          <span className="font-bold">
            Please ask the chat admin to add you to the chat.
          </span>
        </p>

        <Link href={"/chat"} replace>
          <Button variant={"destructive"}>Dismiss</Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
};

export default ChatPermessionError;
