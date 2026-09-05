import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-webhook-secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const type = body?._type;

    revalidatePath("/");
    if (type === "project") {
      revalidatePath("/#projects");
    }

    return NextResponse.json({
      revalidated: true,
      type: type ?? "unknown",
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error during revalidation", error: String(err) },
      { status: 500 }
    );
  }
}
