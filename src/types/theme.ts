export type ThemeType = "light" | "dark"

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  buttonText: string;
  borderColor: string;
  PlaceholderTextColor: string;
  error: string;
  backgroundColorHeader: string;
  phoneContacts: string;
  backgroundColorContacts: string;
  card: string;
}

export interface ThemeContextType {
  theme: ThemeType
  toggleTheme: () => void
  colors: ThemeColors
}

