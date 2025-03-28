import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import DatePickerModal from "./DatePickerModal";
import TodoEditerModal from "./TodoEditerModal";
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
  const [input, setInput] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTodoEditerOpen, setIsTodoEditerOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [openedDates, setOpenedDates] = useState<string[]>([]);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const todoListRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 날짜별 높이 계산
  useEffect(() => {
    const newHeights: Record<string, number> = {};
    Object.keys(todoListRefs.current).forEach((date) => {
      const element = todoListRefs.current[date];
      if (element) newHeights[date] = element.scrollHeight;
    });
    setHeights(newHeights);
  }, [todos]);

  // GET todos 데이터 가져오기
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  };

  // 해당 todo 추가 함수
  const addTodo = async (
    e: React.FormEvent<HTMLFormElement>,
    date: string,
    todo: string
  ) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, todo }),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      const newTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInput("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // 해당 todo 삭제 함수
  const deleteTodo = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete todo");
        await setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo._id !== id)
        );
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    }
  };

  // 수정 버튼 클릭 핸들러
  const editButtonClickHandler = (
    id: string,
    boolean: boolean,
    text: string,
    completed: boolean,
    date: string
  ) => {
    setIsTodoEditerOpen(boolean);
    if (boolean) {
      const todo: Todo = {
        _id: id,
        text,
        completed,
        date,
      };
      setSelectedTodo(todo);
    }
  };

  // 해당 todo 수정 함수
  const editTodo = async (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    todo: Todo
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });
      if (!response.ok) throw new Error("Failed to edit todo");
      const updatedTodo = await response.json();
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === id ? updatedTodo : t))
      );
      fetchTodos();
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  // todo 체크박스 함수
  const toggleComplete = async (todoId: string, completed: boolean) => {
    try {
      const todoToUpdate = todos.find((todo) => todo._id === todoId);
      if (!todoToUpdate) return;
      const response = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === todoId ? { ...todo, completed } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // 날짜를 기반으로 요일을 반환하는 함수
  const getDayFromDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return weeks[dayIndex];
  };

  // todos를 date별로 그룹화하는 함수
  const groupTodosByDate = (todos: Todo[]): GroupedTodos => {
    return todos.reduce((acc: GroupedTodos, todo: Todo) => {
      const date = todo.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(todo);
      return acc;
    }, {});
  };

  const foldToggler = (date: string) => {
    setOpenedDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date)
        : [...prevDates, date]
    );
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      {isDatePickerOpen ? (
        <DatePickerModal
          addTodo={addTodo}
          input={input}
          isOpen
          onClose={() => setIsDatePickerOpen(!isDatePickerOpen)}
          setInput={setInput}
        />
      ) : null}
      {isTodoEditerOpen ? (
        <TodoEditerModal
          onClose={() => setIsTodoEditerOpen(!isTodoEditerOpen)}
          setInput={setInput}
          isOpen
          editTodo={editTodo}
          input={input}
          selectedTodo={selectedTodo}
        />
      ) : null}
      <div className="w-5/6 lg:w-4/6 bg-white text-black font-bold text-xl rounded-2xl m-auto">
        <Button
          className="w-full h-full py-4"
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
              className="min-w-20 bg-white min-h-20 p-4 rounded-3xl text-gray-600"
              key={week}
            >
              <h2 className="text-xl font-bold">{week}</h2>
              <ul className="flex flex-col gap-4 mt-4 overflow-y-auto max-h-[370px] min-h-[370px]">
                {Object.entries(groupedTodos).map(([date, todosForDate]) => (
                  <div
                    className={`flex flex-col border-2 rounded-xl ${
                      openedDates.includes(date)
                        ? "border-slate-500 border-2"
                        : ""
                    }`}
                    key={date}
                  >
                    <div
                      onClick={() => foldToggler(date)}
                      className={`flex cursor-pointer justify-between transition-all delay-200 items-center w-full px-4 py-4 text-left bg-white rounded-lg shadow-lg ${
                        openedDates.includes(date)
                          ? "rounded-b-none outline-none"
                          : ""
                      }`}
                    >
                      <div className="flex gap-2">
                        <h3 className="text-md font-semibold">{date}</h3>{" "}
                        <p>({todosForDate.length})</p>
                      </div>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openedDates.includes(date)
                            ? "-rotate-90"
                            : "rotate-90"
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
                    <div
                      ref={(el) => {
                        todoListRefs.current[date] = el;
                      }}
                      style={{
                        height: openedDates.includes(date)
                          ? heights[date] || "auto"
                          : 0,
                        overflow: "hidden",
                        transition: "height 0.3s ease-in-out",
                      }}
                      className="w-full bg-black shadow-lg rounded-b-lg overflow-hidden"
                    >
                      {todosForDate.map((todo, i) => (
                        <li
                          className={`flex gap-2 bg-white items-start ${
                            todo.completed ? "opacity-90" : ""
                          }`}
                          key={todo._id}
                        >
                          <div className="flex flex-col w-full justify-between items-start">
                            <div className="flex bg-slate-200 w-full items-center justify-between pb-2 px-2 pt-2">
                              <input
                                className="w-4 h-4 ml-1"
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() =>
                                  toggleComplete(todo._id, !todo.completed)
                                }
                              />
                              <div>
                                <Button
                                  onClick={() =>
                                    editButtonClickHandler(
                                      todo._id,
                                      true,
                                      todo.text,
                                      todo.completed,
                                      todo.date
                                    )
                                  }
                                  className="mr-2 bg-blue-200 hover:bg-blue-300"
                                  title="Edit"
                                  classType="btn1"
                                />
                                <Button
                                  onClick={() => deleteTodo(todo._id)}
                                  title="Delete"
                                  classType="btn1"
                                  className="bg-red-200 hover:bg-red-300"
                                />
                              </div>
                            </div>
                            <p
                              className={`min-h-20 text-sm md:text-base p-2 ${
                                todo.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }`}
                            >
                              {todo.text}
                            </p>
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PlannerContainer;
