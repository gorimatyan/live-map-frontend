import Image from "next/image"
import { AnimatedHeading } from "@/components/AnimatedHeading/AnimatedHeading"
import { HamburgerIcon } from "@/components/Icons/HamburgerIcon"
import { steps } from "../data"

export function HowToUseSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="relative text-2xl font-bold text-center mb-16">
          <AnimatedHeading>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-400">
              3ステップ
            </span>
            で簡単に使えます
          </AnimatedHeading>
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative w-full aspect-square mx-auto mb-4">
                <div className="absolute -top-2 -right-2 w-10 text-bold text-2xl h-10 bg-blue-600 text-white rounded-full flex items-center z-10 justify-center">
                  {index + 1}
                </div>
                {step.image ? (
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover shadow-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-full shadow-lg h-full bg-white flex items-center justify-center">
                    <div className="bg-white rounded-xl w-1/2 h-1/2 shadow-md transition-colors">
                      <HamburgerIcon className="w-full h-full" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: step.description }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
