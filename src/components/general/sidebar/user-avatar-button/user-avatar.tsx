import { User } from "lucide-react";

type Props = {
  avatarUrl: string | undefined;
};

const UserAvatar = ({ avatarUrl }: Props) => {
  return (
    <>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt="User avatar"
          className="object-cover rounded-full"
          width={36}
          height={36}
        />
      ) : (
        <User className="size-5 text-muted-foreground" />
      )}
    </>
  );
};

export default UserAvatar;
