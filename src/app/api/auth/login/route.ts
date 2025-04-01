import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";

const JWT_SECRET: string = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables.");

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 모두 입력해야 합니다." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne(
      { email },
      { projection: { _id: 1, password: 1, nickname: 1, email: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { message: "이메일 혹은 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "이메일 혹은 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ token, message: "로그인 성공!" }, { status: 200 });

  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
