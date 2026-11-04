import { NextResponse } from "next/server";
import { createToken, sessionCookie, clearCookie } from "@/lib/auth";

export async function POST(req: Request) {
  console.log(
    "loaded env:",
    JSON.stringify(process.env.ADMIN_USER),
    JSON.stringify(process.env.ADMIN_PASSWORD)
  );
  const { user, password } = await req.json().catch(() => ({}));
  console.log("you typed:  ", JSON.stringify(user), JSON.stringify(password));

  const ok =
    user === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD;

  if (!ok) {
    return NextResponse.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", sessionCookie(createToken(user)));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearCookie());
  return res;
}