import { BookOpenIcon, MessageCircleIcon, ShieldCheckIcon } from "lucide-react";

type Props = {};

const Features = (props: Props) => {
  const features = [
    {
      icon: <MessageCircleIcon />,
      title: "Chat with anyone",
      desc: "You can chat with anyone in any Language.",
    },
    {
      icon: <BookOpenIcon />,
      title: "Chat with any document",
      desc: "You can chat with any document in any Language.",
    },
    {
      icon: <ShieldCheckIcon />,
      title: "Fast and Secure",
      desc: "Fast and secure chat with end-to-end encryption.",
    },
  ];

  return (
    <section className="relative py-28">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 text-gray-300 justify-between gap-24 lg:flex md:px-8">
        <div className="max-w-xl text-center">
          <h3 className="dark:text-white text-black text-3xl font-semibold sm:text-4xl">
            Do more with less complexity
          </h3>
          <p className="mt-3 text-transparent bg-clip-text bg-gray-500 dark:bg-gradient-to-r dark:from-[#4F46E5] dark:to-[#E114E5]">
            With our AI-driven chat functionality, you can engage in
            conversations with anyone and any document in any language.
          </p>
        </div>
        <div className="mt-12 lg:mt-0">
          <ul className="grid gap-8 sm:grid-cols-2">
            {features.map((item, idx) => (
              <li key={idx} className="flex gap-x-4">
                <div className="flex-none w-12 h-12 dark:bg-gray-700 bg-gray-200 dark:text-cyan-400 text-cyan-700 rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg dark:text-gray-100 text-gray-700 font-semibold">
                    {item.title}
                  </h4>
                  <p className="mt-3 text-gray-600 dark:text-white">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className="absolute inset-0 max-w-md mx-auto h-72 blur-[118px]"
        style={{
          background:
            "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
        }}
      ></div>
    </section>
  );
};

export default Features;
