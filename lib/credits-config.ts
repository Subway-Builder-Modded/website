export type CreditPerson = {
  name: string
  role?: string
  link?: string
}

export type CreditSection = {
  id: string
  title: string
  description: string
  icon: "maintainers" | "translators" | "contributors"
  people: CreditPerson[]
}

export const CREDIT_SECTIONS: CreditSection[] = [
  {
    id: "maintainers",
    title: "Maintainers",
    description: "Maintainers of the various Subway Builder Modded tools and apps.",
    icon: "maintainers",
    people: [
      {
        name: "kaicardenas0618",
        role: `Inventor of the term "history" as well as other terms like "eventful" and "participant".`,
        link: "https://github.com/kaicardenas0618",
      },
      {
        name: "ahkimn",
        role: `Artist of many beautiful art pieces, available at the [art page](/art).`,
        link: "https://github.com/ahkimn",
      },
      {
        name: "Kronifer",
        role: "Prime minister of Canada and surrounding territories.",
        link: "https://github.com/kronifer",
      },
    ],
  },
  {
    id: "former-maintainers",
    title: "Former Maintainers",
    description: "Former maintainers of the various Subway Builder Modded tools and apps.",
    icon: "maintainers",
    people: [
      {
        name: "IMB11",
        role: "Initial creator of the Template Mod and Railyard and contributor to the Subway Builder Modded website.",
        link: "https://github.com/IMB11",
      },
    ],
  },
  {
    id: "contributors",
    title: "Contributors",
    description: "Contributors to the Subway Builder Modded projects.",
    icon: "contributors",
    people: [
      {
        name: "rslurry",
        role: "Contributor/tester of Railyard and maintainer of the Demand Data Generator.",
        link: "https://github.com/rslurry",
      },
    ],
  },
  {
    id: "translators",
    title: "Translators",
    description: "Community members helping make Subway Builder Modded accessible worldwide.",
    icon: "translators",
    people: [
      {
        name: "ppiittii",
        role: "Maintainer of the German translation of the Subway Builder Modded Website.",
        link: "https://github.com/ppiittii",
      },
    ],
  },
]
