import { NextResponse } from "next/server";
import { APPLICATION_FIELDS, getVacancy } from "@/lib/vacancies";

type Body = {
  slug: string;
  vacancy: string;
  fields: Record<string, string>;
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const { slug, fields } = body ?? {};
  const vacancy = getVacancy(slug);
  if (!vacancy || !fields?.name || !fields?.phone) {
    return NextResponse.json(
      { ok: false, error: "missing fields" },
      { status: 400 }
    );
  }

  const lines = APPLICATION_FIELDS.filter((f) => fields[f.name]?.trim())
    .map((f) => `<b>${esc(f.label)}:</b> ${esc(fields[f.name].trim())}`)
    .join("\n");

  const text =
    `🧑‍🍳 <b>Нова анкета — ${esc(vacancy.title)}</b>\n\n` + lines;

  // TODO: confirm the real destination (Telegram / email / ATS). For now it
  // reuses the Telegram bot; without env vars it just logs so the flow works.
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_HR_CHAT_ID ?? process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
        }
      );
      if (!res.ok) console.error("[vacancy] telegram error", await res.text());
    } catch (e) {
      console.error("[vacancy] telegram fetch failed", e);
    }
  } else {
    console.log("[vacancy] (Telegram not configured)\n" + text);
  }

  return NextResponse.json({ ok: true });
}
