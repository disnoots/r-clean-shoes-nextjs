import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET ?? "dev-secret-ganti-di-produksi";
const COOKIE_NAME = "admin_session";
const MAX_AGE = 7 * 24 * 60 * 60; // 7 hari (detik)

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

/** Buat token: base64(payload).signature — payload = user.expiry */
export function createToken(user: string) {
  const payload = `${user}.${Date.now() + MAX_AGE * 1000}`;
  return `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
}

/** Verifikasi token: signature valid dan belum kedaluwarsa */
export function verifyToken(token?: string | null) {
  if (!token) return false;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return false;
  const payload = Buffer.from(b64, "base64url").toString();
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(payload));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

/** Ambil & verifikasi cookie dari header Request (dipakai API admin) */
export function isAdminRequest(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|;\s*)admin_session=([^;]+)/);
  return verifyToken(match?.[1]);
}

export function sessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}