export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function round(value: number, digits = 4): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function rem(value: number): string {
  return `${round(value)}rem`
}

export function px(value: number): string {
  return `${round(value)}px`
}

export function ms(value: number): string {
  return `${round(value, 0)}ms`
}

export function oklch(
  lightness: number,
  chroma: number,
  hue: number,
  alpha?: number
): string {
  const safeLightness = round(clamp(lightness, 0, 1))
  const safeChroma = round(Math.max(chroma, 0))
  const safeHue = round(((hue % 360) + 360) % 360, 2)

  if (alpha === undefined) {
    return `oklch(${safeLightness} ${safeChroma} ${safeHue})`
  }

  return `oklch(${safeLightness} ${safeChroma} ${safeHue} / ${round(
    clamp(alpha, 0, 1)
  )})`
}

export type HexAlphaInput = {
  hex: string
  alpha: number
}

export type OklchColor = {
  lightness: number
  chroma: number
  hue: number
  alpha: number
}

function cubeRoot(value: number): number {
  return Math.sign(value) * Math.abs(value) ** (1 / 3)
}

function normalizeHexChannel(value: string): string {
  return value.length === 1 ? `${value}${value}` : value
}

export function normalizeHex(hex: string): string {
  const trimmed = hex.trim()
  const raw = trimmed.startsWith("#") ? trimmed.slice(1) : trimmed

  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw
      .split("")
      .map((channel) => normalizeHexChannel(channel))
      .join("")
      .toLowerCase()}`
  }

  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw.toLowerCase()}`
  }

  return "#000000"
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex).slice(1)

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function srgbChannelToLinear(value: number): number {
  const channel = value / 255

  if (channel <= 0.04045) {
    return channel / 12.92
  }

  return ((channel + 0.055) / 1.055) ** 2.4
}

export function hexAlphaToOklch(color: HexAlphaInput): OklchColor {
  const { r, g, b } = hexToRgb(color.hex)
  const linearR = srgbChannelToLinear(r)
  const linearG = srgbChannelToLinear(g)
  const linearB = srgbChannelToLinear(b)
  const l = 0.4122214708 * linearR + 0.5363325363 * linearG + 0.0514459929 * linearB
  const m = 0.2119034982 * linearR + 0.6806995451 * linearG + 0.1073969566 * linearB
  const s = 0.0883024619 * linearR + 0.2817188376 * linearG + 0.6299787005 * linearB
  const lPrime = cubeRoot(l)
  const mPrime = cubeRoot(m)
  const sPrime = cubeRoot(s)
  const lightness = 0.2104542553 * lPrime + 0.793617785 * mPrime - 0.0040720468 * sPrime
  const a = 1.9779984951 * lPrime - 2.428592205 * mPrime + 0.4505937099 * sPrime
  const bAxis = 0.0259040371 * lPrime + 0.7827717662 * mPrime - 0.808675766 * sPrime
  const hue = (Math.atan2(bAxis, a) * 180) / Math.PI

  return {
    lightness: round(clamp(lightness, 0, 1)),
    chroma: round(Math.sqrt(a ** 2 + bAxis ** 2)),
    hue: round(((hue % 360) + 360) % 360, 2),
    alpha: round(clamp(color.alpha, 0, 1)),
  }
}

export function oklchFromHexAlpha(
  color: HexAlphaInput,
  overrides?: Partial<Omit<OklchColor, "alpha">> & { alpha?: number }
): string {
  const base = hexAlphaToOklch(color)

  return oklch(
    overrides?.lightness ?? base.lightness,
    overrides?.chroma ?? base.chroma,
    overrides?.hue ?? base.hue,
    overrides?.alpha ?? base.alpha
  )
}

export function hexAlphaToCssColor(color: HexAlphaInput): string {
  const normalized = normalizeHex(color.hex)
  const alpha = clamp(color.alpha, 0, 1)

  if (alpha >= 1) {
    return normalized
  }

  const { r, g, b } = hexToRgb(normalized)

  return `rgb(${r} ${g} ${b} / ${round(alpha)})`
}

export function mergeTokenRecords(
  ...records: Array<Record<string, string>>
): Record<string, string> {
  return Object.assign({}, ...records)
}
