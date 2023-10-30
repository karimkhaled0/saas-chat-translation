import { db } from "@/firebase";
import { LanguageSupported } from "@/store/store";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface Message {
  id?: string;
  input: string;
  timestamp: Date;
  user: User;
  translated?: {
    [K in LanguageSupported]?: string;
  };
}

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message: Message): DocumentData => {
    return {
      input: message.input,
      timestamp: message.timestamp,
      user: message.user,
      // other fields
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Message => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      input: data.input,
      timestamp: data.timestamp?.toDate(),
      user: data.user,
      translated: data.translated,
      // other fields
    };
  },
};

export const messageRef = (chatId: string) =>
  collection(db, "chats", chatId, "messages").withConverter(messageConverter);

export const limitedMessageRef = (chatId: string, id: string) =>
  query(messageRef(chatId), where("user.id", "==", id), limit(25));

export const sortedMessageRef = (chatId: string) =>
  query(messageRef(chatId), orderBy("timestamp", "asc"));

export const limitedSortedMessagesRef = (chatId: string) =>
  query(query(messageRef(chatId), limit(1)), orderBy("timestamp", "desc"));
