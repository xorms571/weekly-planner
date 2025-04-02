import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../lib/mongodb";
import { getTokenFromCookies } from "@/app/utils/getToken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const token = getTokenFromCookies(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (err) {
      return NextResponse.json({ message: `Invalid or expired token ${err}` }, { status: 401 });
    }

    const db = await connectToDatabase();
    const todos = await db
      .collection("todo")
      .find({ userId: decoded.userId })
      .toArray();

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromCookies(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (err) {
      return NextResponse.json({ message: `Invalid or expired token ${err}` }, { status: 401 });
    }

    const { todo, date } = await req.json();

    if (!todo || !date) {
      return NextResponse.json({ message: "Todo text and date are required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const newTodo = { text: todo, date, completed: false, userId: decoded.userId };
    const result = await db.collection("todo").insertOne(newTodo);

    return NextResponse.json({ _id: result.insertedId, ...newTodo }, { status: 201 });
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
