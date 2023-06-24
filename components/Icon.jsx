import React from "react";

const Icon = ({ size, icon, onClick, className }) => {
  const c =
    size === "small"
      ? "w-8 h-8"
      : size === "medium"
      ? "w-10 h-10"
      : size === "large"
      ? "w-12 h-12"
      : size === "x-large"
      ? "w-16 h-16"
      : size === "xx-large"
      ? "w-24 h-24"
      : "w-12 h-12";
  return (
    <div
      className={`${c}flex rounded-full hover:bg-c1 cursor-pointer flex-shrink-0 relative ${className}`}
      onClick={onClick}
    >
      <div
        className={`${c} flex overflow-hidden items-center justify-center rounded-full`}
      >
        {icon && icon}
      </div>
    </div>
  );
};

export default Icon;
