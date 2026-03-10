"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { ART_ITEMS } from "@/lib/art-config"

export default function ArtPage() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap())
    }

    updateCurrent()
    api.on("select", updateCurrent)
    api.on("reInit", updateCurrent)

    return () => {
      api.off("select", updateCurrent)
      api.off("reInit", updateCurrent)
    }
  }, [api])

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-6xl shadow-2xl">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {ART_ITEMS.map((item, index) => (
                <CarouselItem key={item.id}>
                  <div className="relative overflow-hidden rounded-lg">
                    {/* Main Image/Color Area */}
                    <div className="relative aspect-[16/9] w-full bg-muted/20">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-contain"
                          priority={index === 0}
                        />
                      ) : (
                        <div className={`size-full ${item.color}`} />
                      )}
                      
                      {/* Gradient Overlay with Title/Author */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent dark:from-black/95 dark:via-black/60 dark:to-black/20" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
                        <div className="transform transition-all duration-300 ease-out">
                          <h2 className="mb-1 text-xl font-bold text-foreground sm:mb-2 sm:text-2xl md:text-3xl lg:text-4xl">
                            {item.title}
                          </h2>
                          <p className="text-sm text-muted-foreground sm:text-base md:text-lg">
                            {item.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="transition-all hover:scale-110" />
            <CarouselNext className="transition-all hover:scale-110" />
          </Carousel>
          
          {/* Optional: Slide Indicators */}
          <div className="mt-4 flex justify-center gap-2">
            {ART_ITEMS.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-8 bg-foreground"
                    : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
