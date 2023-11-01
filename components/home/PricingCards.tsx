import { CheckIcon } from "lucide-react";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

type Props = {
  redirect: boolean;
};

const tiers = [
  {
    name: "Starter",
    id: null,
    href: "#",
    isMostPop: false,
    priceMonthly: null,
    description: "Get chatting right away with Anyone, Any Document!",
    features: [
      "20 Message Chat Limit in Chats",
      "2 Participants Limit per Chat",
      "3 Chat Room Limit",
      "Support 2 Languages",
      "4MB File Size Limit",
      "5 pages per PDF",
    ],
  },
  {
    name: "Pro",
    id: "pro",
    isMostPop: true,
    href: "#",
    priceMonthly: "14.99",
    description: "Unlock the Full Potential with Pro, and chat with anyone!",
    features: [
      "Unlimted Messages in Chats",
      "Unlimted Participants in Chat",
      "Unlimted Chat Room",
      "Support up to 10 Languages",
      "25 pages per PDF",
      "16MB file size limit",
      "Multimedia Support in Chat (coming soon)",
      "1-hour dedicated support response time",
      "Early Access to new features",
    ],
  },
];

const PricingCards = ({ redirect }: Props) => {
  return (
    <section className="relative dark:bg-gray-900">
      <div
        className="absolute opacity-30 top-32 inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
        style={{
          background:
            "linear-gradient(106.89deg, rgba(107, 50, 131, 0.3) 15.73%, rgba(6, 82, 118, 0.6) 15.74%, rgba(176, 66, 148, 0.4) 56.49%, rgba(44, 41, 128, 0.6) 115.91%)",
        }}
      ></div>
      <div className="relative py-14 max-w-screen-xl mx-auto text-gray-300 sm:px-4 md:px-8">
        <div className="max-w-xl mx-auto space-y-3 px-4 sm:text-center sm:px-0">
          <h3 className="dark:text-cyan-400 text-cyan-800 font-semibold">
            Pricing
          </h3>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            The right price for you
            <span className="hidden sm:inline">, whoever you are</span>
          </p>
          <div className="max-w-xl dark:text-gray-100 text-gray-600">
            <p>We{"'"}re 99% sure we have a plan to match 100% of your needs</p>
          </div>
        </div>
        <div className="mt-16 justify-center sm:flex">
          {tiers.map((item, idx) => (
            <div
              key={idx}
              className={`relative flex-1 flex items-stretch flex-col mt-6 border-2 sm:mt-0 sm:rounded-xl sm:max-w-md ${
                item.isMostPop
                  ? "dark:bg-gray-900 bg-gray-100 border-cyan-400 border-0 sm:border-2"
                  : "border-transparent"
              }`}
            >
              <div className="p-4 py-8 space-y-4 border-b border-gray-700 md:p-8">
                <span className="dark:text-gray-200 text-gray-600 font-medium">
                  {item.name}
                </span>
                {item.priceMonthly ? (
                  <div className="text-cyan-400 text-3xl font-semibold">
                    ${item.priceMonthly}{" "}
                    <span className="text-xl font-normal">/mo</span>
                  </div>
                ) : (
                  <div className="text-cyan-400 text-3xl font-semibold">
                    Free
                  </div>
                )}
                <p className="dark:text-gray-400 text-gray-700">
                  {item.description}
                </p>
                {redirect ? (
                  <Link
                    href={"/register"}
                    className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold
                    leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80
                    "
                  >
                    Get Started Today
                  </Link>
                ) : (
                  item.id && <CheckoutButton />
                )}
              </div>
              <ul className="p-4 py-8 space-y-3 md:p-8">
                {item.features.map((featureItem, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-5 dark:text-white text-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        item.isMostPop ? "text-cyan-600" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    {featureItem}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingCards;
