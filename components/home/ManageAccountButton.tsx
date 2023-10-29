import { generatePortalLink } from "@/actions/generatePortalLink";

type Props = {};

const ManageAccountButton = (props: Props) => {
  return (
    <form action={generatePortalLink}>
      <button className="w-full" type="submit">
        Manage Billing
      </button>
    </form>
  );
};

export default ManageAccountButton;
