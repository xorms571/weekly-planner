import { Dispatch, SetStateAction, useState } from "react";
import Button from "./Button";

type DatePickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  addTodo: (
    e: React.FormEvent<HTMLFormElement>,
    date: string,
    todo: string
  ) => Promise<void>;
};

const DatePickerModal = ({
  isOpen,
  onClose,
  input,
  setInput,
  addTodo,
}: DatePickerModalProps) => {
  const [date, setDate] = useState("");
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date || !input) {
      alert("Type the date or todo");
      return;
    }
    await addTodo(e, date, input);
    onClose();
  };

  return (
    <div className="fixed z-10 text-black min-w-60 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-lg shadow-lg"
      >
        <h3 className="text-lg font-bold mb-3">Choose a date</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mb-3 rounded w-full"
        />
        <h3 className="text-lg font-bold mb-3">Type the Todo</h3>
        <input
          className="w-full h-[44px] px-2 border rounded bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo"
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

export default DatePickerModal;
