import Link from "next/link";

import Icons from "../icons";

const LogoButton = () => {
  return (
    <Link
      href="/"
      className="size-9 flex items-center justify-center mb-2 group"
    >
      <span className="transition-transform duration-200 ease-in-out group-hover:scale-110">
        <Icons.logo className="size-10" />
      </span>
    </Link>
  );
};

export default LogoButton;
