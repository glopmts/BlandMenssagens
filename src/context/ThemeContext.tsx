import { darkColors, lightColors } from "@/constants/theme"
import type { ThemeContextType, ThemeType } from "@/types/theme"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type React from "react"
import { createContext, useEffect, useState } from "react"


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>("dark")

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        setTheme(savedTheme as ThemeType)
      }
    } catch (error) {
      console.error("Failed to load theme", error)
    }
  }

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    try {
      await AsyncStorage.setItem("theme", newTheme)
    } catch (error) {
      console.error("Failed to save theme", error)
    }
  }

  const colors = theme === "light" ? lightColors : darkColors

  return <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>{children}</ThemeContext.Provider>
}

