export const colors = {
  background: "#05030a",
  backgroundRaised: "#090511",
  surface: "#12091f",
  surfaceStrong: "#1d1030",
  surfaceSoft: "#2a1748",
  card: "#140a22",
  cardElevated: "#1a0d2d",
  border: "#3b225b",
  borderSoft: "rgba(192, 132, 252, 0.18)",
  paper: "#fbf7ff",
  paperSoft: "#f2ecff",
  paperTint: "rgba(251, 247, 255, 0.72)",
  paperBorder: "#ded2ef",
  ink: "#160a24",
  inkSoft: "#2b1740",
  inkMuted: "#5b4b6f",
  inkFaint: "#8f7fa4",
  text: "#fbf7ff",
  muted: "#c9bbdc",
  faint: "#84739c",
  accent: "#a855f7",
  accentStrong: "#7c3aed",
  purpleGlow: "#c084fc",
  pink: "#ff4ecd",
  lime: "#b6ff5c",
  amber: "#ffd166",
  green: "#45f5a7",
  danger: "#ff6b8a"
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
  xxl: 44
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999
};

export const shadows = {
  glow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 7
  },
  paper: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 6
  },
  paperTight: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2
  },
  soft: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 4
  }
};

export const typography = {
  display: {
    fontSize: 42,
    lineHeight: 45,
    fontWeight: "900" as const
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900" as const
  },
  cardTitle: {
    fontSize: 25,
    lineHeight: 29,
    fontWeight: "900" as const
  },
  label: {
    fontSize: 12,
    fontWeight: "900" as const
  }
};

export const categories = ["Parties", "Clubs", "Campus", "Sports", "Music", "Food", "Nightlife"] as const;
