"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "./Button";

const UserInformation = () => {
  const [user, setUser] = useState<{ email: string; nickname: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[98px] min-w-[220px]">
        <p>Loading...</p>
      </div>
    );

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p>{user.email}</p>
      <p>{user.nickname}</p>
      <Button
        onClick={handleLogout}
        title="Log Out"
        classType="btn1"
        className="text-black"
      />
    </div>
  );
};

export default UserInformation;
