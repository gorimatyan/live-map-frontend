import React from "react"
import { MoonIcon } from "../Icons/MoonIcon"
import { SunIcon } from "../Icons/SunIcon"

type DarkModeToggleProps = {
  isDarkMode: boolean
  toggleDarkMode: () => void
} & React.HTMLAttributes<HTMLButtonElement>

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  isDarkMode,
  toggleDarkMode,
  className,
}) => (
  <button
    onClick={toggleDarkMode}
    className={`z-10 bg-white dark:bg-[#272935] rounded-full p-2 ${className}`}
  >
    {isDarkMode ? (
      <SunIcon className="fill-orange-400 hover:fill-orange-300 sm:size-8 size-6" />
    ) : (
      <MoonIcon className="fill-yellow-500 hover:fill-yellow-400 sm:size-8 size-6" />
    )}
  </button>
)
