import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";

export async function POST(req: Request) {
  const { email, password, nickname } = await req.json();
  if (!email || !password || !nickname)
    return NextResponse.json(
      { message: "모든 필드를 입력해야 합니다." },
      { status: 400 }
    );

  const db = await connectToDatabase();
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser)
    return NextResponse.json(
      { message: "이미 존재하는 이메일입니다." },
      { status: 400 }
    );

  const existingNickname = await db.collection("users").findOne({ nickname });
  if (existingNickname)
    return NextResponse.json(
      { message: "이미 사용 중인 닉네임입니다." },
      { status: 400 }
    );

  const hashedPassword = await bcrypt.hash(password, 8);
  await db
    .collection("users")
    .insertOne({ email, password: hashedPassword, nickname });

  return NextResponse.json({ message: "회원가입 성공!" }, { status: 201 });
}
