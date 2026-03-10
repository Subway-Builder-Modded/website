export type ArtItem = {
  id: number | string
  title: string
  author: string
  imageUrl?: string
  color?: string
}

export const ART_ITEMS: ArtItem[] = [
  {
    id: 1,
    title: "Regions",
    author: "ahkimn",
    imageUrl: "/images/art/regions.png",
  },
  {
    id: 2,
    title: "Japan",
    author: "ahkimn",
    imageUrl: "/images/art/japan.png",
  },
  {
    id: 3,
    title: "Railyard",
    author: "kaicardenas0618",
    imageUrl: "/images/art/railyard.png",
  },
]
