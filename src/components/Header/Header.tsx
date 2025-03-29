"use client"

import { useState } from "react"
import { Menu } from "./Menu"
import { HamburgerIcon } from "../Icons/HamburgerIcon"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 z-50 p-4">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="relative z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        aria-label="メニューを開く"
      >
        <HamburgerIcon />
      </button>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  )
}
