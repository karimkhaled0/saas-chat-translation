"use client";

import { Copy } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

type Props = {
  chatId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ShareLink = ({ chatId, isOpen, setIsOpen }: Props) => {
  const { toast } = useToast();
  const host = window.location.host;
  const linkToChat =
    process.env.NODE_ENV === "development"
      ? `http://${host}/chat/${chatId}`
      : `https://${host}/chat/${chatId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkToChat);
      console.log("Copied to clipboard");

      toast({
        title: "Copied to clipboard",
        description:
          "Share this link with your friends! ( Note: They must be added to the chat first! )",
        className: "bg-green-500 text-white",
        duration: 2000,
      });
    } catch (error) {
      console.log("Failed to copy: ", error);
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
      defaultOpen={isOpen}
    >
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Copy className="mr-2" />
          Share Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>
            Any user who has been{" "}
            <span className="text-indigo-600 font-bold">
              granted access to this chat
            </span>{" "}
            can use this link
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={linkToChat} readOnly />
          </div>
          <Button
            type="submit"
            onClick={() => copyToClipboard()}
            size={"sm"}
            className="px-3"
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant={"secondary"}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLink;
