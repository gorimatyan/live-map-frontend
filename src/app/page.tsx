"use client"

import { AppleMap } from "@/components/AppleMap/AppleMap"
import { useEffect, useState } from "react"
import { GetNewsData, NEWS_API_ENDPOINT } from "@/utils/type/api/GetNewsType"
import { fetchJson } from "@/utils/function/fetchUtil"
import { FIRE_API_ENDPOINT, GetFireData } from "@/utils/type/api/GetMissionType"

export default function Home() {
  const [mapAnnotationData, setMapAnnotationData] = useState<GetNewsData[]>([])

  // データを取得して変換
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fireTruckResponse = await fetchJson<GetFireData[]>(FIRE_API_ENDPOINT)
        const newsResponse = await fetchJson<GetNewsData[]>(NEWS_API_ENDPOINT)
        console.log(fireTruckResponse)
        console.log(newsResponse)
        setMapAnnotationData([...fireTruckResponse, ...newsResponse])
      } catch (error) {
        console.error("データの取得に失敗しました", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="w-full h-[100dvh]">
      <AppleMap
        centerPoint={[33.5902, 130.4017]}
        zoom={10}
        className={"h-full w-full"}
        mapAnnotationData={mapAnnotationData}
      />
    </div>
  )
}
