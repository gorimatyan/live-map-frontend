"use client"

import { useEffect, useRef } from "react"

type AnimatedHeadingProps = {
  children: React.ReactNode
  className?: string
}

export function AnimatedHeading({ children, className = "" }: AnimatedHeadingProps) {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = headingRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Element is intersecting!")
            const line = entry.target.querySelector(".animated-line")
            if (line) {
              console.log("Found line element, adding animation class")
              line.classList.add("animate-line")
            }
          }
        })
      },
      {
        threshold: 0.5,
      }
    )

    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return (
    <div ref={headingRef} className={`relative inline-block ${className}`}>
      {children}
      <div className="animated-line absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-500" />
    </div>
  )
}
