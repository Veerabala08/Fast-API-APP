export const THEMES = {
  dark: {
    label: "Dark",
    bg: "from-neutral-950 to-neutral-900",
    text: "text-white",
    accent: "bg-white/10 hover:bg-white/20 border-white/20",
    preview: "bg-gradient-to-b from-neutral-950 to-neutral-900 text-white",
  },
  ocean: {
    label: "Ocean",
    bg: "from-sky-500 to-indigo-600",
    text: "text-white",
    accent: "bg-white/20 hover:bg-white/30 border-white/20",
    preview: "bg-gradient-to-b from-sky-500 to-indigo-600 text-white",
  },
  sunset: {
    label: "Sunset",
    bg: "from-orange-500 via-pink-500 to-purple-600",
    text: "text-white",
    accent: "bg-white/20 hover:bg-white/30 border-white/20",
    preview:
      "bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600 text-white",
  },
  neon: {
    label: "Neon",
    bg: "from-black via-purple-800 to-indigo-900",
    text: "text-pink-400",
    accent: "bg-white/10 hover:bg-white/20 border-white/20",
    preview:
      "bg-gradient-to-b from-black via-purple-800 to-indigo-900 text-pink-400",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
