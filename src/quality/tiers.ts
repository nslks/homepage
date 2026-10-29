export type QualityTier = 'low' | 'medium' | 'high'

export const qualityTiers: QualityTier[] = ['low', 'medium', 'high']

// What each tier renders (spec §5.5); medium is the starting point on every device
export const qualitySettings: Record<
  QualityTier,
  { maxDpr: number; shadowMapSize: number; lanternLights: number; fireflies: number }
> = {
  low: { maxDpr: 1, shadowMapSize: 1024, lanternLights: 2, fireflies: 15 },
  medium: { maxDpr: 1.25, shadowMapSize: 2048, lanternLights: 4, fireflies: 30 },
  high: { maxDpr: 1.5, shadowMapSize: 2048, lanternLights: 7, fireflies: 45 },
}
