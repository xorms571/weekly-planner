import { NextResponse } from "next/server";
import { connectToDatabase } from "../lib/mongodb";

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("schedules");

    const todos = await db.collection("todo").find({}).toArray();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { todo, date } = await req.json();
    if (!todo) {
      return NextResponse.json(
        { message: "Todo text is required" },
        { status: 400 }
      );
    }
    const client = await connectToDatabase();
    const db = client.db("schedules");
    const newTodo: any = {
      text: todo,
      date,
      completed: false,
    };
    const result = await db.collection("todo").insertOne(newTodo);
    return NextResponse.json(
      { _id: result.insertedId, ...newTodo },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
