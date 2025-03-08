export const toCompatibleBounds = (region: mapkit.BoundingRegion) => ({
  getSouthWest: (): [number, number] => [region.southLatitude, region.westLongitude],
  getNorthEast: (): [number, number] => [region.northLatitude, region.eastLongitude],
})
