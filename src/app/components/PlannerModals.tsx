import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Todo } from "./PlannerContainer";
import DatePickerModal from "./DatePickerModal";
import TodoEditerModal from "./TodoEditerModal";

interface props {
  isDatePickerOpen: boolean;
  isTodoEditerOpen: boolean;
  selectedTodo: Todo | null;
  setIsTodoEditerOpen: Dispatch<SetStateAction<boolean>>;
  setIsDatePickerOpen: (value: SetStateAction<boolean>) => void;
  setTodos: (value: SetStateAction<Todo[]>) => void;
}

const PlannerModals = ({
  isDatePickerOpen,
  isTodoEditerOpen,
  selectedTodo,
  setIsDatePickerOpen,
  setIsTodoEditerOpen,
  setTodos,
}: props) => {
  const [input, setInput] = useState("");

  // GET todos 데이터 가져오기
  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos", {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ date, todo }),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      const newTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInput("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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

  return (
    <>
      {isDatePickerOpen ? (
        <DatePickerModal
          onClose={() => setIsDatePickerOpen(!isDatePickerOpen)}
          setInput={setInput}
          addTodo={addTodo}
          input={input}
          isOpen
        />
      ) : null}
      {isTodoEditerOpen ? (
        <TodoEditerModal
          onClose={() => setIsTodoEditerOpen(!isTodoEditerOpen)}
          setInput={setInput}
          editTodo={editTodo}
          selectedTodo={selectedTodo}
          input={input}
          isOpen
        />
      ) : null}
    </>
  );
};

export default PlannerModals;