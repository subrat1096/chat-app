import Image from "next/image";
import React from "react";

const Avatar = ({ size, user, onClick }) => {
  const s =
    size === "small"
      ? 32
      : size === "medium"
      ? 36
      : size === "large"
      ? 48
      : size === "x-large"
      ? 64
      : size === "xx-large"
      ? 96
      : 32;
  const c =
    size === "samll"
      ? "w-8 h-8"
      : size === "medium"
      ? "w-10 h-10"
      : size === "large"
      ? "w-12 h-12"
      : size === "x-large"
      ? "w-16 h-16"
      : size === "xx-large"
      ? "w-24 h-24"
      : "w-8 h-8";

  const f =
    size === "large"
      ? "text-2xl"
      : size === "x-large"
      ? "text-4xl"
      : size == "xx-large"
      ? "text-6xl"
      : "text-base";
  return (
    <div
      className={`${c} flex items-center justify-center text-base rounded-full flex-shrink-0 relative`}
      style={{ backgroundColor: user?.color }}
      onClick={onClick}
    >
      {user?.photoURL ? (
        <div className={`${c} overflow-hidden rounded-full`}>
          <Image src={user?.photoURL} alt="avatar" />
        </div>
      ) : (
        <div className={`${f} flex font-semibold`}>
          {user?.displayName?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
