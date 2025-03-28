import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const client = await connectToDatabase();
    const db = client.db("schedules");
    const result = await db
      .collection("todo")
      .deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const client = await connectToDatabase();
    const db = client.db("schedules");
    const { text, completed } = await req.json();
    const updateFields: any = { completed };
    if (text !== undefined) {
      updateFields.text = text;
    }
    const result = await db
      .collection("todo")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error(error);
  }
}
