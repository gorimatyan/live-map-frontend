import React from "react"
import { HamburgerIcon } from "../Icons/HamburgerIcon"

type HamburgerToggleProps = {
  toggleHamburger: () => void
} & React.HTMLAttributes<HTMLButtonElement>

export const HamburgerToggle: React.FC<HamburgerToggleProps> = ({ toggleHamburger, className }) => (
  <button
    className={`p-2 rounded-full shadow-lg bg-white dark:bg-[#272935] z-10 ${className}`}
    onClick={toggleHamburger}
  >
    <HamburgerIcon className="sm:size-8 size-6 text-gray-700 hover:opacity-80" />
  </button>
)
