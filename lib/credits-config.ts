export type CreditPerson = {
  name: string
  role?: string
  link?: string
}

export type CreditSection = {
  id: string
  title: string
  description: string
  icon: "maintainers" | "translators"
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
        role: "Maintainer of the Subway Builder Modded website and Railyard.",
        link: "https://github.com/kaicardenas0618",
      },
      {
        name: "ahkimn",
        role: "Maintainer of the Subway Builder Modded website, Template Mod, and Railyard.",
        link: "https://github.com/ahkimn",
      },
      {
        name: "Kronifer",
        role: "Creator of the Map Manager and maintainer of Railyard.",
        link: "https://github.com/kronifer",
      },
      {
        name: "IMB11",
        role: "Maintainer of the Template Mod and Railyard and contributor to the Subway Builder Modded website.",
        link: "https://github.com/IMB11",
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
