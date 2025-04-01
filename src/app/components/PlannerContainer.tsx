"use client";
import { useState, useRef } from "react";
import Button from "./Button";
import FoldToggler from "./FoldToggler";
import TodoListForDate from "./TodoListForDate";
import PlannerModals from "./PlannerModals";
import UserInformation from "./UserInformation";
export type Todo = {
  _id: string;
  text: string;
  completed: boolean;
  date: string;
};
export const weeks = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
type GroupedTodos = Record<string, Todo[]>;
const PlannerContainer = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTodoEditerOpen, setIsTodoEditerOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [openedDates, setOpenedDates] = useState<string[]>([]);
  const todoListRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getDayFromDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return weeks[dayIndex];
  };

  const groupTodosByDate = (todos: Todo[]): GroupedTodos => {
    return todos.reduce((acc: GroupedTodos, todo: Todo) => {
      const date = todo.date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(todo);
      return acc;
    }, {});
  };

  return (
    <>
      <PlannerModals
        isDatePickerOpen={isDatePickerOpen}
        isTodoEditerOpen={isTodoEditerOpen}
        selectedTodo={selectedTodo}
        setIsDatePickerOpen={setIsDatePickerOpen}
        setIsTodoEditerOpen={setIsTodoEditerOpen}
        setTodos={setTodos}
      />
      <div className="flex justify-between text-xs md:justify-center items-center py-5 px-5 md:px-0 gap-5 md:gap-[30%] bg-white bg-opacity-15">
        <UserInformation />
        <Button
          className="text-black w-fit h-fit text-base bg-white rounded-lg px-6 py-1"
          title="Add a Schedule"
          onClick={() => setIsDatePickerOpen(true)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 m-auto my-10 w-5/6 lg:w-4/6 gap-5">
        {weeks.map((week) => {
          const filteredTodos = todos.filter(
            (todo) => getDayFromDate(todo.date) === week
          );
          const groupedTodos = groupTodosByDate(filteredTodos);
          return (
            <div
              className={`min-w-20 bg-white min-h-20 p-4 rounded-3xl text-gray-600 ${
                Object.entries(groupedTodos).length === 0 &&
                "bg-opacity-15 text-white"
              }`}
              key={week}
            >
              <h2 className="text-xl font-bold">{week}</h2>
              <ul className="scrollbar flex flex-col gap-4 mt-4 overflow-y-auto max-h-[370px] min-h-[370px]">
                {Object.entries(groupedTodos).length === 0 ? (
                  <div className="w-full h-[370px] flex justify-center items-center">
                    <p>There's no plan</p>
                  </div>
                ) : (
                  Object.entries(groupedTodos).map(([date, todosForDate]) => (
                    <div
                      className={`flex flex-col border-2 rounded-xl ${
                        (openedDates.includes(date) &&
                          "border-slate-500 border-2",
                        todosForDate.every((todo) => todo.completed)
                          ? "bg-slate-200"
                          : "bg-white")
                      }`}
                      key={date}
                    >
                      <FoldToggler
                        date={date}
                        todosForDate={todosForDate}
                        openedDates={openedDates}
                        setOpenedDates={setOpenedDates}
                      />
                      <TodoListForDate
                        date={date}
                        todosForDate={todosForDate}
                        todos={todos}
                        openedDates={openedDates}
                        todoListRefs={todoListRefs}
                        setTodos={setTodos}
                        setSelectedTodo={setSelectedTodo}
                        setIsTodoEditerOpen={setIsTodoEditerOpen}
                      />
                    </div>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PlannerContainer;
