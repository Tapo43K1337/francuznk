/** Central brand / site configuration. Placeholder contacts — replace later. */
export const SITE = {
  name: "ФРАНЦУЗ",
  tagline: "кав'ярня & пекарня",
  description:
    "Спешелті кава, власна пекарня, авторські напої та сніданки. ФРАНЦУЗ — кав'ярня, що створює настрій.",
  url: "https://francuz.coffee",

  hero: {
    title: "Кава, яка створює настрій",
    subtitle:
      "Спешелті кава, власна пекарня, авторські напої та сніданки",
  },

  // CTA targets (placeholders — confirm real order flow)
  orderUrl: "https://menu.ps.me/oaYvSKkeZv0",
  phone: "+38 (095) 122 20 21",
  phoneHref: "tel:+380951222021",
  email: "francuz.nikopil@gmail.com",
  emailHref: "mailto:francuz.nikopil@gmail.com",

  address: "проспект Трубників, 39А, м. Нікополь",
  hours: "Щодня · 08:00 – 21:00",

  geo: { lat: 47.5741720135442, lng: 34.369052248686536 },

  wifi: { name: "Francuz", pass: "francuz1" },

  social: {
    instagram: "https://www.instagram.com/frantsuz_kaviarnia/",
    instagramHandle: "frantsuz_kaviarnia",
    facebook: "https://facebook.com/",
  },

  nav: [
    { label: "Меню", href: "/menu" },
    { label: "Вакансії", href: "/vacancies" },
    { label: "Контакти", href: "/contacts" },
  ],
} as const;
