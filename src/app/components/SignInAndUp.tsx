"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../components/Button";

export default function SignInAndUp() {
  const [toggle, setToggle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidPassword(password)) {
      setError(
        "비밀번호는 최소 8자이며, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, nickname }),
    });
    const data = await res.json();
    alert(data.message);
    if (res.ok) setToggle(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력하세요.");
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      await window.location.replace("/planner");
    } else {
      setError(data.message || "로그인 실패. 다시 시도하세요.");
    }
  };

  const handleToggle = () => {
    setError("");
    setEmail("");
    setNickname("");
    setPassword("");
    setConfirmPassword("");
    setToggle(!toggle);
  };

  return (
    <>
      <form
        className="flex h-[308px] w-80 flex-col justify-between items-end gap-5 rounded-lg bg-white p-5"
        onSubmit={toggle ? handleRegister : handleLogin}
      >
        <div className="flex flex-col gap-5 w-full">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {toggle && (
            <input
              type="text"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {toggle && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
        </div>
        <div className="w-full flex flex-col items-end">
          <p
            className={`text-red-600 mb-5 h-[48px] text-wrap ${
              error ? "opacity-100" : "opacity-0"
            }`}
          >
            {error}
          </p>
          <Button
            title={toggle ? "Register" : "Login"}
            className="text-black bg-slate-200 w-fit px-5 rounded-md"
            type="submit"
          />
        </div>
      </form>
      <Button
        title={toggle ? "Sign In" : "Sign Up"}
        onClick={handleToggle}
        type="button"
        className="mt-5"
      />
    </>
  );
}
