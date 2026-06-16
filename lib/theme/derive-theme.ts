import { deriveColorMap } from "./algorithms/color"
import { deriveDensityMap } from "./algorithms/density"
import { deriveElevationMap } from "./algorithms/elevation"
import { deriveMotionMap } from "./algorithms/motion"
import { deriveRadiusMap } from "./algorithms/radius"
import { deriveTypographyMap } from "./algorithms/typography"
import { mergeTokenRecords } from "./algorithms/utils"
import {
  deriveDarkSemanticTokens,
  deriveSemanticTokens,
} from "./semantic"
import { deriveShadcnTokens } from "./shadcn-adapter"
import type { ThemeOutput, ThemeSeed } from "./schema"
import { deriveVibeDescriptor } from "./vibe"

export function deriveTheme(seed: ThemeSeed): ThemeOutput {
  const mapTokens = mergeTokenRecords(
    deriveColorMap(seed),
    deriveRadiusMap(seed),
    deriveDensityMap(seed),
    deriveTypographyMap(seed),
    deriveElevationMap(seed),
    deriveMotionMap(seed)
  )
  const semanticTokens = deriveSemanticTokens(seed)
  const darkSemanticTokens = deriveDarkSemanticTokens(seed)
  const shadcnTokens = deriveShadcnTokens(semanticTokens)
  const darkShadcnTokens = deriveShadcnTokens(darkSemanticTokens)
  const cssVariables = mergeTokenRecords(mapTokens, semanticTokens, shadcnTokens)
  const darkCssVariables = mergeTokenRecords(
    mapTokens,
    darkSemanticTokens,
    darkShadcnTokens
  )
  const vibe = deriveVibeDescriptor(seed)

  return {
    seed,
    mapTokens,
    semanticTokens,
    darkSemanticTokens,
    shadcnTokens,
    darkShadcnTokens,
    cssVariables,
    darkCssVariables,
    vibe,
  }
}
