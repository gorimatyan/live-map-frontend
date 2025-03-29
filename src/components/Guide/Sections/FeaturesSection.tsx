"use client"
import { AnimatedHeading } from "@/components/AnimatedHeading/AnimatedHeading"
import { features } from "../data"
import { useState } from "react"

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="relative text-2xl font-bold text-center mb-16">
          <AnimatedHeading>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-400">
              ライブマップ.NET
            </span>
            の良さ
          </AnimatedHeading>
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-6 flex flex-col items-start rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer`}
              onClick={() => setActiveIndex(index)}
            >
              <div className={`text-4xl mb-4 ${activeIndex === index ? "emoji-animate" : ""}`}>
                {feature.icon}
              </div>
              <h3 className="relative inline-block text-xl font-bold mb-3 pb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
