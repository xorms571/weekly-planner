import { ReactNode } from "react";

type props = {
  type?: "submit" | "button";
  onClick?: () => void;
  title: ReactNode;
  className?: string;
  classType?: "btn1" | "btn2";
};
const Button = ({ onClick, type, title, className = "", classType }: props) => {
  const baseClass =
    classType === "btn1"
      ? "border bg-white px-2 py-1 rounded-lg w-20 text-center text-xs"
      : "";
  return (
    <button
      className={className + " " + baseClass}
      onClick={onClick}
      type={type}
    >
      {title}
    </button>
  );
};

export default Button;
