import { NextResponse } from "next/server";
import { Resend } from "resend";

const VALID_PROJECT_TYPES = ["Contract", "Full-time", "Part-time"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, projectType, message, website } = body;

    // Honeypot: reject if bot-filled field has a value
    if (website && typeof website === "string" && website.trim()) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!VALID_PROJECT_TYPES.includes(projectType)) {
      return NextResponse.json(
        { error: "Invalid project type" },
        { status: 400 }
      );
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    // Use RESEND_TEST_RECIPIENT for testing (Resend allows only your account email when using onboarding domain). Otherwise CONTACT_EMAIL (main page email).
    const toEmail =
      process.env.CONTACT_EMAIL ||
      "dc@dc-dev.space";

    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <contacat@dc-dev.space>",
      to: [toEmail],
      subject: `Portfolio contact from ${name.trim()}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
        <p><strong>Project type:</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message.trim()).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      const message =
        error.message ||
        "Failed to send email. To send to this address, verify a domain at resend.com/domains and use a from address on that domain.";
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
