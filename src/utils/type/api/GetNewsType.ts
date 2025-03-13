import { MapAnnotationType } from "../map/MapAnnotationType"

export type MapInstance = mapkit.Map
export type MapkitInstance = typeof mapkit

export const NEWS_API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news`

export type GetNewsData = MapAnnotationType
