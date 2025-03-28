/**
 * GetNewsData・GetFireDataの型
 */
export type GetAnnotationsType = {
  id: number
  category: string // ニュースのカテゴリ
  location: { lat: number; lng: number }
  title: string // ニュースのタイトル
  summary: string // ニュースの要約
  contentBody: string // ニュースの本文
  sourceName: string | null // ニュースの発信元
  sourceUrl: string | null // 発信元のURL
  clusteringIdentifier: string
  data: MarkerAnnotationData
  markerImgUrl?: string // マーカーの画像
  publishedAt: Date // ニュースの公開日
  createdAt: Date // DBに登録された日時
}

/**
 * Annotationデータのdataプロパティの型
 */
export type MarkerAnnotationData = {
  id: number
  category: string
  location: { lat: number; lng: number }
  address: string | null
  predictedLocation: string | null
  link: string
  publishedAt: Date
  markerImgUrl: string
}
