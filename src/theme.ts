import { TextStyle } from "react-native";

export const colors = {
  // Base canvas — deep near-black with a faint violet undertone
  background: "#08080C",
  backgroundRaised: "#0E0E15",
  surface: "#13131C",
  surfaceStrong: "#1A1A26",
  surfaceSoft: "#242433",
  card: "#101019",
  cardElevated: "#16161F",

  // Hairline borders
  border: "rgba(255, 255, 255, 0.10)",
  borderSoft: "rgba(255, 255, 255, 0.07)",
  borderStrong: "rgba(255, 255, 255, 0.16)",

  // Text
  text: "#F6F6FB",
  muted: "#A6A6BC",
  faint: "#6C6C82",

  // Primary accent — electric violet
  accent: "#7C5CFF",
  accentStrong: "#6A45FF",
  accentSoft: "rgba(124, 92, 255, 0.16)",
  accentText: "#C3B4FF",
  onAccent: "#FFFFFF",

  // Sparing energy highlight (live/trending only)
  hot: "#FF5C8A",
  hotSoft: "rgba(255, 92, 138, 0.16)",

  // Semantic
  success: "#34D399",
  successSoft: "rgba(52, 211, 153, 0.16)",
  warning: "#FBBF24",
  danger: "#FB7185",
  dangerSoft: "rgba(251, 113, 133, 0.14)"
};

export const gradients = {
  // Used only for image legibility scrims and the auth/hero accent — never decorative noise
  scrim: ["rgba(8, 8, 12, 0)", "rgba(8, 8, 12, 0.35)", "rgba(8, 8, 12, 0.94)"] as const,
  accent: ["#7C5CFF", "#5B8DEF"] as const,
  accentSubtle: ["rgba(124, 92, 255, 0.22)", "rgba(91, 141, 239, 0.05)"] as const,
  hero: ["#100A24", "#0B0B14", "#08080C"] as const
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  pill: 999
};

export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold"
};

export const fontAssets = {
  PlusJakartaSans_400Regular: require("@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf"),
  PlusJakartaSans_500Medium: require("@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf"),
  PlusJakartaSans_600SemiBold: require("@expo-google-fonts/plus-jakarta-sans/600SemiBold/PlusJakartaSans_600SemiBold.ttf"),
  PlusJakartaSans_700Bold: require("@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf"),
  PlusJakartaSans_800ExtraBold: require("@expo-google-fonts/plus-jakarta-sans/800ExtraBold/PlusJakartaSans_800ExtraBold.ttf")
};

type TypeScale = Record<
  "display" | "h1" | "h2" | "h3" | "title" | "body" | "bodyStrong" | "label" | "caption" | "overline",
  TextStyle
>;

export const type: TypeScale = {
  display: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.6 },
  h1: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.1 },
  title: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 23 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2 }
};

export const shadows = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 6
  },
  soft: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 3
  },
  accent: {
    shadowColor: "#7C5CFF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8
  }
};

export const categories = ["Parties", "Clubs", "Campus", "Sports", "Music", "Food", "Nightlife"] as const;
