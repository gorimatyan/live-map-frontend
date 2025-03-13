import { MapAnnotationType } from "../map/MapAnnotationType"

export const FIRE_API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fire-trucks/missions`

export type GetFireData = MapAnnotationType
