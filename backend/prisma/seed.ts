import argon2 from 'argon2'
import { prisma } from '../src/db/prisma.js'

const TEST_PASSWORD = 'password123'

const DISH_VARIANTS: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1,
  7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2,
  13: 1, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1, 23: 1,
  24: 2, 25: 2, 26: 2, 27: 2, 28: 2, 29: 2,
  30: 2, 31: 2, 32: 2, 33: 2, 34: 2,
  35: 3, 36: 2, 37: 2, 38: 2, 39: 2,
  40: 1, 41: 2, 42: 2, 43: 2,
}

function getDishImages(dishIndex: number): string[] {
  const n = dishIndex + 1
  const count = DISH_VARIANTS[n] ?? 1
  return Array.from({ length: count }, (_, i) => `/images/dishes/dish-${n}.${i + 1}.webp`)
}

function repeatNewsImages(index: number): string[] {
  const url = `/images/news/news-${index + 1}.webp`
  const count = (index % 4) + 2
  return Array(count).fill(url)
}

async function main() {
  await prisma.category.createMany({
    data: [
      { slug: 'food', nameRu: 'Еда', nameEn: 'Food' },
      { slug: 'drink', nameRu: 'Напитки', nameEn: 'Drinks' },
      { slug: 'dessert', nameRu: 'Десерты', nameEn: 'Desserts' },
    ],
  })

  await prisma.tag.createMany({
    data: [
      { slug: 'spicy', nameRu: 'Острое', nameEn: 'Spicy' },
      { slug: 'hot', nameRu: 'Горячее', nameEn: 'Hot' },
      { slug: 'meat', nameRu: 'Мясо', nameEn: 'Meat' },
      { slug: 'vegetarian', nameRu: 'Вегетарианское', nameEn: 'Vegetarian' },
      { slug: 'sweet', nameRu: 'Сладкое', nameEn: 'Sweet' },
      { slug: 'alcohol', nameRu: 'Алкоголь', nameEn: 'Alcohol' },
      { slug: 'non-alcoholic', nameRu: 'Безалкогольное', nameEn: 'Non-alcoholic' }
    ],
  })

  await prisma.allergen.createMany({
    data: [
      { slug: 'gluten', nameRu: 'Глютен', nameEn: 'Gluten' },
      { slug: 'lactose', nameRu: 'Лактоза', nameEn: 'Lactose' },
      { slug: 'eggs', nameRu: 'Яйца', nameEn: 'Eggs' },
      { slug: 'fish', nameRu: 'Рыба', nameEn: 'Fish' },
      { slug: 'shellfish', nameRu: 'Ракообразные', nameEn: 'Shellfish' },
      { slug: 'molluscs', nameRu: 'Моллюски', nameEn: 'Molluscs' },
      { slug: 'peanuts', nameRu: 'Арахис', nameEn: 'Peanuts' },
      { slug: 'nuts', nameRu: 'Орехи (древесные)', nameEn: 'Tree Nuts' },
      { slug: 'soy', nameRu: 'Соя', nameEn: 'Soy' },
      { slug: 'sesame', nameRu: 'Кунжут', nameEn: 'Sesame' },
      { slug: 'celery', nameRu: 'Сельдерей', nameEn: 'Celery' },
      { slug: 'mustard', nameRu: 'Горчица', nameEn: 'Mustard' },
      { slug: 'sulphites', nameRu: 'Сульфиты (E220-228)',  nameEn: 'Sulphites' },
      { slug: 'lupin', nameRu: 'Люпин', nameEn: 'Lupin' },
    ],
  })

  const dishes = [
    {
      nameRu: 'Кровавый пир Весимира',
      nameEn: "Vesemir's Bloody Feast",
      descriptionRu: 'Тартар из говядины с маринованным луком, желтком перепелиного яйца и каперсами. Подаётся с гренками из ржаного хлеба.',
      descriptionEn: 'Beef tartare with pickled onion, quail egg yolk and capers. Served with rye croutons.',
      price: 590,
      categorySlug: 'food',
      tagSlugs: ['meat'],
      allergenSlugs: ['gluten', 'eggs', 'mustard'],
    },
    {
      nameRu: 'Клыки волколака',
      nameEn: "Werewolf's Fangs",
      descriptionRu: 'Карпаччо из говяжьей вырезки с пармезаном, кедровыми орехами и рукколой. Заправка — оливковое масло и сок лимона.',
      descriptionEn: 'Beef tenderloin carpaccio with parmesan, pine nuts and arugula. Dressed with olive oil and lemon juice.',
      price: 580,
      categorySlug: 'food',
      tagSlugs: ['meat'],
      allergenSlugs: ['lactose', 'nuts'],
    },
    {
      nameRu: 'Гномьи соленья',
      nameEn: "Dwarf's Pickles",
      descriptionRu: 'Ассорти из маринованных огурцов, помидоров черри, грибов и хрустящего репчатого лука с пряными травами.',
      descriptionEn: 'Assorted pickled cucumbers, cherry tomatoes, mushrooms and crispy onions with herbs.',
      price: 280,
      categorySlug: 'food',
      tagSlugs: ['vegetarian', 'spicy'],
      allergenSlugs: ['mustard', 'sulphites'],
    },
    {
      nameRu: 'Свиток некроманта',
      nameEn: "Necromancer's Scroll",
      descriptionRu: 'Тонкий лаваш с ростбифом, вялеными томатами, руколой и пармезаном. Свернут в плотный рулет.',
      descriptionEn: 'Thin lavash with roast beef, sun-dried tomatoes, arugula and parmesan. Rolled into a tight roll.',
      price: 420,
      categorySlug: 'food',
      tagSlugs: ['meat'],
      allergenSlugs: ['gluten', 'lactose'],
    },
    {
      nameRu: 'Логово тролля',
      nameEn: "Troll's Lair",
      descriptionRu: 'Закуска из копчёного лосося с творожным сыром, каперсами и укропом на ржаном хлебе.',
      descriptionEn: 'Smoked salmon with cream cheese, capers and dill on rye bread.',
      price: 450,
      categorySlug: 'food',
      tagSlugs: ['meat'],
      allergenSlugs: ['gluten', 'lactose', 'fish'],
    },
    {
      nameRu: 'Тарелка друида',
      nameEn: "Druid's Plate",
      descriptionRu: 'Нарезка из маринованных овощей: артишоки, кабачки, перец, маслины с пряными травами.',
      descriptionEn: 'Marinated vegetables selection: artichokes, zucchini, peppers, olives with herbs.',
      price: 300,
      categorySlug: 'food',
      tagSlugs: ['vegetarian'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Зельеварня алхимика',
      nameEn: "Alchemist's Pantry",
      descriptionRu: 'Тарелка с ферментированными овощами: кимчи из пекинской капусты, квашеный перец, маринованный редис и кабачки с пряностями.',
      descriptionEn: 'Plate with fermented vegetables: kimchi, pickled peppers, fermented radish and zucchini with spices.',
      price: 290,
      categorySlug: 'food',
      tagSlugs: ['vegetarian', 'spicy'],
      allergenSlugs: ['gluten', 'sulphites'],
    },
    {
      nameRu: 'Мясо на костре',
      nameEn: 'Tavern Cured Meats',
      descriptionRu: 'Традиционная закуска из вяленого мяса: свиная брезаола, говяжья прошутто и пикантное салями с травами.',
      descriptionEn: 'Traditional selection of cured meats: pork bresaola, beef prosciutto and spicy salami with herbs.',
      price: 490,
      categorySlug: 'food',
      tagSlugs: ['meat', 'spicy'],
      allergenSlugs: ['gluten'],
    },
    {
      nameRu: 'Крылья василиска',
      nameEn: "Basilisk's Wings",
      descriptionRu: 'Острые куриные крылья в соусе из перца чили и томатов. Подаются с сельдереем и голубым сырным соусом.',
      descriptionEn: 'Spicy chicken wings in chilli-tomato sauce. Served with celery and blue cheese dip.',
      price: 460,
      categorySlug: 'food',
      tagSlugs: ['meat', 'spicy'],
      allergenSlugs: ['lactose', 'celery'],
    },
    {
      nameRu: 'Котёл ведьмака',
      nameEn: "Witcher's Cauldron",
      descriptionRu: 'Густое рагу из дикого кабана с чёрным пивом, травами, грибами и сушёной клюквой. Подаётся с хрустящим хлебом.',
      descriptionEn: 'Thick wild boar stew with dark beer, herbs, mushrooms and dried cranberries. Served with crusty bread.',
      price: 750,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat'],
      allergenSlugs: ['gluten', 'sulphites'],
    },
    {
      nameRu: 'Тушёный варг',
      nameEn: 'Braised Warg',
      descriptionRu: 'Медленно тушёная баранья нога с розмарином, чесноком и пряными кореньями. Подаётся с картофельным пюре и печёным чесноком.',
      descriptionEn: 'Slow braised lamb leg with rosemary, garlic and spiced roots. Served with mashed potatoes and roasted garlic.',
      price: 890,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat'],
      allergenSlugs: ['lactose'],
    },
    {
      nameRu: 'Огонь Смауга',
      nameEn: "Smaug's Fire",
      descriptionRu: 'Стейк из говяжьей вырезки с острым перцем чили, чесноком и сливочным маслом. Подаётся с запечённым картофелем и травяным маслом.',
      descriptionEn: 'Beef tenderloin steak with chilli peppers, garlic and butter. Served with baked potato and herb butter.',
      price: 1290,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat', 'spicy'],
      allergenSlugs: ['lactose'],
    },
    {
      nameRu: 'Подземелье гномов',
      nameEn: "Dwarf's Dungeon Stew",
      descriptionRu: 'Гуляш из говядины с паприкой, томатами и болгарским перцем. Подаётся с галушками из картофельной муки и сметаной.',
      descriptionEn: 'Beef goulash with paprika, tomatoes and peppers. Served with potato dumplings and sour cream.',
      price: 650,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat', 'spicy'],
      allergenSlugs: ['gluten', 'lactose'],
    },
    {
      nameRu: 'Сердце дракона',
      nameEn: "Dragon's Heart",
      descriptionRu: 'Говяжье сердце, фаршированное шампиньонами и травами, запечённое в сливочном соусе с паприкой. Подаётся с печёным картофелем.',
      descriptionEn: 'Beef heart stuffed with mushrooms and herbs, baked in cream sauce with paprika. Served with baked potatoes.',
      price: 680,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat'],
      allergenSlugs: ['lactose'],
    },
    {
      nameRu: 'Чёрный гримуар',
      nameEn: 'Black Grimoire Pasta',
      descriptionRu: 'Паста из чёрного риса с кальмарами, чернилами каракатицы, чесноком и пряными травами. Подаётся с томатами черри и зеленью.',
      descriptionEn: 'Black rice pasta with squid, squid ink, garlic and herbs. Served with cherry tomatoes and fresh greens.',
      price: 720,
      categorySlug: 'food',
      tagSlugs: ['hot'],
      allergenSlugs: ['gluten', 'molluscs'],
    },
    {
      nameRu: 'Стейк из Каэр Морхена',
      nameEn: 'Kaer Morhen Steak',
      descriptionRu: 'Стейк из мраморной говядины с розмариново-чесночным маслом, карамелизированным луком и жареным чесноком.',
      descriptionEn: 'Marbled beef steak with rosemary-garlic butter, caramelized onion and roasted garlic.',
      price: 1490,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat'],
      allergenSlugs: ['lactose'],
    },
    {
      nameRu: 'Ужин некроманта',
      nameEn: "Necromancer's Roast",
      descriptionRu: 'Свиная корейка, медленно запечённая в пряном соусе с копчёной паприкой, мёдом и горчицей. Подаётся с квашеной капустой и пюре.',
      descriptionEn: 'Slow roasted pork loin in spicy sauce with smoked paprika, honey and mustard. Served with sauerkraut and mash.',
      price: 740,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat', 'sweet'],
      allergenSlugs: ['mustard', 'sulphites'],
    },
    {
      nameRu: 'Священный огонь паладина',
      nameEn: "Paladin's Sacred Fire",
      descriptionRu: 'Овощи на гриле: кабачки, баклажаны, сладкий перец, красный лук и томаты. Подаются с соусом песто и козьим сыром.',
      descriptionEn: 'Grilled vegetables: zucchini, eggplant, peppers, red onion and tomatoes. Served with pesto sauce and goat cheese.',
      price: 520,
      categorySlug: 'food',
      tagSlugs: ['hot', 'vegetarian'],
      allergenSlugs: ['lactose', 'nuts'],
    },
    {
      nameRu: 'Копьё легионера',
      nameEn: "Legionnaire's Spear Ribs",
      descriptionRu: 'Свиные ребрышки в медово-чили маринаде с чесноком. Запекаются до хрустящей корочки. Подаются с картофелем фри.',
      descriptionEn: 'Pork ribs in honey-chilli-garlic marinade. Baked to crispy perfection. Served with french fries.',
      price: 780,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat', 'spicy', 'sweet'],
      allergenSlugs: ['gluten', 'sulphites'],
    },
    {
      nameRu: 'Судак «Белый орёл»',
      nameEn: 'Oxenfurt Fried Fish',
      descriptionRu: 'Филе судака в хрустящей панировке с чесночным маслом — фирменное блюдо трактира «Белый орёл». Подаётся с картофельным пюре и лимоном.',
      descriptionEn: 'Crispy breaded pike-perch fillet with garlic butter, served with mashed potatoes and lemon.',
      price: 830,
      categorySlug: 'food',
      tagSlugs: ['hot'],
      allergenSlugs: ['fish', 'gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Пиршество вампира',
      nameEn: "Vampire's Feast",
      descriptionRu: 'Телятина, тушёная в красном вине с луком, морковью, грибами и беконом. Подаётся с картофельным пюре с хреном.',
      descriptionEn: 'Veal braised in red wine with onions, carrots, mushrooms and bacon. Served with horseradish mashed potatoes.',
      price: 850,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat'],
      allergenSlugs: ['lactose', 'sulphites'],
    },
    {
      nameRu: 'Молот паладина',
      nameEn: "Paladin's Warhammer Chop",
      descriptionRu: 'Телячья отбивная на кости с пряным маслом и чесноком. Подаётся с жареной картошкой и свежим салатом.',
      descriptionEn: 'Veal chop on the bone with herb butter and garlic. Served with fried potatoes and fresh salad.',
      price: 920,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat'],
      allergenSlugs: ['lactose'],
    },
    {
      nameRu: 'Паэлья Подземелья',
      nameEn: 'Underdark Paella',
      descriptionRu: 'Чёрная паэлья с кальмарами, мидиями, креветками и курицей на рисе с чернилами каракатицы и пряными травами.',
      descriptionEn: 'Black paella with squid, mussels, prawns and chicken, made with squid ink rice and herbs.',
      price: 980,
      categorySlug: 'food',
      tagSlugs: ['hot', 'meat', 'spicy'],
      allergenSlugs: ['shellfish', 'molluscs', 'gluten'],
    },
    {
      nameRu: 'Медовый торт Махакама',
      nameEn: 'Mahakam Honey Cake',
      descriptionRu: 'Многослойный медовый торт с грецкими орехами и сметанным кремом. Классика гномьих пиршеств.',
      descriptionEn: 'Layered honey cake with walnuts and sour cream frosting. A classic of dwarven feasts.',
      price: 420,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs', 'nuts'],
    },
    {
      nameRu: 'Пряники Скеллиге',
      nameEn: 'Skellige Gingerbread',
      descriptionRu: 'Ароматные скеллигские пряники с мёдом, имбирём и глазурью из белого шоколада.',
      descriptionEn: 'Aromatic Skellige gingerbread with honey, ginger and white chocolate glaze.',
      price: 320,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Штрудель Трисс',
      nameEn: "Triss Merigold's Apple Strudel",
      descriptionRu: 'Яблочный штрудель с корицей, изюмом и миндальными лепестками. Подаётся с ванильным соусом.',
      descriptionEn: 'Apple strudel with cinnamon, raisins and almond flakes. Served with vanilla sauce.',
      price: 390,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs', 'nuts'],
    },
    {
      nameRu: 'Торт сирени и крыжовника',
      nameEn: "Yennefer's Lilac & Gooseberry Tart",
      descriptionRu: 'Нежный чизкейк с крыжовником, лепестками сирени и лимонной цедрой на песочной основе.',
      descriptionEn: 'Delicate cheesecake with gooseberries, lilac petals and lemon zest on a shortcrust base.',
      price: 450,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Пирог добрых ягод',
      nameEn: 'Goodberry Pie',
      descriptionRu: 'Открытый пирог с лесными ягодами, мёдом и тимьяном. Согревает душу и тело, словно заклинание друида.',
      descriptionEn: 'Open-faced forest berry pie with honey and thyme. Warms body and soul like a druidic spell.',
      price: 360,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Пудинг второго завтрака',
      nameEn: "Halfling's Second Breakfast Pudding",
      descriptionRu: 'Кремовый рисовый пудинг с ванилью, корицей и карамельным соусом. Подаётся тёплым.',
      descriptionEn: 'Creamy rice pudding with vanilla, cinnamon and caramel sauce. Served warm.',
      price: 310,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['lactose', 'eggs'],
    },
    {
      nameRu: 'Сокровище дракона',
      nameEn: "Dragon's Hoard Custard",
      descriptionRu: 'Золотистый ванильный крем с карамелью, хрустящим миндалём и листовым золотом.',
      descriptionEn: 'Golden vanilla custard with caramel, crunchy almonds and edible gold leaf.',
      price: 480,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['lactose', 'eggs', 'nuts'],
    },
    {
      nameRu: 'Чизкейк Лунного колодца',
      nameEn: 'Moonwell Cheesecake',
      descriptionRu: 'Эльфийский чизкейк с белым шоколадом, малиной и мятой на основе из орехового печенья.',
      descriptionEn: 'Elven cheesecake with white chocolate, raspberries and mint on a nut cookie base.',
      price: 440,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs', 'nuts'],
    },
    {
      nameRu: 'Шоколад Нильфгаарда',
      nameEn: 'Nilfgaardian Dark Chocolate Soufflé',
      descriptionRu: 'Тёплый шоколадный суфле с жидкой серединкой, подаётся с мороженым из чёрной смородины.',
      descriptionEn: 'Warm dark chocolate soufflé with a molten centre, served with blackcurrant ice cream.',
      price: 510,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Ореховая карамель гномов',
      nameEn: 'Dwarven Nut Brittle',
      descriptionRu: 'Хрустящая карамель с грецкими орехами, миндалём и морской солью. Идеальна к элю.',
      descriptionEn: 'Crunchy caramel with walnuts, almonds and sea salt. Perfect with ale.',
      price: 280,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['nuts'],
    },
    {
      nameRu: 'Зелье ведьмы',
      nameEn: "Witch's Potion",
      descriptionRu: 'Освежающий лимонад на основе сиропа бузины, лайма, мяты и содовой. Подаётся со льдом и веточкой розмарина.',
      descriptionEn: 'Refreshing elderflower lemonade with lime, mint and soda. Served with ice and rosemary sprig.',
      price: 280,
      categorySlug: 'drink',
      tagSlugs: ['non-alcoholic'],
      allergenSlugs: [],
    },
    {
      nameRu: 'Медовуха Махакама',
      nameEn: 'Mahakam Mead',
      descriptionRu: 'Домашняя медовуха с корицей, гвоздикой и апельсиновой цедрой. Подаётся горячей или холодной.',
      descriptionEn: 'Homemade mead with cinnamon, cloves and orange zest. Served hot or cold.',
      price: 320,
      categorySlug: 'drink',
      tagSlugs: ['alcohol', 'sweet'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Слёзы эльфа',
      nameEn: "Elven Tears",
      descriptionRu: 'Просекко с добавлением сиропа из бузины и ягод годжи. Игристое, освежающее, с ягодным ароматом.',
      descriptionEn: 'Prosecco with elderflower syrup and goji berries. Sparkling and refreshing with berry aroma.',
      price: 450,
      categorySlug: 'drink',
      tagSlugs: ['alcohol'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Кровь нечисти',
      nameEn: "Fiend's Blood",
      descriptionRu: 'Коктейль на основе виски, вишнёвого ликёра, гранатового сока и пряных биттеров. Крепкий, терпкий и тёмный.',
      descriptionEn: 'Cocktail with whisky, cherry liqueur, pomegranate juice and spiced bitters. Strong, tart and dark.',
      price: 550,
      categorySlug: 'drink',
      tagSlugs: ['alcohol', 'spicy'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Белая ведьма',
      nameEn: 'White Witch',
      descriptionRu: 'Коктейль на основе белого рома, кокосового молока, лайма и ванильного сиропа. Нежный, сладкий, тропический.',
      descriptionEn: 'Cocktail with white rum, coconut milk, lime and vanilla syrup. Smooth, sweet and tropical.',
      price: 480,
      categorySlug: 'drink',
      tagSlugs: ['alcohol', 'sweet'],
      allergenSlugs: ['lactose', 'sulphites'],
    },
    {
      nameRu: 'Чёрная магия',
      nameEn: 'Black Magic',
      descriptionRu: 'Коктейль из водки, активированного угля, сиропа из чёрной смородины и сока лайма. Сервируется со свежими ягодами.',
      descriptionEn: 'Cocktail with vodka, activated charcoal, blackcurrant syrup and lime juice. Served with fresh berries.',
      price: 500,
      categorySlug: 'drink',
      tagSlugs: ['alcohol'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Взгляд ледяного дракона',
      nameEn: "White Dragon's Gaze",
      descriptionRu: 'Мятно-лимонный чайный коктейль с добавлением водки, мёда и имбиря. Освежающий и согревающий одновременно.',
      descriptionEn: 'Mint-lemon tea cocktail with vodka, honey and ginger. Refreshing and warming at the same time.',
      price: 420,
      categorySlug: 'drink',
      tagSlugs: ['alcohol', 'sweet'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Нектар мантикоры',
      nameEn: "Manticore's Nectar",
      descriptionRu: 'Свежевыжатый апельсиновый сок с добавлением манго, имбиря и пряных трав. Бодрящий и яркий.',
      descriptionEn: 'Freshly squeezed orange juice with mango, ginger and spices. Invigorating and bright.',
      price: 290,
      categorySlug: 'drink',
      tagSlugs: ['non-alcoholic'],
      allergenSlugs: [],
    },
    {
      nameRu: 'Фейерверк',
      nameEn: 'Fireworks',
      descriptionRu: 'Коктейль из джина, лимонного сока, сиропа лайма и содовой с добавлением съедобного блеска. Подаётся со слайсами цитрусовых.',
      descriptionEn: 'Cocktail with gin, lemon juice, lime syrup and soda with edible glitter. Served with citrus slices.',
      price: 530,
      categorySlug: 'drink',
      tagSlugs: ['alcohol'],
      allergenSlugs: ['sulphites'],
    },
    {
      nameRu: 'Лунный свет',
      nameEn: 'Moonlight',
      descriptionRu: 'Горячий шоколад на кокосовом молоке с корицей, ванилью и щепоткой перца чили. Подаётся с маршмеллоу.',
      descriptionEn: 'Hot chocolate with coconut milk, cinnamon, vanilla and a pinch of chilli. Served with marshmallows.',
      price: 350,
      categorySlug: 'drink',
      tagSlugs: ['non-alcoholic', 'sweet', 'spicy'],
      allergenSlugs: ['lactose'],
    },
  ]

  for (let i = 0; i < dishes.length; i++) {
    const d = dishes[i]
    await prisma.dish.create({
      data: {
        nameRu: d.nameRu,
        nameEn: d.nameEn,
        descriptionRu: d.descriptionRu,
        descriptionEn: d.descriptionEn,
        price: d.price,
        images: getDishImages(i),
        category: { connect: { slug: d.categorySlug } },
        tags: { connect: d.tagSlugs.map((slug) => ({ slug })) },
        allergens: { connect: d.allergenSlugs.map((slug) => ({ slug })) },
      },
    })
  }

  const newsItems = [
    {
      slug: 'otkrytie-sezona',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Открытие сезона',
      titleEn: 'Season Opening',
      shortDescriptionRu: 'Таверна снова принимает гостей после зимней передышки.',
      shortDescriptionEn: 'The tavern welcomes guests again after the winter break.',
      bodyRu: '## Сезон приключений открыт\n\nЛысый Гусь распахнул двери и снова наполнился смехом, звоном кубиков и ароматом медовухи. В этом сезоне мы обновили меню, расширили карту зала и добавили новые вечера с мастерами.\n\n**Что ждёт гостей:**\n- живая музыка по выходным\n- тематические ужины\n- бронирование столов онлайн\n\nПриходите целой партией — стол лучше брать заранее.',
      bodyEn: '## Adventure season is open\n\nThe Bald Goose has opened its doors again, filled with laughter, rolling dice and the scent of mead. This season we refreshed the menu, expanded the hall map and added new evenings with game masters.\n\n**What awaits guests:**\n- live music on weekends\n- themed dinners\n- online table booking\n\nCome with your whole party — tables are best reserved early.',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-10'),
    },
    {
      slug: 'novye-deserty',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Новые десерты',
      titleEn: 'New Desserts',
      shortDescriptionRu: 'В меню появились пряники Скеллиге и медовый торт Махакама.',
      shortDescriptionEn: 'Skellige gingerbread and Mahakam honey cake join the menu.',
      bodyRu: '## Сладкая витрина обновлена\n\nШеф-повар таверны представил новую линейку десертов в духе северных сказаний и гномьих пиров.\n\n> Пряники Скеллиге — с имбирём, мёдом и белой глазурью.\n> Медовый торт Махакама — многослойный, с орехами и сметанным кремом.\n\nИдеально к чаю после долгой D&D-сессии.',
      bodyEn: '## The sweet counter has been refreshed\n\nOur chef unveiled a new dessert line inspired by northern ballads and dwarven feasts.\n\n> Skellige gingerbread — with ginger, honey and white glaze.\n> Mahakam honey cake — layered, with nuts and sour cream frosting.\n\nPerfect with tea after a long D&D session.',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-11'),
    },
    {
      slug: 'vecher-dnd',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Вечер D&D',
      titleEn: 'D&D Night',
      shortDescriptionRu: 'Каждый четверг в Таверне — открытый стол для искателей приключений.',
      shortDescriptionEn: 'Every Thursday in the Tavern — an open table for adventurers.',
      bodyRu: '## Каждый четверг — бросок кубика\n\nВ **Таверне** собираются новички и бывалые игроки. Мастера ведут короткие one-shot сессии, а бармен наливает «Лунный свет» со скидкой участникам.\n\n1. Приходите к 19:00\n2. Берите с собой лист персонажа или создайте на месте\n3. Бронируйте место, если идёте большой группой',
      bodyEn: '## Every Thursday — roll the dice\n\nIn the **Tavern**, newcomers and veterans gather. Masters run short one-shot sessions, and the bartender pours Moonlight with a discount for participants.\n\n1. Arrive by 7:00 PM\n2. Bring a character sheet or create one on site\n3. Book a seat if you are coming as a large group',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-12'),
    },
    {
      slug: 'medovuha-v-bare',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Медовуха в баре',
      titleEn: 'Mead on Tap',
      shortDescriptionRu: 'Снова наливают легендарную медовуху Махакама.',
      shortDescriptionEn: 'Legendary Mahakam mead is on tap again.',
      bodyRu: '## Махакам снова в кружках\n\nГномьи пивовары прислали новую партию медовухи с корицей, гвоздикой и апельсиновой цедрой. Напиток подают **горячим** в холодные вечера и **холодным** в жару.\n\n*Совет бармена:* отлично сочетается с ореховой карамелью и пряниками.',
      bodyEn: '## Mahakam is back in the mugs\n\nDwarven brewers delivered a new batch of mead with cinnamon, cloves and orange zest. It is served **hot** on cold evenings and **cold** in the heat.\n\n*Bartender tip:* pairs wonderfully with nut brittle and gingerbread.',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-13'),
    },
    {
      slug: 'bron-stolov-onlayn',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Бронь столов онлайн',
      titleEn: 'Online Booking',
      shortDescriptionRu: 'Теперь можно выбрать стол на интерактивной карте зала.',
      shortDescriptionEn: 'You can now pick a table on the interactive hall map.',
      bodyRu: '## Бронируйте стол не выходя из таверни... почти\n\nНа сайте появилась карта зала с живыми столами, зонами и выбором мастера. Можно заранее заказать блюда и оплатить бронь онлайн.\n\n- выберите дату и время\n- укажите число гостей\n- кликните по свободному столу на карте\n\nТак проще собрать отряд без суеты у входа.',
      bodyEn: '## Book a table without leaving the tavern... almost\n\nThe website now features a hall map with live tables, zones and master selection. You can pre-order dishes and pay for your booking online.\n\n- choose date and time\n- set the number of guests\n- click a free table on the map\n\nMuch easier to gather your party without chaos at the door.',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-14'),
    },
    {
      slug: 'letniy-dvor',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Летний двор',
      titleEn: 'Summer Courtyard',
      shortDescriptionRu: 'Терраса открыта для бронирования на закатных вечерах.',
      shortDescriptionEn: 'The terrace is open for booking on sunset evenings.',
      bodyRu: '## Двор ждёт летних вечеров\n\nЗона **Двор** снова доступна для брони. Под фонарями удобно играть в настолки, пить безалкогольные зелья и слушать баллады со сцены.\n\nСтолы на 2–4 гостя. Для больших компаний рекомендуем Чертог.',
      bodyEn: '## The courtyard awaits summer evenings\n\nThe **Courtyard** zone is available again. Under the lanterns it is perfect for board games, non-alcoholic potions and ballads from the stage.\n\nTables for 2–4 guests. For larger groups we recommend the Great Hall.',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-15'),
    },
    {
      slug: 'nedelya-vedmak',
      type: 'NEWS',
      status: 'PUBLISHED',
      titleRu: 'Неделя ведьмака',
      titleEn: 'Witcher Week',
      shortDescriptionRu: 'Скидка на тематические блюда и напитки недели.',
      shortDescriptionEn: 'Discount on themed dishes and drinks of the week.',
      bodyRu: '## Охота на скидки\n\nВесь недельный цикл меню посвящён ведьмаковской эстетике: **Котёл ведьмака**, **Слёзы эльфа**, **Кровь нечисти** — со сниженной ценой.\n\nТакже мастера проводят one-shot сессии в мире монстров, контрактов и моральных дилемм.',
      bodyEn: '## Hunt for discounts\n\nThe weekly menu celebrates witcher aesthetics: **Witcher Cauldron**, **Elven Tears**, **Fiend Blood** — all at reduced prices.\n\nMasters also run one-shot sessions in a world of monsters, contracts and moral dilemmas.',
      startsAt: null,
      endsAt: null,
      publishedAt: new Date('2026-06-16'),
    },
    {
      slug: 'noch-skellige',
      type: 'PERFORMANCE',
      status: 'PUBLISHED',
      titleRu: 'Ночь Скеллиге',
      titleEn: 'Skellige Night',
      shortDescriptionRu: 'Folk-вечер с морскими песнями и барабанами в Таверне.',
      shortDescriptionEn: 'A folk evening with sea songs and drums in the Tavern.',
      bodyRu: '## Морской ветер на сцене\n\nВ **Таверне** прозвучат баллады Скеллиге: барабаны, скрипки и хоровые припевы. Начало в **19:30**, вход свободный для гостей с бронью.\n\nРекомендуем столы ближе к сцене — их видно на карте зала.',
      bodyEn: '## Sea wind on stage\n\nThe **Tavern** will host Skellige ballads: drums, fiddles and choral refrains. Starts at **7:30 PM**, free entry for guests with a reservation.\n\nWe recommend tables closer to the stage — visible on the hall map.',
      startsAt: new Date('2026-07-12T19:30:00'),
      endsAt: new Date('2026-07-12T22:30:00'),
      publishedAt: new Date('2026-06-19'),
    },
    {
      slug: 'balady-dandelion',
      type: 'PERFORMANCE',
      status: 'PUBLISHED',
      titleRu: 'Баллады Лютика',
      titleEn: 'Dandelion Ballads',
      shortDescriptionRu: 'Живой сет барда на сцене Чертога.',
      shortDescriptionEn: 'A live bard set on the Great Hall stage.',
      bodyRu: '## Лютик возвращается\n\nЛегендарный бард исполнит новые и старые баллады о рыцарях, драконах и несчастной любви. Вечер начнётся в **20:00** и продлится до полуночи.\n\n> Бронируйте стол заранее — на выступления места разбирают быстро.',
      bodyEn: '## Dandelion returns\n\nThe legendary bard will perform new and old ballads of knights, dragons and doomed romance. The evening starts at **8:00 PM** and runs until midnight.\n\n> Book your table early — performance nights fill up fast.',
      startsAt: new Date('2026-07-26T20:00:00'),
      endsAt: new Date('2026-07-26T23:00:00'),
      publishedAt: new Date('2026-06-21'),
    },
    {
      slug: 'troll-na-arene',
      type: 'MONSTER',
      status: 'PUBLISHED',
      titleRu: 'Тролль на арене',
      titleEn: 'Troll on Arena',
      shortDescriptionRu: 'Командная D&D-сессия против тролля для отрядов 4–6 героев.',
      shortDescriptionEn: 'A team D&D session against a troll for parties of 4–6 heroes.',
      bodyRu: '## Тролль вышел на арену\n\nМастер ведёт боевую сессию для команд, готовых к тактике, ловушкам и хитрому регeneration. Уровень персонажей: 5–7.\n\n**Начало:** 18:00\n**Длительность:** 3 часа\n\nВозьмите огонь, кислоту и хорошее чувство юмора.',
      bodyEn: '## The troll enters the arena\n\nA master runs a combat session for teams ready for tactics, traps and nasty regeneration. Character levels: 5–7.\n\n**Start:** 6:00 PM\n**Duration:** 3 hours\n\nBring fire, acid and a good sense of humor.',
      startsAt: new Date('2026-07-15T18:00:00'),
      endsAt: new Date('2026-07-15T21:00:00'),
      publishedAt: new Date('2026-06-23'),
    },
    {
      slug: 'ohota-vasilisk',
      type: 'MONSTER',
      status: 'PUBLISHED',
      titleRu: 'Охота на василиска',
      titleEn: 'Basilisk Hunt',
      shortDescriptionRu: 'Квест с зеркалами, ловушками и опасным взглядом.',
      shortDescriptionEn: 'A quest with mirrors, traps and a deadly gaze.',
      bodyRu: '## Не смотри ему в глаза\n\nКомандный квест для опытных игроков. Нужны зеркала, верёвки и хотя бы один персонаж с высоким спасброском.\n\nМастер подготовил карту подземелья и несколько способов пережить встречу с василиском.',
      bodyEn: '## Do not meet its gaze\n\nA team quest for experienced players. Mirrors, ropes and at least one character with a solid saving throw are recommended.\n\nThe master prepared a dungeon map and several ways to survive the basilisk encounter.',
      startsAt: new Date('2026-07-22T17:00:00'),
      endsAt: new Date('2026-07-22T20:00:00'),
      publishedAt: new Date('2026-06-24'),
    },
    {
      slug: 'drakonenok-arena',
      type: 'MONSTER',
      status: 'PUBLISHED',
      titleRu: 'Драконёнок на арене',
      titleEn: 'Whelp on Arena',
      shortDescriptionRu: 'Бой для новичков — первый шаг в мир арены.',
      shortDescriptionEn: 'A fight for newcomers — a first step into the arena.',
      bodyRu: '## Молодой дракон учится жару\n\nСессия для новичков: уровни 1–3, много подсказок, меньше смертей (но не обещаем). Идеально для первой игры в таверне.\n\nПосле боя — десерт со скидкой участникам.',
      bodyEn: '## A young dragon learns the heat\n\nA session for newcomers: levels 1–3, plenty of hints, fewer deaths (no promises though). Perfect for your first game at the tavern.\n\nAfter the fight — dessert at a discount for participants.',
      startsAt: new Date('2026-07-29T18:00:00'),
      endsAt: new Date('2026-07-29T20:00:00'),
      publishedAt: new Date('2026-06-25'),
    },
  ]

  for (let i = 0; i < newsItems.length; i++) {
    const news = newsItems[i]
    await prisma.news.create({
      data: {
        ...news,
        images: repeatNewsImages(i),
        type: news.type as 'NEWS' | 'PERFORMANCE' | 'MONSTER',
        status: news.status as 'PUBLISHED',
      },
    })
  }

  const passwordHash = await argon2.hash(TEST_PASSWORD)

  await prisma.user.create({
    data: {
      email: 'guest@baldgoose.ru',
      passwordHash,
      firstName: 'Герольд',
      secondName: 'Странник',
      phone: '+79001234567',
      role: 'USER',
      bonuses: 120,
    },
  })

  await prisma.user.create({
    data: {
      email: 'admin@baldgoose.ru',
      passwordHash,
      firstName: 'Регинальд',
      secondName: 'Хранитель',
      phone: '+79007654321',
      role: 'ADMIN',
    },
  })

  const masters = [
    {
      email: 'master1@baldgoose.ru',
      firstName: 'Торин',
      secondName: 'Пепельный',
      image: '/images/masters/master-1.webp',
      bio: 'Мастер подземелий, у которого улыбка всегда на два хода опережает сюжет — и вы узнаёте об этом слишком поздно. Его игры — это high fantasy с интригами, загадками и магией, где каждый NPC что-то скрывает, а каждый «безобидный» квест может обернуться проклятием на три поколения.',
    },
    {
      email: 'master2@baldgoose.ru',
      firstName: 'Лира',
      secondName: 'Полумесяц',
      image: '/images/masters/master-2.webp',
      bio: 'Мастер подземелий, которая говорит тише свечи — и от этого в подземелье становится холоднее. Её игры — это dark fantasy и хоррор с упором на атмосферу, моральный выбор и последствия, где факел может погаснуть в самый неподходящий момент, а тишина за дверью — это уже не атмосфера, а механика.',
    },
    {
      email: 'master3@baldgoose.ru',
      firstName: 'Моргрим',
      secondName: 'Каменный Щит',
      image: '/images/masters/master-3.webp',
      bio: 'Мастер подземелий, который смотрит на вашу броню как на тактическую задачу — и на прочность костей как на бонус к урону. Его игры — мрачные кампании с упором на расстановку сил, честные схватки и решения, после которых отряд либо славится в таверне, либо ищет нового целителя.',
    },
    {
      email: 'master4@baldgoose.ru',
      firstName: 'Александр',
      secondName: 'Дестроивович',
      image: '/images/masters/master-4.webp',
      bio: 'Мастер подземелий, который может раздавить кубик одной рукой — и ваш характер второй. Его игры — это тёмное фэнтези с упором на выживание, моральные дилеммы и эпичные битвы, где каждый бросок может стать последним.',
    },
  ]

  for (const master of masters) {
    await prisma.user.create({
      data: {
        ...master,
        passwordHash,
        role: 'MASTER',
      },
    })
  }

  await prisma.faq.createMany({
    data: [
      {
        titleRu: 'Как забронировать стол?',
        titleEn: 'How do I book a table?',
        descriptionRu: 'Откройте раздел **Бронирование**, выберите дату, время, число гостей и свободный стол на карте зала. После подтверждения можно добавить блюда и оплатить заказ онлайн.',
        descriptionEn: 'Open **Booking**, choose the date, time, number of guests and a free table on the hall map. After confirmation you can add dishes and pay online.',
      },
      {
        titleRu: 'Можно ли пригласить мастера?',
        titleEn: 'Can I invite a game master?',
        descriptionRu: 'Да. На шаге бронирования выберите мастера и тип сессии: короткая (oneshot) или длинная (кампания). Доступны только мастера, свободные в выбранное время.',
        descriptionEn: 'Yes. During booking, pick a master and session type: short (oneshot) or long (campaign). Only masters available at your selected time are shown.',
      },
      {
        titleRu: 'Когда вы работаете?',
        titleEn: 'What are your opening hours?',
        descriptionRu: 'Таверна открыта **ежедневно с 12:00 до 00:00**. Кухня принимает предзаказы к брони, бар работает до закрытия. Точное время сессий зависит от выбранного слота бронирования.',
        descriptionEn: 'The tavern is open **daily from 12:00 to 00:00**. The kitchen accepts pre-orders with reservations, and the bar runs until closing. Session times depend on your booking slot.',
      },
      {
        titleRu: 'Есть ли блюда без аллергенов?',
        titleEn: 'Do you have allergen-free options?',
        descriptionRu: 'В меню у каждого блюда указаны аллергены. Если нужен особый рацион, оставьте комментарий при бронировании или спросите официанта — мы подскажем подходящие позиции.',
        descriptionEn: 'Every menu item lists allergens. If you need a special diet, leave a note when booking or ask the staff — we will suggest suitable dishes.',
      },
    ],
  })

  const zones = [
    { slug: 'tavern', nameRu: 'Таверна', nameEn: 'Tavern', pricePerHour: 300 },
    { slug: 'vip', nameRu: 'Чертог', nameEn: 'Great Hall', pricePerHour: 800 },
    { slug: 'terrace', nameRu: 'Двор', nameEn: 'Courtyard', pricePerHour: 500 },
  ]

  for (const z of zones) {
    await prisma.zone.create({ data: z })
  }

  const tavern = await prisma.zone.findUniqueOrThrow({ where: { slug: 'tavern' } })
  const vip = await prisma.zone.findUniqueOrThrow({ where: { slug: 'vip' } })
  const terrace = await prisma.zone.findUniqueOrThrow({ where: { slug: 'terrace' } })

  const tables = [
    { number: 1, zoneId: tavern.id, capacity: 2, x: 9, y: 15 },
    { number: 2, zoneId: tavern.id, capacity: 4, x: 9, y: 40 },
    { number: 3, zoneId: tavern.id, capacity: 4, x: 55, y: 29 },
    { number: 4, zoneId: tavern.id, capacity: 6, x: 33, y: 30 },
    { number: 5, zoneId: vip.id, capacity: 4, x: 66, y: 14 },
    { number: 6, zoneId: vip.id, capacity: 8, x: 63, y: 46 },
    { number: 7, zoneId: terrace.id, capacity: 2, x: 22, y: 76 },
    { number: 8, zoneId: terrace.id, capacity: 4, x: 28, y: 56 },
    { number: 9, zoneId: terrace.id, capacity: 4, x: 28, y: 10 },
    { number: 10, zoneId: terrace.id, capacity: 4, x: 46, y: 48 },
    { number: 11, zoneId: terrace.id, capacity: 4, x: 64, y: 71 },
    { number: 12, zoneId: terrace.id, capacity: 4, x: 45, y: 70 },
  ]

  for (const t of tables) {
    await prisma.table.create({ data: t })
  }
}

main()
  .then(() => console.log('Seed completed'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
