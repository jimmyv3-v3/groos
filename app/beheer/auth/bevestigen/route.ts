import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { beheerPaths, safeNext } from "../../_lib/paths";

const TYPES: EmailOtpType[] = ["invite", "recovery", "email"];

/**
 * Link uit de uitnodigings- en herstelmail (spec 08 §4.5). token_hash met
 * verifyOtp, of code met exchangeCodeForSession. Route handlers mogen
 * cookies schrijven.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const tokenHash = url.searchParams.get("token_hash");
  const rawType = url.searchParams.get("type");
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("volgende"));
  const type = TYPES.find((t) => t === rawType);

  const go = (path: string) => {
    const target = request.nextUrl.clone();
    const [pathname, search = ""] = path.split("?");
    target.pathname = pathname;
    target.search = search ? `?${search}` : "";
    return NextResponse.redirect(target, 307);
  };

  if (!hasSupabaseEnv()) return go(`${beheerPaths.login}?melding=link-verlopen`);
  const supabase = await createSupabaseServerClient();

  let ok = false;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    ok = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  }

  if (!ok) return go(`${beheerPaths.login}?melding=link-verlopen`);
  if (type === "invite" || type === "recovery") return go(beheerPaths.setPassword);
  return go(next);
}
