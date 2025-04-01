import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Button from "./Button";
import { Todo } from "./PlannerContainer";
interface props {
  todos: Todo[];
  date: string;
  todoListRefs: RefObject<Record<string, HTMLDivElement | null>>;
  openedDates: string[];
  todosForDate: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setSelectedTodo: (value: SetStateAction<Todo | null>) => void;
  setIsTodoEditerOpen: (value: SetStateAction<boolean>) => void;
}
const TodoListForDate = ({
  todos,
  date,
  openedDates,
  todoListRefs,
  todosForDate,
  setTodos,
  setIsTodoEditerOpen,
  setSelectedTodo,
}: props) => {
  const [heights, setHeights] = useState<Record<string, number>>({});

  // 날짜별 높이 계산
  useEffect(() => {
    const newHeights: Record<string, number> = {};
    Object.keys(todoListRefs.current).forEach((date) => {
      const element = todoListRefs.current[date];
      if (element) newHeights[date] = element.scrollHeight;
    });
    setHeights(newHeights);
  }, [todos]);

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
        credentials: "include",
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

  // 해당 todo 삭제 함수
  const deleteTodo = async (id: string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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

  return (
    <div
      ref={(el) => {
        todoListRefs.current[date] = el;
      }}
      style={{
        height: openedDates.includes(date) ? heights[date] || "auto" : 0,
        transition: "height 0.3s ease-in-out",
      }}
      className="bg-black w-full shadow-lg rounded-b-lg overflow-hidden"
    >
      {todosForDate.map((todo) => (
        <li
          className={`flex gap-2 bg-white items-start ${
            todo.completed && "opacity-90"
          }`}
          key={todo._id}
        >
          <div className="flex flex-col w-full justify-between items-start">
            <div className="flex bg-slate-200 w-full items-center justify-between pb-2 px-2 pt-2">
              <input
                className="w-4 h-4 ml-1"
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id, !todo.completed)}
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
                todo.completed && "line-through text-gray-500"
              }`}
            >
              {todo.text}
            </p>
          </div>
        </li>
      ))}
    </div>
  );
};

export default TodoListForDate;
