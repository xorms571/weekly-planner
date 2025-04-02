import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectToDatabase } from "../lib/mongodb";
import { getTokenFromCookies } from "@/app/utils/getToken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const token = getTokenFromCookies(req);
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const db = await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const lastId = searchParams.get("lastId");

    const query: any = { userId: decoded.userId };
    if (lastId) query._id = { $gt: new Object(lastId) };

    const todos = await db
      .collection("todo")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error ${error}` },
      { status: 500 }
    );
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
      return NextResponse.json(
        { message: `Invalid or expired token ${err}` },
        { status: 401 }
      );
    }

    const { todo, date } = await req.json();

    if (!todo || !date) {
      return NextResponse.json(
        { message: "Todo text and date are required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const newTodo = {
      text: todo,
      date,
      completed: false,
      userId: decoded.userId,
    };
    const result = await db.collection("todo").insertOne(newTodo);

    return NextResponse.json(
      { _id: result.insertedId, ...newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding todo:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
