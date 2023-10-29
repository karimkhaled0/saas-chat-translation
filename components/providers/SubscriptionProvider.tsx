"use client";

import { subscriptionRef } from "@/lib/converters/subscription";
import { useSubscriptionStore } from "@/store/store";
import { onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const SubscriptionProvider = ({ children }: Props) => {
  const { data: session } = useSession();
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );
  useEffect(() => {
    if (!session) return;

    return onSnapshot(
      subscriptionRef(session.user.id),
      (snapshot) => {
        if (snapshot.empty) {
          console.log("No subscription found");
          // set NO subscription
          setSubscription(null);
          return;
        } else {
          // set subscription
          setSubscription(snapshot.docs[0].data());
        }
      },
      (error) => console.log("error getting subscription", error)
    );
  }, [session, setSubscription]);

  return <>{children}</>;
};

export default SubscriptionProvider;
