import jwt from "jsonwebtoken";
import { supabaseAdmin } from "@/lib/supabase";

export const ADMIN_COOKIE_NAME = "admin_session";
export const COLLEGE_COOKIE_NAME = "college_session";

export function signAdminToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export function signCollegeToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// Returns the admin session if the cookie is valid AND the admin is still active.
export async function requireAdmin(request) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.admin_id) return null;

  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("id, username, full_name, is_active")
    .eq("id", payload.admin_id)
    .maybeSingle();

  if (!admin || !admin.is_active) return null;
  return { admin_id: admin.id, username: admin.username, full_name: admin.full_name };
}

// Returns the college session if the cookie is valid AND the college is still active.
export async function requireCollege(request) {
  const token = request.cookies.get(COLLEGE_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.college_id) return null;

  const { data: college } = await supabaseAdmin
    .from("colleges")
    .select("id, college_name, username, is_active")
    .eq("id", payload.college_id)
    .maybeSingle();

  if (!college || !college.is_active) return null;
  return { college_id: college.id, college_name: college.college_name, username: college.username };
}
