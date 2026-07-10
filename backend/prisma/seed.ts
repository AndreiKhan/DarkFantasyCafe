import argon2 from 'argon2'
import { prisma } from '../src/db/prisma.js'

const TEST_PASSWORD = 'password123'

const DISH_VARIANTS: Record<number, number> = {
  1: 2, 2: 2, 3: 2, 4: 2,
  5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1,
  11: 2, 12: 2, 13: 2, 14: 2, 15: 2, 16: 2,
  17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1,
  28: 2, 29: 2, 30: 2, 31: 2, 32: 2, 33: 2,
  34: 2, 35: 2, 36: 2, 37: 2, 38: 2,
  39: 3, 40: 2, 41: 2, 42: 2, 43: 2,
  44: 1, 45: 2, 46: 2, 47: 2,
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

const MASTER_PRICE_ONESHOT = 2000
const MASTER_PRICE_CAMPAIGN = 5000

function seedSlot(date: string, start: string, durationMin: number) {
  const startsAt = new Date(`${date}T${start}:00`)
  const endsAt = new Date(startsAt.getTime() + durationMin * 60_000)
  return { startsAt, endsAt, hours: durationMin / 60 }
}

type SeedReservation = {
  userEmail: string
  tableNumber: number
  date: string
  start: string
  durationMin: number
  guests: number
  createdAt: string
  masterEmail?: string
  masterSessionType?: 'ONESHOT' | 'CAMPAIGN'
  dishes?: { dishIndex: number; quantity: number }[]
}

const SEED_RESERVATIONS: SeedReservation[] = [
  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-06-05', start: '14:00', durationMin: 120, guests: 2, createdAt: '2026-06-03T09:15:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 3, date: '2026-06-07', start: '18:00', durationMin: 90, guests: 4, createdAt: '2026-06-03T11:40:00', dishes: [{ dishIndex: 0, quantity: 2 }] },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 2, date: '2026-06-12', start: '13:00', durationMin: 90, guests: 3, createdAt: '2026-06-10T08:30:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 4, date: '2026-06-14', start: '15:00', durationMin: 120, guests: 5, createdAt: '2026-06-10T10:00:00', dishes: [{ dishIndex: 1, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 5, date: '2026-06-15', start: '19:00', durationMin: 120, guests: 4, createdAt: '2026-06-10T12:45:00', masterEmail: 'master1@baldgoose.ru', masterSessionType: 'ONESHOT' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 10, date: '2026-06-17', start: '20:00', durationMin: 60, guests: 2, createdAt: '2026-06-10T18:55:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 6, date: '2026-06-20', start: '18:00', durationMin: 120, guests: 6, createdAt: '2026-06-18T09:00:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 9, date: '2026-06-21', start: '14:00', durationMin: 90, guests: 3, createdAt: '2026-06-18T11:30:00', dishes: [{ dishIndex: 2, quantity: 1 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 12, date: '2026-06-23', start: '21:00', durationMin: 60, guests: 2, createdAt: '2026-06-18T17:40:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-06-27', start: '12:00', durationMin: 60, guests: 2, createdAt: '2026-06-25T08:20:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 3, date: '2026-06-28', start: '13:30', durationMin: 90, guests: 4, createdAt: '2026-06-25T09:45:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 4, date: '2026-06-28', start: '18:00', durationMin: 180, guests: 6, createdAt: '2026-06-25T10:30:00', dishes: [{ dishIndex: 3, quantity: 2 }, { dishIndex: 5, quantity: 1 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 7, date: '2026-06-29', start: '15:00', durationMin: 90, guests: 2, createdAt: '2026-06-25T12:00:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 2, date: '2026-06-30', start: '21:00', durationMin: 60, guests: 2, createdAt: '2026-06-25T19:10:00', dishes: [{ dishIndex: 4, quantity: 1 }] },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-07-04', start: '13:00', durationMin: 120, guests: 2, createdAt: '2026-07-02T09:00:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 8, date: '2026-07-05', start: '17:00', durationMin: 90, guests: 3, createdAt: '2026-07-02T11:20:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 10, date: '2026-07-06', start: '18:30', durationMin: 120, guests: 4, createdAt: '2026-07-02T14:00:00', dishes: [{ dishIndex: 0, quantity: 1 }] },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 3, date: '2026-07-10', start: '12:30', durationMin: 60, guests: 2, createdAt: '2026-07-08T08:10:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 9, date: '2026-07-10', start: '14:00', durationMin: 90, guests: 3, createdAt: '2026-07-08T10:25:00', dishes: [{ dishIndex: 1, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 4, date: '2026-07-11', start: '19:00', durationMin: 120, guests: 4, createdAt: '2026-07-08T12:40:00', masterEmail: 'master3@baldgoose.ru', masterSessionType: 'ONESHOT' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 11, date: '2026-07-12', start: '16:00', durationMin: 120, guests: 4, createdAt: '2026-07-08T15:00:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-07-17', start: '12:00', durationMin: 60, guests: 2, createdAt: '2026-07-15T08:00:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 2, date: '2026-07-17', start: '13:00', durationMin: 90, guests: 3, createdAt: '2026-07-15T09:15:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 7, date: '2026-07-18', start: '14:30', durationMin: 90, guests: 2, createdAt: '2026-07-15T10:30:00', dishes: [{ dishIndex: 2, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 6, date: '2026-07-19', start: '19:30', durationMin: 120, guests: 6, createdAt: '2026-07-15T14:20:00', masterEmail: 'master4@baldgoose.ru', masterSessionType: 'CAMPAIGN' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 8, date: '2026-07-19', start: '21:00', durationMin: 60, guests: 2, createdAt: '2026-07-15T17:50:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 3, date: '2026-07-24', start: '15:00', durationMin: 90, guests: 4, createdAt: '2026-07-22T09:30:00', dishes: [{ dishIndex: 4, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 5, date: '2026-07-25', start: '18:00', durationMin: 120, guests: 4, createdAt: '2026-07-22T11:00:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 9, date: '2026-07-26', start: '20:00', durationMin: 90, guests: 3, createdAt: '2026-07-22T13:40:00', masterEmail: 'master1@baldgoose.ru', masterSessionType: 'ONESHOT' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 4, date: '2026-07-30', start: '19:30', durationMin: 180, guests: 5, createdAt: '2026-07-28T08:45:00', masterEmail: 'master1@baldgoose.ru', masterSessionType: 'ONESHOT' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-07-31', start: '14:00', durationMin: 120, guests: 2, createdAt: '2026-07-28T10:20:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 11, date: '2026-07-31', start: '16:00', durationMin: 90, guests: 4, createdAt: '2026-07-28T12:55:00', dishes: [{ dishIndex: 6, quantity: 1 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 2, date: '2026-07-31', start: '21:00', durationMin: 60, guests: 2, createdAt: '2026-07-28T15:30:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 2, date: '2026-08-06', start: '16:00', durationMin: 90, guests: 3, createdAt: '2026-08-04T09:10:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 5, date: '2026-08-07', start: '18:00', durationMin: 120, guests: 4, createdAt: '2026-08-04T11:25:00', dishes: [{ dishIndex: 7, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 8, date: '2026-08-08', start: '20:00', durationMin: 90, guests: 4, createdAt: '2026-08-04T13:40:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 10, date: '2026-08-09', start: '18:30', durationMin: 120, guests: 4, createdAt: '2026-08-04T15:55:00', masterEmail: 'master2@baldgoose.ru', masterSessionType: 'ONESHOT' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-08-13', start: '12:00', durationMin: 90, guests: 2, createdAt: '2026-08-11T08:30:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 3, date: '2026-08-13', start: '15:00', durationMin: 120, guests: 4, createdAt: '2026-08-11T10:00:00', dishes: [{ dishIndex: 0, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 6, date: '2026-08-14', start: '17:30', durationMin: 90, guests: 5, createdAt: '2026-08-11T11:45:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 4, date: '2026-08-16', start: '20:00', durationMin: 120, guests: 5, createdAt: '2026-08-11T15:10:00', masterEmail: 'master3@baldgoose.ru', masterSessionType: 'ONESHOT' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 11, date: '2026-08-16', start: '21:30', durationMin: 60, guests: 3, createdAt: '2026-08-11T18:40:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 7, date: '2026-08-20', start: '12:30', durationMin: 120, guests: 2, createdAt: '2026-08-18T09:00:00', dishes: [{ dishIndex: 3, quantity: 1 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 5, date: '2026-08-21', start: '17:00', durationMin: 90, guests: 3, createdAt: '2026-08-18T11:15:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 2, date: '2026-08-22', start: '19:30', durationMin: 120, guests: 3, createdAt: '2026-08-18T14:30:00' },

  { userEmail: 'guest@baldgoose.ru', tableNumber: 1, date: '2026-08-27', start: '14:00', durationMin: 120, guests: 2, createdAt: '2026-08-25T08:20:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 3, date: '2026-08-27', start: '16:30', durationMin: 90, guests: 4, createdAt: '2026-08-25T10:40:00', dishes: [{ dishIndex: 5, quantity: 2 }] },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 10, date: '2026-08-28', start: '18:00', durationMin: 120, guests: 4, createdAt: '2026-08-25T12:55:00', masterEmail: 'master4@baldgoose.ru', masterSessionType: 'ONESHOT' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 6, date: '2026-08-29', start: '20:00', durationMin: 90, guests: 6, createdAt: '2026-08-25T15:10:00' },
  { userEmail: 'guest@baldgoose.ru', tableNumber: 9, date: '2026-08-30', start: '15:30', durationMin: 90, guests: 3, createdAt: '2026-08-25T17:30:00', dishes: [{ dishIndex: 2, quantity: 1 }, { dishIndex: 4, quantity: 1 }] },
]

async function seedConfirmedReservations(
  usersByEmail: Record<string, string>,
  tableRows: Awaited<ReturnType<typeof prisma.table.findMany>>,
  dishRows: Awaited<ReturnType<typeof prisma.dish.findMany>>,
  masterUsers: Awaited<ReturnType<typeof prisma.user.findMany>>,
  zonesById: Record<string, { nameRu: string; nameEn: string; pricePerHour: number }>,
) {
  const tableByNumber = Object.fromEntries(tableRows.map((table) => [table.number, table]))
  const masterByEmail = Object.fromEntries(masterUsers.map((user) => [user.email, user]))

  for (let index = 0; index < SEED_RESERVATIONS.length; index++) {
    const entry = SEED_RESERVATIONS[index]!
    const userId = usersByEmail[entry.userEmail]
    const table = tableByNumber[entry.tableNumber]

    if (!userId || !table) {
      throw new Error(`Seed reservation ${index}: user or table not found`)
    }

    const { startsAt, endsAt, hours } = seedSlot(entry.date, entry.start, entry.durationMin)
    const zoneRow = zonesById[table.zoneId]

    if (!zoneRow) {
      throw new Error(`Seed reservation ${index}: zone not found`)
    }

    const items: {
      type: 'TIME' | 'DISH' | 'EXTRA'
      dishId: string | null
      titleRu: string
      titleEn: string
      unitPrice: number
      quantity: number
    }[] = [
      {
        type: 'TIME',
        dishId: null,
        titleRu: `Стол «${zoneRow.nameRu}», ${hours} ч`,
        titleEn: `${zoneRow.nameEn} table, ${hours}h`,
        unitPrice: Math.round(zoneRow.pricePerHour * hours),
        quantity: 1,
      },
    ]

    for (const line of entry.dishes ?? []) {
      const dish = dishRows[line.dishIndex]
      if (!dish) {
        throw new Error(`Seed reservation ${index}: dish index ${line.dishIndex} not found`)
      }
      items.push({
        type: 'DISH',
        dishId: dish.id,
        titleRu: dish.nameRu,
        titleEn: dish.nameEn,
        unitPrice: dish.price,
        quantity: line.quantity,
      })
    }

    if (entry.masterEmail && entry.masterSessionType) {
      const master = masterByEmail[entry.masterEmail]
      if (!master) {
        throw new Error(`Seed reservation ${index}: master not found`)
      }
      const campaign = entry.masterSessionType === 'CAMPAIGN'
      const masterName = `${master.firstName} ${master.secondName}`.trim()
      items.push({
        type: 'EXTRA',
        dishId: null,
        titleRu: `Мастер: ${masterName} (${campaign ? 'кампания' : 'короткая'})`,
        titleEn: `Master: ${masterName} (${campaign ? 'campaign' : 'oneshot'})`,
        unitPrice: campaign ? MASTER_PRICE_CAMPAIGN : MASTER_PRICE_ONESHOT,
        quantity: 1,
      })
    }

    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    await prisma.reservation.create({
      data: {
        userId,
        tableId: table.id,
        masterId: entry.masterEmail ? masterByEmail[entry.masterEmail]?.id ?? null : null,
        masterSessionType: entry.masterSessionType ?? null,
        startsAt,
        endsAt,
        guests: entry.guests,
        status: 'CONFIRMED',
        totalAmount,
        createdAt: new Date(entry.createdAt),
        items: { create: items },
        payment: {
          create: {
            amount: totalAmount,
            status: 'SUCCEEDED',
            providerPaymentId: `seed-reservation-${index + 1}`,
          },
        },
      },
    })
  }
}

async function main() {
  const usersAlreadySeeded = await prisma.user.count()
  if (usersAlreadySeeded > 0) {
    console.log('Seed skipped: data already exists')
    return
  }

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
      nameRu: 'Скума',
      nameEn: 'Skooma',
      descriptionRu: 'Каджит клянётся лунам: он только посмотрит — и украдёт. Держите ближе к себе, пока ловкие лапы не унесли это лакомство.',
      descriptionEn: 'The Khajiit swears to the moons he will only look — and steal. Keep it close before clever paws carry off this treat.',
      price: 600,
      categorySlug: 'drink',
      tagSlugs: ['sweet'],
      allergenSlugs: [],
    },
    {
      nameRu: 'Торт - это ложь',
      nameEn: 'The Cake Is a Lie',
      descriptionRu: 'Он прошёл все испытания и всё ещё вкусен — значит это не ложь, а наука. Осторожно: при приближении вилки запускается протокол «ещё кусочек».',
      descriptionEn: 'It survived every test and still tastes great — so it is not a lie, it is science. Warning: approaching with a fork triggers the "one more bite" protocol.',
      price: 1000,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Сладкий рулет',
      nameEn: 'Sweet Roll',
      descriptionRu: 'Украли ваш рулет? Мы принесём новый быстрее, чем стражник успеет сказать «мне попала стрела в колено» — ещё тёплый и с щедрой глазурью.',
      descriptionEn: 'Someone stole your roll? We will bring a fresh one before the guard can say "I used to be an adventurer" — still warm and generously glazed.',
      price: 550,
      categorySlug: 'dessert',
      tagSlugs: ['sweet', 'vegetarian'],
      allergenSlugs: ['gluten', 'lactose', 'eggs'],
    },
    {
      nameRu: 'Ядер-кола',
      nameEn: 'Nuka-Cola',
      descriptionRu: 'Прямиком из ядерных пустошей Калифорнии — бодрящий глоток надежды в каждом пузырьке. Ледяная, без радиации и с зарядом приключений.',
      descriptionEn: 'Straight from the nuclear wastes of California — a refreshing sip of hope in every bubble. Ice-cold, radiation-free and charged with adventure.',
      price: 570,
      categorySlug: 'drink',
      tagSlugs: ['non-alcoholic', 'sweet'],
      allergenSlugs: [],
    },
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

  const usersByEmail = Object.fromEntries(
    (await prisma.user.findMany({
      where: {
        email: {
          in: [
            'guest@baldgoose.ru',
            'admin@baldgoose.ru',
            'master1@baldgoose.ru',
            'master2@baldgoose.ru',
            'master3@baldgoose.ru',
            'master4@baldgoose.ru',
          ],
        },
      },
    })).map((user) => [user.email, user.id]),
  )

  const characters = [
    {
      ownerEmail: 'guest@baldgoose.ru',
      name: 'Эйфорн Костяной Мост',
      level: 4,
      race: 'human',
      class: 'ranger',
      subclass: 'hunter',
      background: 'outlander',
      alignment: 'neutral-good',
      appearance: 'Худощавый мужчина лет тридцати с обветренным лицом и внимательным взглядом. Длинные светло-русые волосы собраны в хвост, на щеке — старый шрам от когтя. Носит потёртый зелёный плащ, под которым видна кожаная броня с вышитыми рунами дорог.',
      bio: 'Эйфорн родился в семье речных перевозчиков и с детства знал каждую тропу между деревнями и торговыми трактами. Когда мост через ущелье Костяной Ручей рухнул во время нашествия бандитов, он три дня провёл в лесу, выводя к обходной тропе людей, которых другие уже списали. С тех пор его прозвали Костяным Мостом — тем, кто находит путь там, где его, кажется, нет.\n\nОн не гонится за славой и не ищет драконов ради драконов. Эйфорн берёт контракты на сопровождение караванов, поиск пропавших в лесах и разведку опасных земель. В таверне «Лысый Гусь» его часто можно увидеть за столом у окна: он чинит стрелы, записывает заметки о местности и прислушивается к разговорам — не из любопытства, а потому что знает: следующая карта начинается с чужой истории.',
      strength: 12,
      dexterity: 16,
      constitution: 14,
      intelligence: 11,
      wisdom: 15,
      charisma: 10,
      hitPoints: 32,
      armorClass: 15,
      speed: 30,
      spells: ['hunters-mark', 'cure-wounds', 'goodberry'],
      languages: ['common', 'elvish', 'sylvan'],
      skills: ['survival', 'nature', 'perception', 'stealth', 'animal-handling'],
      equipment: [
        'Кожаный доспех с нашивками из шкур лесных зверей',
        'Составной лук из ивы и рога, подаренный отцом',
        'Колчан с двенадцатью стрелами (шесть обычных, четыре серебряных, две с меткой Эйфорна)',
        'Пара коротких мечей в кожаных ножнах',
        'Плащ путешественника с капюшоном',
        'Набор лекаря',
        'Компас и потрескавшаяся карта северных трактов',
      ],
      inventory: [
        'Мешок с сушёным мясом и орехами на неделю',
        'Фляга с настойкой можжевельника',
        'Верёвка из лёнта (15 м), крюк и блок',
        'Кремень, огниво и свечи в восковой бумаге',
        'Дневник с зарисовками троп и пометками о стаях волков',
        'Серебряный медальон с изображением моста — память о родном доме',
        'Запасной комплект шнурков, иголок и ниток',
        'Мешочек с травами для отваров от простуды',
      ],
    },
    {
      ownerEmail: 'guest@baldgoose.ru',
      name: 'Регулус Хранитель Порога',
      level: 6,
      race: 'human',
      class: 'paladin',
      subclass: 'devotion',
      background: 'acolyte',
      alignment: 'lawful-good',
      appearance: 'Высокий, широкоплечий мужчина с седеющими висками и спокойными серыми глазами. Коротко стриженные тёмные волосы, аккуратная борода. Носит полированные латные доспехи без лишнего украшения, на плече — белый плащ с вышитым символом порога и свечи. Говорит размеренно, будто каждое слово проходит проверку на правду.',
      bio: 'Регулус служил в храме Порога — не божеству войны, а принципу: «Пусть каждый, кто ищет укрытия, найдёт дверь». Двадцать лет он сопровождал паломников, судил споры купцов и выводил из руин поселения после налётов нежити. Когда таверна «Лысый Гусь» стала местом, где пересекаются пути искателей приключений, Регинальд Хранитель — уже не молодой — попросил его взять на себя роль живого напоминания о том, что сила без милости превращается в тиранию.\n\nРегулус Хранитель Порога — это его «игровое» имя, под которым он иногда садится за стол с новичками и показывает, как держать щит так, чтобы за ним поместилась не только партия, но и честь. Он не любит хвастовство и не терпит жестокости ради смеха. В бою спокоен; вне боя — первым подставляет плечо уставшему и последним выходит из зала, проверяя, не осталось ли за столом забытых вещей.',
      strength: 16,
      dexterity: 10,
      constitution: 14,
      intelligence: 12,
      wisdom: 13,
      charisma: 16,
      hitPoints: 52,
      armorClass: 18,
      speed: 30,
      spells: ['bless', 'command', 'cure-wounds', 'revivify', 'protection-from-evil-and-good'],
      languages: ['common', 'celestial', 'dwarvish'],
      skills: ['athletics', 'insight', 'persuasion', 'religion', 'medicine'],
      equipment: [
        'Комплект латных доспехов с символом Порога на нагруднике',
        'Длинный меч «Равновесие» с рукоятью из белого металла',
        'Щит в форме арки — «Дверь в бою»',
        'Комплект священного символа на цепи',
        'Набор для молитвы: свечи, ладан, маленький колокольчик',
        'Плащ белого льна с серебряной вышивкой',
      ],
      inventory: [
        'Свитки с записями обрядов и молитв на двух языках',
        'Пять флаконов святой воды в деревянном футляре',
        'Запасные перчатки и ремни для лат',
        'Мешок с серебряными монетами для помощи нуждающимся',
        'Письмо от настоятеля храма с благословением',
        'Толстая книга «О путях милости» с закладками',
        'Сухие пайки и фляга воды',
        'Мел для отметки безопасных троп у входов в подземелья',
      ],
    },
    {
      ownerEmail: 'master1@baldgoose.ru',
      name: 'Мирэль Сумрачная',
      level: 7,
      race: 'half-elf',
      class: 'wizard',
      subclass: 'evocation',
      background: 'sage',
      alignment: 'neutral',
      appearance: 'Стройная женщина с серебристыми глазами и тёмными волосами, собранными в сложную косу с вплетёнными серебряными нитями. На левой руке — сеть тонких шрамов от магического ожога. Носит тёмно-синюю мантию с вышитыми созвездиями и пояс с карманами для компонентов. Говорит тихо, но каждое слово звучит так, будто за ним стоит целая библиотека.',
      bio: 'Мирэль выросла в архиве Гильдии Звёздных Карт — полуэльфийка, полностью погружённая в книги. Её наставник исчез в портале, который она случайно открыла в шестнадцать лет, и с тех пор она ищет не только его, но и ответ на вопрос: можно ли контролировать силу, не став её рабом.\n\nОна специализируется на воплощении, но презирает бездумное уничтожение. Мирэль собирает свитки, торгует информацией и ведёт записи о каждой магической аномалии, встреченной в кампаниях Торина. Её цель — не власть, а понимание. В интригах она опаснее меча: замечает ложь по интонации, а по пергаменту — по почерку.',
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 18,
      wisdom: 13,
      charisma: 12,
      hitPoints: 38,
      armorClass: 14,
      speed: 30,
      spells: ['fireball', 'magic-missile', 'shield', 'detect-magic', 'counterspell', 'misty-step', 'scorching-ray'],
      languages: ['common', 'elvish', 'draconic', 'celestial'],
      skills: ['arcana', 'history', 'investigation', 'insight', 'perception'],
      equipment: [
        'Мантия архивиста с зачарованными карманами',
        'Посох из чёрного дерева с кристаллом на навершии',
        'Компонентная сумка: сера, кварц, кусочки меха, капли росы',
        'Spellbook «Сумрачный кодекс» в кожаном переплёте',
        'Кинжал для ритуалов и резки пергамента',
        'Очки с линзами из дымчатого стекла',
      ],
      inventory: [
        'Три свитка: «Обнаружение магии», «Порталы и их якоря», «Печать тишины»',
        'Коллекция обрывков карт звёздного неба',
        'Чернильница, перья и запас пергамента',
        'Серебряный ключ без замочной скважины — семейная реликвия',
        'Флакон с пылью фей для ритуалов',
        'Запечатанный конверт с адресом, который она не решается открыть',
        'Сушёные грибы и чай из лепестков лунной сирени',
      ],
    },
    {
      ownerEmail: 'master1@baldgoose.ru',
      name: 'Кассандр из Каэри',
      level: 5,
      race: 'tiefling',
      class: 'bard',
      subclass: 'lore',
      background: 'charlatan',
      alignment: 'chaotic-neutral',
      appearance: 'Изящный тифлинг с бронзовой кожей, изогнутыми рогами и золотистыми глазами без зрачков. Хвост с кисточкой на конце двигается в такт речи. Предпочитает бархатный камзол бордового цвета, множество колец и шарф, который меняет оттенок в зависимости от настроения (магия или обман — никто не знает).',
      bio: 'Кассандр утверждает, что родился в Каэри — города, которого нет на большинстве карт. Возможно, он просто отличный лжец. Возможно, нет. Он собирает секреты так же охотно, как другие собирают монеты: с улыбкой, тостом и песней, после которой собеседник не помнит, что именно рассказал.\n\nНа столах Торина Кассандр — катализатор интриг. Он знает, кто кому должен, кто кого предал и где спрятан ключ от комнаты, о которой не говорят вслух. Он не убивает, если можно унизить. Не врёт напрямую — перефразирует правду так, что она служит его сюжету. Его лояльность покупается, но дорого: интересной историей.',
      strength: 10,
      dexterity: 15,
      constitution: 12,
      intelligence: 14,
      wisdom: 11,
      charisma: 18,
      hitPoints: 33,
      armorClass: 14,
      speed: 30,
      spells: ['charm-person', 'suggestion', 'invisibility', 'hold-person', 'detect-magic'],
      languages: ['common', 'infernal', 'elvish', 'goblin'],
      skills: ['deception', 'persuasion', 'performance', 'history', 'sleight-of-hand', 'insight'],
      equipment: [
        'Лютня «Серебряный язык» с резной декой',
        'Камзол с потайными карманами',
        'Колода карт «Каэри» — каждая с другим символом',
        'Набор маскарадных масок (три штуки)',
        'Рапира с тонким клинком',
        'Кольцо-печатка без герба',
      ],
      inventory: [
        'Блокнот с шифром из музыкальных нот',
        'Пять флаконов дорогого духов — для отвода глаз и носа',
        'Мешочек с фальшивыми монетами и одной настоящей золотой',
        'Письма без подписи от трёх разных адресатов',
        'Свечи, воск и штампы для подделки печатей',
        'Флакон вина «Кровь заката»',
        'Зеркальце в серебряной оправе',
      ],
    },
    {
      ownerEmail: 'master2@baldgoose.ru',
      name: 'Вешенька',
      level: 6,
      race: 'elf',
      subrace: 'high-elf',
      class: 'rogue',
      subclass: 'thief',
      background: 'criminal',
      alignment: 'neutral-evil',
      appearance: 'Худая эльфийка с бледной кожей и чёрными волосами, стриженными неровно, будто ножом. Глаза тёмные, почти без блеска. На шее — тонкий шрам от верёвки. Двигается бесшумно; когда стоит неподвижно, кажется частью тени. Пахнет сыростью и дымом.',
      bio: 'Вешеньку вырастили в гильдии воров под городом, где свет факелов не доходил до потолка. Её настоящего имени никто не знает — «Вешенька» потому что первый «заказ» она выполнила, спрятавшись в чулане с вешалками и плащами жертвы.\n\nОна не монстр без причины: просто привыкла, что мир — это цепочка дверей, и каждая открывается либо отмычкой, либо клинком. На столах Лиры Вешенька — тихий ужас. Она не бросается в бой первой, но в темноте подземелья именно её шаги за спиной заставляют игроков проверять, закрыта ли дверь. Она помнит каждую обиду и каждый долг. Прощает редко.',
      strength: 10,
      dexterity: 18,
      constitution: 12,
      intelligence: 14,
      wisdom: 13,
      charisma: 8,
      hitPoints: 36,
      armorClass: 16,
      speed: 30,
      spells: [],
      languages: ['common', 'elvish', 'undercommon'],
      skills: ['stealth', 'sleight-of-hand', 'acrobatics', 'perception', 'deception', 'investigation'],
      equipment: [
        'Кожаный доспех, окрашенный в цвет сырой стены',
        'Пара коротких мечей с пиловидными лезвиями',
        'Арбалет ручной с глушителем на спуск',
        'Набор воровских инструментов в масляной ткани',
        'Плащ с капюшоном и капюшон второй — запасной',
        'Сапоги с мягкой подошвой',
      ],
      inventory: [
        'Семь комплектов отмычек разной формы',
        'Пакет с пылью для следа (мел, сажа, пепел)',
        'Флакон с сонным порошком',
        'Связка ключей без бирок — только метки царапинами',
        'Сушёная крыса в ткани — «закуска на случай блокады»',
        'Нож для резки верёvок и канатов',
        'Маленькое зеркало на длинной ручке для углов',
        'Записка с адресом, который она сожжёт после прочтения',
      ],
    },
    {
      ownerEmail: 'master2@baldgoose.ru',
      name: 'Сестра Ольвен',
      level: 8,
      race: 'human',
      class: 'warlock',
      subclass: 'fiend',
      background: 'hermit',
      alignment: 'chaotic-evil',
      appearance: 'Женщина средних лет с седыми прядями в чёрных волосах и глазами цвета тлеющих углей. Лицо осунулось, губы часто потрескались — будто много молчит или много шепчет. Носит простую чёрную рясу, под которой видны шнуровки с символами, лучше не разглядывать при свете. На запястьях следы от старых оков.',
      bio: 'Ольвен была монахиней в монастыре у болот, пока ночью не услышала голос из колодца: не божественный, не человеческий — древний, голодный, терпеливый. Она спустилась по лестнице из корней и заключила договор не ради богатства, а ради ответа: почему молитвы не спасают детей от чумы.\n\nОтвет ей не понравился. Теперь она служит другому — и на столах Лиры воплощает horror не через внезапные пугалки, а через медленное осознание, что спасение имеет цену. Ольвен может исцелить — но попросит за это память, имя или обещание, которое герой не сможет выполнить. Она не хохочет злодейски; она говорит мягко, как на исповеди.',
      strength: 9,
      dexterity: 12,
      constitution: 14,
      intelligence: 13,
      wisdom: 15,
      charisma: 18,
      hitPoints: 58,
      armorClass: 15,
      speed: 30,
      spells: ['eldritch-blast', 'hellish-rebuke', 'counterspell', 'hold-person', 'invisibility', 'suggestion', 'darkness'],
      languages: ['common', 'infernal', 'abyssal', 'celestial'],
      skills: ['arcana', 'religion', 'insight', 'intimidation', 'medicine'],
      equipment: [
        'Ряса отшельницы с вышитыми wards изнутри',
        'Посох из корня болотного дерева',
        'Фокус договора — кость, обмотанная чёрной нитью',
        'Чётки из костяных бусин без креста',
        'Кинжал ритуальный с зубчатым лезвием',
      ],
      inventory: [
        'Свиток «Вызов духа болота» — использован наполовину',
        'Три восковые фигурки без лиц',
        'Склянки с болотной водой и тиной',
        'Книга молитв с вырванными страницами',
        'Мешочек с солью и железными опилками',
        'Письмо от настоятеля: «Вернись, пока не поздно»',
        'Сушёные травы для дыма очищения — и для дыма, который не очищает',
      ],
    },
    {
      ownerEmail: 'master3@baldgoose.ru',
      name: 'Брунн Горная Печь',
      level: 9,
      race: 'dwarf',
      subrace: 'hill-dwarf',
      class: 'fighter',
      subclass: 'champion',
      background: 'soldier',
      alignment: 'lawful-neutral',
      appearance: 'Крепкий дварф с рыжей бородой в две косы, заплетённые с металлическими кольцами. Левый глаз мутноват — старая рана. Доспехи покрыты царапинами и метками молотом — каждая отметка означает пережитый штурм. Запах угля и пива следует за ним, как тень.',
      bio: 'Брунн служил в Горной Печи — легионе дварфийских инженеров и штурмовиков, которые строили крепости и ломали чужие. Он не поэт и не пророк: «План прост. Щит вперёд. Молот вниз. Живые — домой». Моргрим ценит в нём именно это: Брунн не усложняет.\n\nНа поле боя он расставляет союзников так, чтобы каждый знал свою позицию. Не любит магов, которые «летают и думают», но уважает тех, кто держит слово. Его личная цель — вернуть знамя своей роты, потерянное в осаде Каменного Зева. Пока знамя не найдено, он не считает службу оконченной.',
      strength: 18,
      dexterity: 12,
      constitution: 16,
      intelligence: 10,
      wisdom: 13,
      charisma: 11,
      hitPoints: 86,
      armorClass: 20,
      speed: 25,
      spells: [],
      languages: ['common', 'dwarvish', 'giant'],
      skills: ['athletics', 'intimidation', 'perception', 'survival', 'history'],
      equipment: [
        'Комплект латных доспехов «Печь» с ремнями для переноски раненых',
        'Двуручный молот с зазубринами на боевой части',
        'Щит прямоугольный с руной роты',
        'Три метательных топора в кожаных чехлах',
        'Шлем с гребнем в виде пламени',
        'Набор для заточки и ремонта оружия',
      ],
      inventory: [
        'Фляга крепкого дварфийского эля — «для после, не во время»',
        'Мешок гвоздей, клиньев и малый молоток',
        'Запасные ремни и заклёпки',
        'Карта штурма Каменного Зева с пометками о потерях',
        'Медальон с портретом сестры-кузнеца',
        'Сухарики, сыр и солонка на неделю',
        'Свеча и мел для разметки коридоров',
      ],
    },
    {
      ownerEmail: 'master3@baldgoose.ru',
      name: 'Скальд Кровавый Зуб',
      level: 7,
      race: 'half-orc',
      class: 'barbarian',
      subclass: 'berserker',
      background: 'outlander',
      alignment: 'chaotic-neutral',
      appearance: 'Массивный полуорк с зеленоватой кожей и клыками, один из которых золочёный — отсюда прозвище. Волосы собраны в ирокез, тело покрыто шрамами и татуировками северных племён. Без доспехов предпочитает шкуры и кожу; в бою рёвет так, что стекло дрожит.',
      bio: 'Скальда выгнали из племени не за жестокость — за то, что он смеялся в лицо вождю, когда тот приказал сжечь пленных. «Враг без оружия — не враг, а груз», — сказал Скальд и ушёл в снега. С тех пор он живёт по простому кодексу: не бить слабых, не прощать трусов, не отступать, если за спиной те, кто назвал тебя своим.\n\nМоргрим использует его для честных, кровавых столкновений. Скальд не строит планов — он их ломает, когда план идёт не так. В ярости опасен для всех, включая союзников; вне ярости удивительно тактичен с детьми и животными. Мечтает найти клинок, который «не стыдно оставить сыну» — если сын когда-нибудь появится.',
      strength: 18,
      dexterity: 14,
      constitution: 16,
      intelligence: 8,
      wisdom: 12,
      charisma: 10,
      hitPoints: 76,
      armorClass: 16,
      speed: 30,
      spells: [],
      languages: ['common', 'orc', 'giant'],
      skills: ['athletics', 'intimidation', 'survival', 'animal-handling', 'perception'],
      equipment: [
        'Великий топор с насечками на каждой победе',
        'Два ручных топика для метания',
        'Шкурный нагрудник с костяными пластинами',
        'Сапоги с шипами для льда',
        'Мешок с мелом для меток на деревьях',
      ],
      inventory: [
        'Сушёное мясо на месяц — половина уже съедена',
        'Кожаная фляга с горьким настоем',
        'Набор для разделки дичи',
        'Зубы разных зверей на шнурке — трофеи',
        'Кусок мела для боевой раскраски',
        'Запасная повязка и иглы',
        'Камень с выбитым символом племени — единственная связь с прошлым',
      ],
    },
    {
      ownerEmail: 'master4@baldgoose.ru',
      name: 'Иосиф «Последний»',
      level: 5,
      race: 'human',
      class: 'cleric',
      subclass: 'life',
      background: 'folk-hero',
      alignment: 'neutral-good',
      appearance: 'Мужчина лет сорока с усталым, но добрым лицом. Короткие седые виски, руки в мозолях. Носит простую чешуйчатую броню под поношенной ряской, на груди — деревянный символ жизни. Пахнет травами и дымом костра.',
      bio: 'Иосиф получил прозвище «Последний» после чумы в деревне Редкие Криницы: из семьи в двенадцать человек выжил он один. Он не считает это чудом — считает долгом. Каждый, кого он поднимает заклинанием, — маленькая месть смерти, которая забрала всех остальных.\n\nНа столах Александра Иосиф — моральный компас и одновременно источник дилемм: он будет лечить врага, если тот сложил оружие, и откажется поднимать меч на сдающегося. Его вера не в догмах, а в то, что жизнь — редкость, которую нельзя тратить на тщеславие. Он устал, но останавливается только когда падает сам — и то ненадолго.',
      strength: 14,
      dexterity: 10,
      constitution: 14,
      intelligence: 12,
      wisdom: 16,
      charisma: 13,
      hitPoints: 42,
      armorClass: 17,
      speed: 30,
      spells: ['cure-wounds', 'healing-word', 'bless', 'spiritual-weapon', 'revivify', 'guidance', 'sacred-flame'],
      languages: ['common', 'celestial', 'halfling'],
      skills: ['medicine', 'religion', 'insight', 'persuasion', 'survival'],
      equipment: [
        'Чешуйчатый доспех под ряской цвета пепла',
        'Булава с символом жизни на головке',
        'Щит круглый, на котором выжжены имена погибших из Редких Криниц',
        'Набор лекаря расширенный',
        'Священный символ из корня дуба',
        'Ряса с заплатами — каждая от чужой руки',
      ],
      inventory: [
        'Травы: мята, зверобой, корень лопуха',
        'Бинты, иглы, настойка для обеззараживания',
        'Список имён — тех, кого не удалось спасти',
        'Хлеб и сухофрукты для раздачи нуждающимся',
        'Свечи для поминовения',
        'Книга притч без названия',
        'Мешочек с семенами — сад, который он посадит, «когда всё закончится»',
      ],
    },
    {
      ownerEmail: 'master4@baldgoose.ru',
      name: 'Гаррет Пыльный Путь',
      level: 4,
      race: 'halfling',
      subrace: 'lightfoot-halfling',
      class: 'ranger',
      subclass: 'hunter',
      background: 'folk-hero',
      alignment: 'neutral-good',
      appearance: 'Невысокий полурослик с загорелой кожей и веснушками. Кудрявые каштановые волосы торчат из-под потёртой шляпы с широкими полями. Глаза зелёные, внимательные. Кожаный доспех украшен бляхами от разных эпох — как музей дорог.',
      bio: 'Гаррет вырос в караване, который ходил через Пыльные Пути — пустоши, где вода дороже серебра. В двенадцать он привёл караван вокруг обвала, по памяти, потому что старшие не верили, что тропа ещё существует. С тех пор его уважают как того, кто «чует воду и ложь».\n\nОн не романтизирует выживание: знает цену каждому глотку и каждому ночлегу. На столах Александра Гаррет — голос земли и практичности: подскажет, сколько дней до источника, заметит следы там, где другие видят песок, и первым предложит поделиться пайком, если кто-то жадничает. Боится только одного — стать героем, который ведёт других в красивую смерть ради красивой истории.',
      strength: 11,
      dexterity: 16,
      constitution: 14,
      intelligence: 13,
      wisdom: 15,
      charisma: 12,
      hitPoints: 34,
      armorClass: 15,
      speed: 25,
      spells: ['hunters-mark', 'goodberry', 'cure-wounds', 'detect-magic'],
      languages: ['common', 'halfling', 'dwarvish', 'gnomish'],
      skills: ['survival', 'nature', 'perception', 'investigation', 'animal-handling'],
      equipment: [
        'Кожаный доспех с бляхами от разных караванов',
        'Короткий лук компактный, подогнанный под рост полурослика',
        'Пара коротких мечей',
        'Шляпа с полями и скрытыми карманами',
        'Набор для выслеживания: мел, уголь, воск',
        'Верёvка из прочного лёнта (15 м)',
      ],
      inventory: [
        'Кожаная фляга — всегда наполовину полная «на чёрный день»',
        'Сухие фрукты, орехи, солёная рыба',
        'Компактный котелок и крючки для рыбалки',
        'Карта Пыльных Путей с пометками о колодцах',
        'Мешочек с песком для тушения костров',
        'Свернутый плащ-палатка',
        'Свисток для сигналов каравана',
        'Медный компас — подарок отца',
      ],
    },
    {
      ownerEmail: 'guest@baldgoose.ru',
      name: 'Лорин',
      level: 3,
      race: 'half-elf',
      class: 'bard',
      subclass: 'lore',
      background: 'entertainer',
      alignment: 'chaotic-neutral',
      appearance: 'Каштановые волосы средней длины, слегка вьющиеся. Прямоугольные очки на тонкой оправе. Старая изношенная одежда серо-жёлтого цвета, потёртая, но аккуратная. На поясе — флейта из красного дерева с потемневшим от времени лаком.',
      bio: 'Лорин родился в лесной общине эльфов, но полуэльфом среди чистокровных родичей постоянно чувствовал себя чужим — слишком медленным для их вечности и слишком «шумным» для их тишины. Как только представилась возможность, он ушёл из общины и решил жить самостоятельно.\n\nНедалеко от родного леса Лорин встретил пожилого бродячего барда Фрига, который стал ему дедом по духу и научил играть на флейте. Вместе они долго странствовали по разным землям, пока Фриг не скончался. Лорин забрал его флейту и отправился в собственное путешествие — не за славой и не за золотом, а за историями, которые ещё не успели стать песнями.\n\nВ таверне «Лысый Гусь» он часто сидит у края зала: слушает, записывает мелодии на восковых табличках и играет только тогда, когда зал действительно готов слушать. Его музыка не громкая, но в ней слышится дорога — и память о том, кто научил его первому аккорду.',
      strength: 8,
      dexterity: 14,
      constitution: 12,
      intelligence: 11,
      wisdom: 12,
      charisma: 16,
      hitPoints: 21,
      armorClass: 13,
      speed: 30,
      spells: ['vicious-mockery', 'healing-word', 'charm-person', 'disguise-self'],
      languages: ['common', 'elvish', 'sylvan'],
      skills: ['performance', 'persuasion', 'deception', 'insight', 'perception', 'history'],
      equipment: [
        'Флейта из красного дерева — подарок Фрига',
        'Прямоугольные очки в кожаном футляре',
        'Поношенный камзол серо-жёлтого цвета с заплатами на локтях',
        'Кинжал для самообороны и резки верёвок',
        'Лютня в мягком чехле — на случай, если флейты мало',
        'Набор артиста: костюм, грим, несколько старых афиш',
      ],
      inventory: [
        'Блокнот с нотами и стихами на полях',
        'Восковые таблички для черновиков мелодий',
        'Флакон дешёвого вина «на удачу перед выступлением»',
        'Мешочек с медными монетами — пожертвования слушателей',
        'Письмо от Фрига, которое Лорин читает в трудные ночи',
        'Запасные струны для лютни',
        'Сухие пайки и сладкая лепёшка',
        'Плащ путника, сшитый из двух старых плащов',
      ],
    },
  ]

  for (let i = 0; i < characters.length; i++) {
    const character = characters[i]
    const userId = usersByEmail[character.ownerEmail]
    if (!userId) {
      throw new Error(`User not found for character seed: ${character.ownerEmail}`)
    }

    const { ownerEmail, ...data } = character
    await prisma.character.create({
      data: {
        ...data,
        userId,
        avatar: `/images/characters/image${i + 1}.webp`,
      },
    })
  }

  const tableRows = await prisma.table.findMany({ orderBy: { number: 'asc' } })
  const dishRows = await prisma.dish.findMany({ orderBy: { createdAt: 'asc' } })
  const masterUsers = await prisma.user.findMany({ where: { role: 'MASTER' } })
  const zonesById = Object.fromEntries(
    (await prisma.zone.findMany()).map((zone) => [zone.id, zone]),
  )

  await seedConfirmedReservations(usersByEmail, tableRows, dishRows, masterUsers, zonesById)

  await prisma.achievements.createMany({
    data: [
      {
        code: 'first_character',
        status: 'PUBLISHED',
        nameRu: 'Первый шаг в приключение',
        nameEn: 'First Step Into Adventure',
        howToGetRu: 'Создайте своего первого персонажа',
        howToGetEn: 'Create your first character',
        bonuses: 40,
        rarity: ['EPIC'],
      },
      {
        code: 'first_news_read',
        status: 'PUBLISHED',
        nameRu: 'Внимательный гость',
        nameEn: 'Attentive Guest',
        howToGetRu: 'Откройте любую новость кафе',
        howToGetEn: 'Open any cafe news article',
        bonuses: 20,
        rarity: ['UNCOMMON'],
      },
      {
        code: 'first_reservation',
        status: 'PUBLISHED',
        nameRu: 'Стол забронирован',
        nameEn: 'Table Booked',
        howToGetRu: 'Подтвердите первую бронь столика',
        howToGetEn: 'Confirm your first table reservation',
        bonuses: 50,
        rarity: ['LEGENDARY'],
      },
      {
        code: 'first_contact_request',
        status: 'PUBLISHED',
        nameRu: 'Весточка отправлена',
        nameEn: 'Message Sent',
        howToGetRu: 'Отправьте форму обратной связи',
        howToGetEn: 'Submit the contact form',
        bonuses: 30,
        rarity: ['RARE'],
      },
    ],
  })
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
