import { authOptions } from "@/auth";
import PricingCards from "@/components/home/PricingCards";
import { getServerSession } from "next-auth";

type Props = {};

const Register = async (props: Props) => {
  const session = await getServerSession(authOptions);
  return (
    <div className="isolate h-full overflow-hidden bg-gray-900 pb-40">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 text-white text-center lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Lets handle your membership {session?.user?.name?.split(" ")?.[0]}
          </p>
        </div>
        <div className="relative mt-6">
          <p className="mx-auto max-w-2xl text-lg leading-8 text-white/60">
            We{"'"}re 99% sure we have a plan to match 100% of your needs
          </p>
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 sm:-top-12 md:-top-20 lg:-top-12
                xl:top-0 [mask-image:radial-gradient(closest-side,white,transparent)]"
          >
            <ellipse
              cx={604}
              cy={512}
              rx={604}
              ry={512}
              fill="url(#radial-gradient-pricing)"
            />
            <defs>
              <radialGradient id="radial-gradient-pricing">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <PricingCards redirect={false} />
    </div>
  );
};

export default Register;