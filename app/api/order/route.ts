import { NextResponse } from "next/server";

type Line = { name: string; qty: number; price: number };
type Body = {
  lines: Line[];
  total: number;
  customer: {
    name: string;
    phone: string;
    type: "pickup" | "delivery";
    address?: string;
    comment?: string;
  };
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

  const { lines, total, customer } = body ?? {};
  if (!lines?.length || !customer?.name || !customer?.phone) {
    return NextResponse.json(
      { ok: false, error: "missing fields" },
      { status: 400 }
    );
  }

  const orderId = "FR-" + Date.now().toString().slice(-6);
  const itemsText = lines
    .map((l) => `• ${esc(l.name)} × ${l.qty} — ${l.qty * l.price} ₴`)
    .join("\n");

  const text =
    `🥐 <b>Нове замовлення ${orderId}</b>\n\n` +
    `${itemsText}\n\n` +
    `<b>Сума:</b> ${total} ₴\n` +
    `<b>Спосіб:</b> ${customer.type === "delivery" ? "Доставка" : "Самовивіз"}\n` +
    (customer.address ? `<b>Адреса:</b> ${esc(customer.address)}\n` : "") +
    `<b>Ім'я:</b> ${esc(customer.name)}\n` +
    `<b>Телефон:</b> ${esc(customer.phone)}\n` +
    (customer.comment ? `<b>Коментар:</b> ${esc(customer.comment)}\n` : "") +
    `<b>Оплата:</b> при отриманні`;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
        }
      );
      if (!res.ok) {
        console.error("[order] telegram error", await res.text());
      }
    } catch (e) {
      console.error("[order] telegram fetch failed", e);
    }
  } else {
    // No Telegram configured yet — log so the flow still works in dev.
    console.log("[order] (Telegram not configured)\n" + text);
  }

  return NextResponse.json({ ok: true, orderId });
}
