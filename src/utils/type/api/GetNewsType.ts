export type MapInstance = mapkit.Map
export type MapkitInstance = typeof mapkit

export const NEWS_API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news`

/**
 * APIから取得したニュース・消防データ
 * mapkit.Annotationとの違い：
 *  - mapkit.Annotationは、アノテーションのデータ型。アノテーションから取得したデータを使用する場合に用いられる。
 *  - GetNewsDataは、APIから取得するニュース・消防データの型で、mapkit.Annotationのデータ型に合わせた型。
 *  - APIから受け取ったGetNewsDataをアノテーションに使用したら、mapkit.Annotationのデータ型になると考えるといいかも。
 */
export type GetNewsData = {
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
