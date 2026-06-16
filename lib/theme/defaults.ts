import type { ThemeSeed } from "./schema"

export const defaultThemeSeed: ThemeSeed = {
  color: {
    primary: {
      hex: "#6366f1",
      alpha: 1,
    },
    success: {
      hex: "#10b981",
      alpha: 1,
    },
    warning: {
      hex: "#f59e0b",
      alpha: 1,
    },
    info: {
      hex: "#3b82f6",
      alpha: 1,
    },
    infoMatchesPrimary: false,
    danger: {
      hex: "#ef4444",
      alpha: 1,
    },
    background: {
      hex: "#ffffff",
      alpha: 1,
    },
    foreground: {
      hex: "#09090b",
      alpha: 1,
    },
    neutral: {
      hex: "#737373",
      alpha: 1,
    },
  },
  shape: {
    radius: 0.75,
    radiusRatio: 1,
  },
  density: {
    mode: "default",
    controlHeight: 2.5,
    densityRatio: 1,
  },
  typography: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "\"JetBrains Mono\", ui-monospace, monospace",
    scaleRatio: 1.2,
    headingWeight: 650,
    bodyWeight: 400,
    trackingBias: 0,
  },
  material: {
    elevation: "soft",
    shadowAlpha: 0.08,
    borderContrast: 1,
    surfaceContrast: 1,
    glassOpacity: 0,
    noiseOpacity: 0,
  },
  motion: {
    level: "subtle",
    durationBase: 180,
  },
  vibe: {
    temperature: "cool",
    expression: "balanced",
    domain: "saas",
    tone: "calm",
  },
}
