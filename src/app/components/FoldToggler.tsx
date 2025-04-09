import { SetStateAction } from "react";
import { Todo } from "./PlannerContainer";

interface props {
  date: string;
  openedDates: string[];
  todosForDate: Todo[];
  setOpenedDates: (value: SetStateAction<string[]>) => void;
}
const FoldToggler = ({
  date,
  openedDates,
  todosForDate,
  setOpenedDates,
}: props) => {
  const foldToggler = (date: string) => {
    setOpenedDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date)
        : [...prevDates, date]
    );
  };
  return (
    <div
      onClick={() => foldToggler(date)}
      className={`flex cursor-pointer justify-between transition-all delay-200 items-center w-full px-4 py-2 text-left rounded-lg ${
        openedDates.includes(date) && "rounded-b-none outline-none"
      }`}
    >
      <div
        className={`flex gap-2 ${
          todosForDate.every((todo) => todo.completed) && "line-through"
        }`}
      >
        <h3 className="text-md font-semibold">{date}</h3>{" "}
        <p>({todosForDate.length})</p>
      </div>
      <svg
        className={`w-5 h-5 transition-transform duration-300 ${
          openedDates.includes(date) ? "-rotate-90" : "rotate-90"
        }`}
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M17.707 9.293l-5-5a.999.999 0 10-1.414 1.414L14.586 9H3a1 1 0 100 2h11.586l-3.293 3.293a.999.999 0 101.414 1.414l5-5a.999.999 0 000-1.414z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
};

export default FoldToggler;
