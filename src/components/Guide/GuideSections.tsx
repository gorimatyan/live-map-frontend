"use client"
import { HeroSection } from "./Sections/HeroSection"
import { FeaturesSection } from "./Sections/FeaturesSection"
import { HowToUseSection } from "./Sections/HowToUseSection"
import { CategoriesSection } from "./Sections/CategoriesSection"
import { CTASection } from "./Sections/CTASection"

export function GuideSections() {
  return (
    <div className="pt-12 bg-gradient-to-br from-blue-100 to-white">
      <HeroSection />
      <FeaturesSection />
      <HowToUseSection />
      <CategoriesSection />
      <CTASection />
    </div>
  )
}
