"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Since we are now using native CSS dark mode (hardcoded in layout.tsx),
  // this provider serves as a simple pass-through for children
  // and a placeholder for any future theme context needs.
  return <>{children}</>
}

// Minimal hook compatibility if needed later
export const useTheme = () => ({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark"
})
