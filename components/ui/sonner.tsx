"use client"

import { useTheme } from "next-themes"

type ToasterProps = {
  theme?: "light" | "dark" | "system"
  className?: string
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  
  // Simple stub that doesn't render anything
  return null
}

export { Toaster }