export type MapInstance = mapkit.Map
export type MapkitInstance = typeof mapkit

export type MapAnnotationData = {
  id: number
  category: string // ニュースのカテゴリ
  location: { lat: number; lng: number }
  title: string // ニュースのタイトル
  summary: string // ニュースの要約
  contentBody: string // ニュースの本文
  sourceName: string | null // ニュースの発信元
  sourceUrl: string | null // 発信元のURL
  clusteringIdentifier: string
  data: {
    area: string
    link: string
  }
  markerImgUrl?: string // マーカーの画像
  publishedAt: Date // ニュースの公開日
  createdAt: Date // DBに登録された日時
}
