import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { getTokenFromCookies } from "@/app/utils/getToken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }

  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const db = await connectToDatabase();
    const todo = await db
      .collection("todo")
      .findOne({ _id: new ObjectId(id) });

    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    if (todo.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to delete this todo" },
        { status: 403 }
      );
    }

    const result = await db
      .collection("todo")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Todo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID format" },
      { status: 400 }
    );
  }

  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const db = await connectToDatabase();
    const todo = await db
      .collection("todo")
      .findOne({ _id: new ObjectId(id) });

    if (!todo) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    if (todo.userId !== decoded.userId) {
      return NextResponse.json(
        { success: false, message: "You are not authorized to update this todo" },
        { status: 403 }
      );
    }

    const { text, completed } = await req.json();

    const updateFields: any = {};
    if (text !== undefined) updateFields.text = text;
    if (completed !== undefined) updateFields.completed = completed;

    const result = await db
      .collection("todo")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Todo updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
