import { GetAnnotationsType } from "./common/GetAnnotationsType"

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
export type GetNewsData = GetAnnotationsType
