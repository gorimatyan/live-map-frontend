import { AnimatedHeading } from "@/components/AnimatedHeading/AnimatedHeading"
import { categories } from "../data"
import { useState } from "react"

export function CategoriesSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="relative text-2xl font-bold text-center mb-16">
          <AnimatedHeading>
            豊富な情報カテゴリー
            <span className="absolute -top-6 -right-6 text-5xl opacity-20">📱</span>
            <span className="absolute -bottom-7 -left-12 text-5xl opacity-20">📍</span>
          </AnimatedHeading>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`category-card bg-white p-6 rounded-lg hover:border-blue-500 border ${
                activeIndex == index ? "border-blue-500" : "border-gray-200"
              } transition cursor-pointer`}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-2xl transition-all ${activeIndex === index ? "emoji-animate" : ""}`}
                >
                  {category.emoji}
                </span>
                <h3 className="relative text-xl font-bold">{category.title}</h3>
              </div>
              <p className="text-gray-600">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
