import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSmtpPassword() {
  return (process.env.EMAIL_PASSWORD ?? "").replace(/\s/g, "").trim();
}

function hasResend() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function hasWeb3Forms() {
  return Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim());
}

function hasSmtp() {
  return Boolean(process.env.EMAIL_USER?.trim() && getSmtpPassword());
}

function getRecipient() {
  return (
    process.env.EMAIL_RECIPIENT?.trim() ||
    process.env.EMAIL_USER?.trim() ||
    ""
  );
}

async function sendViaResend({ name, email, message }: ContactPayload) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const recipient = getRecipient();
  const from =
    process.env.RESEND_FROM?.trim() || "Portfolio <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to: recipient,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function sendViaWeb3Forms({ name, email, message }: ContactPayload) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_ACCESS_KEY,
      name,
      email,
      message,
      subject: `Portfolio contact from ${name}`,
      replyto: email,
    }),
  });

  const data = (await response.json()) as { success?: boolean; message?: string };

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Web3Forms request failed");
  }
}

async function sendViaSmtp({ name, email, message }: ContactPayload) {
  const user = process.env.EMAIL_USER?.trim();
  const pass = getSmtpPassword();
  const recipient = getRecipient();

  if (!user || !pass) {
    throw new Error("SMTP credentials are not configured");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass },
  });

  await transporter.verify();

  await transporter.sendMail({
    from: user,
    to: recipient,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });
}

async function sendContactEmail(payload: ContactPayload) {
  if (hasResend()) {
    await sendViaResend(payload);
    return "resend";
  }

  if (hasWeb3Forms()) {
    await sendViaWeb3Forms(payload);
    return "web3forms";
  }

  if (hasSmtp()) {
    await sendViaSmtp(payload);
    return "smtp";
  }

  throw new Error(
    "Email is not configured. Add RESEND_API_KEY, WEB3FORMS_ACCESS_KEY, or valid SMTP credentials to .env.local"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, message });

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to send message";

    const isAuthError =
      message.includes("EAUTH") ||
      message.includes("Invalid login") ||
      message.includes("Username and Password not accepted");

    const userMessage = isAuthError
      ? "Email login failed. Use a Gmail App Password (16 characters) in EMAIL_PASSWORD, or set WEB3FORMS_ACCESS_KEY / RESEND_API_KEY in .env.local."
      : message.includes("not configured")
        ? message
        : "Failed to send message. Please try again later.";

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
