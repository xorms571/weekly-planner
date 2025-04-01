import { Dispatch, SetStateAction, useEffect } from "react";
import Button from "./Button";
import { Todo, weeks } from "./PlannerContainer";
type props = {
  editTodo: (
    e: React.FormEvent<HTMLFormElement>,
    id: string,
    todo: Todo
  ) => Promise<void>;
  setInput: Dispatch<SetStateAction<string>>;
  input: string;
  onClose: () => void;
  isOpen: boolean;
  selectedTodo: Todo | null;
};
const TodoEditerModal = ({
  editTodo,
  input,
  setInput,
  onClose,
  isOpen,
  selectedTodo,
}: props) => {
  if (!isOpen || !selectedTodo) return null;
  useEffect(() => {
    setInput(selectedTodo?.text);
  }, [setInput]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || input === selectedTodo?.text) {
      alert("Fill or Change the Todo's contents.");
      return;
    }
    if (!selectedTodo) {
      alert("Select a Todo to edit.");
      return;
    }
    const newTodo = {
      _id: selectedTodo._id,
      text: input,
      completed: selectedTodo.completed,
      date: selectedTodo.date,
    };
    await editTodo(e, selectedTodo._id, newTodo);
    setInput("");
    onClose();
  };
  const date = new Date(selectedTodo?.date);
  const dayIndex = date.getDay();
  return (
    <div className="fixed z-10 text-black min-w-60 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-lg shadow-lg"
      >
        <div className="flex items-end mb-3 text-xl">
          <h4 className="font-bold mr-3">{weeks[dayIndex]}</h4>{" "}
          <p>{selectedTodo?.date}</p>
        </div>
        <h3 className="text-lg font-bold mb-3">
          Type the Todo that you want to change.
        </h3>
        <input
          className="w-full h-[44px] px-2 border rounded bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Edit a todo"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            title="cancel"
            type="button"
            classType="btn1"
            onClick={onClose}
          />
          <Button title="submit" type="submit" classType="btn1" />
        </div>
      </form>
    </div>
  );
};

export default TodoEditerModal;
