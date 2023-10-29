import LoadingSpinner from "@/components/header/LoadingSpinner";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex items-center p-10 justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
