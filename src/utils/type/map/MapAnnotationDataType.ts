export type MapInstance = mapkit.Map
export type MapkitInstance = typeof mapkit

export type MapAnnotationData = {
  id: number
  category: string
  location: { lat: number; lng: number }
  title: string
  subtitle: string
  clusteringIdentifier: string
  data: {
    area: string
    link: string
  }
  markerImgUrl?: string // マーカーの画像
}
