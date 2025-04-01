import { NextResponse } from "next/server";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    return NextResponse.json(
      { message: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    return NextResponse.json(
      { message: "잘못된 토큰입니다." },
      { status: 401 }
    );
  }
}