import LogoImage from "@logos/helloWorld.svg";
import Link from "next/link";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";

type Props = {};

const Logo = (props: Props) => {
  return (
    <Link href={"/"} prefetch={false} className="overflow-hidden">
      <div className="flex items-center w-72 h-14">
        <AspectRatio
          ratio={16 / 9}
          className="flex items-center justify-center"
        >
          <Image
            src={LogoImage}
            alt="Hello World Logo"
            priority
            className="dark:filter dark:invert"
          />
        </AspectRatio>
      </div>
    </Link>
  );
};

export default Logo;
