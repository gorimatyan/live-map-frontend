/**
 * mapkit.BoundingRegionを座標に変換する
 * @param region mapkit.BoundingRegion
 * @returns 座標
 */
export const toCompatibleBounds = (region: mapkit.BoundingRegion) => ({
  getSouthWest: (): [number, number] => [region.southLatitude, region.westLongitude],
  getNorthEast: (): [number, number] => [region.northLatitude, region.eastLongitude],
})
