export type ThemeType = "light" | "dark"

export interface ThemeColors {
  background: string;
  text: string;
  primary: string;
  buttonText: string;
  borderColor: string;
  PlaceholderTextColor: string;
  backgroundColorHeader: string;
  backgroundColorHeaderLinks: string;
  backgroundHeader: string;
  phoneContacts: string;
  backgroundColorContacts: string;
  backgroundButton: string;

  backgroundsendMenssage: string;
  backgroundreceiveMenssage: string;


  error: string;
  card: string;
  red: string;
  blue: string;
  green: string;
  yellow: string;
  orange: string;
  gray: string;
}

export interface ThemeContextType {
  theme: ThemeType
  toggleTheme: () => void
  colors: ThemeColors
}

