// Self-hosted (ADR 0004): 3D text must never fall back to a font from a CDN
import interBold from '@fontsource/inter/files/inter-latin-700-normal.woff?url'
import interSemibold from '@fontsource/inter/files/inter-latin-600-normal.woff?url'

export const fonts = {
  semibold: interSemibold,
  bold: interBold,
}
