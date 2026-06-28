"use client";

// Google Maps place embed (no API key) — the official "Embed a map" iframe for
// the Франс location. Because it carries the place ID (!1s…), the map shows the
// business card (name + rating), not just a bare pin. Language set to uk.
const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2691.6882604377056!2d34.36788817005523!3d47.57385353836052!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40dca3f2cba46fe9%3A0x1cc89f1a55ed8620!2z0KTRgNCw0L3RgdGD0LA!5e0!3m2!1suk!2sua!4v1782643827572!5m2!1suk!2sua";

export function MapView() {
  return (
    <iframe
      title="Карта — ФРАНЦУЗ, Нікополь"
      src={EMBED_SRC}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
      style={{ border: 0 }}
    />
  );
}
