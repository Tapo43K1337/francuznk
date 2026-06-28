export type Promo = {
  id: string;
  tag: string;
  title: string;
  text: string;
};

export const PROMOS: Promo[] = [
  {
    id: "combo",
    tag: "Вигода",
    title: "Кава + круасан",
    text: "Замовляй комбо та отримай −20% на свіжий круасан до кави.",
  },
  {
    id: "breakfast",
    tag: "Сніданок дня",
    title: "Доброго ранку",
    text: "Спеціальна ціна на сніданки щодня до 12:00.",
  },
  {
    id: "dessert",
    tag: "Новинка",
    title: "Новий десерт",
    text: "Спробуй баскський чизкейк — вже у вітрині.",
  },
  {
    id: "happy",
    tag: "Happy Hours",
    title: "−15% на напої",
    text: "Щодня з 15:00 до 17:00 на всі авторські напої.",
  },
];
