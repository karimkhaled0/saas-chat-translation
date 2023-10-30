import { adminDb } from "@/firebase-admin";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  const { chatId, id } = await req.json();

  //   check if the one deleting is the admin of the chat
  const userRef = adminDb
    .collection("chats")
    .doc(chatId)
    .collection("members")
    .doc(id);

  const getUser = await userRef.get();
  const user = getUser.data();

  if (!user || !user.isAdmin) {
    return NextResponse.json(
      {
        message: "You are not authorized to delete this chat.",
      },
      { status: 401 }
    );
  }

  const ref = adminDb.collection("chats").doc(chatId);

  const bulkWriter = adminDb.bulkWriter();
  const MAX_RETRY_ATTEMPTS = 5;

  bulkWriter.onWriteError((error) => {
    if (error.failedAttempts < MAX_RETRY_ATTEMPTS) {
      return true;
    } else {
      console.log("Failed write to document: ", error.documentRef.path);
      return false;
    }
  });

  try {
    await adminDb.recursiveDelete(ref, bulkWriter);
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Promise rejected: ", error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}
