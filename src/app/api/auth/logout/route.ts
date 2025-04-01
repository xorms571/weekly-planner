import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookie = `token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;

    const response = NextResponse.json({ message: "로그아웃 성공!" });

    response.headers.append("Set-Cookie", cookie);

    return response;
  } catch (error) {
    console.error("로그아웃 오류:", error);
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
