import type { ThemeSeed } from "./schema"

export const defaultThemeSeed: ThemeSeed = {
  color: {
    primary: {
      hex: "#1d4ed8",
      alpha: 1,
    },
    success: {
      hex: "#15803d",
      alpha: 1,
    },
    warning: {
      hex: "#b45309",
      alpha: 1,
    },
    info: {
      hex: "#2563eb",
      alpha: 1,
    },
    infoMatchesPrimary: false,
    danger: {
      hex: "#dc2626",
      alpha: 1,
    },
    background: {
      hex: "#fafafa",
      alpha: 1,
    },
    foreground: {
      hex: "#171717",
      alpha: 1,
    },
    neutral: {
      hex: "#737373",
      alpha: 1,
    },
  },
  shape: {
    radius: 0.625,
    radiusRatio: 1,
  },
  density: {
    mode: "default",
    controlHeight: 2.375,
    densityRatio: 1,
  },
  typography: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "\"JetBrains Mono\", ui-monospace, monospace",
    baseSize: 16,
    scaleRatio: 1.2,
    headingWeight: 650,
    bodyWeight: 400,
    trackingBias: 0,
  },
  material: {
    elevation: "soft",
    shadowAlpha: 0.065,
    borderContrast: 1.05,
    surfaceContrast: 1.05,
    glassOpacity: 0,
    noiseOpacity: 0,
  },
  motion: {
    level: "subtle",
    durationBase: 170,
  },
  vibe: {
    temperature: "cool",
    expression: "balanced",
    domain: "saas",
    tone: "calm",
  },
}
