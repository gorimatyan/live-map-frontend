"use client"

import { useEffect, useState } from "react"
import { MapContainer } from "@/components/MapContainer/MapContainer"
import { GetNewsData } from "@/utils/type/api/GetNewsType"
import { fetchJson } from "@/utils/function/fetchUtil"
import { NEWS_API_ENDPOINT } from "@/utils/type/api/GetNewsType"
import { FIRE_API_ENDPOINT, GetFireData } from "@/utils/type/api/GetMissionType"

type RealtimeMapContainerProps = {
  initialData: GetNewsData[]
}

export function RealtimeMapContainer({ initialData }: RealtimeMapContainerProps) {
  // 初期データをサーバーから受け取る
  const [mapAnnotationData, setMapAnnotationData] = useState<GetNewsData[]>(initialData)
  console.log("初期データ", initialData)

  // ユーザーがページを更新（リロード）したときのデータ更新関数
  async function refreshData() {
    try {
      const fireTruckResponse = await fetchJson<GetFireData[]>(FIRE_API_ENDPOINT)
      const newsResponse = await fetchJson<GetNewsData[]>(NEWS_API_ENDPOINT)
      console.log("更新データ", fireTruckResponse.length, newsResponse.length)
      setMapAnnotationData([...fireTruckResponse, ...newsResponse])
    } catch (error) {
      console.error("データの更新に失敗しました", error)
    }
  }

  // ページがフォーカスされたとき（タブが切り替わったとき）にデータを更新
  useEffect(() => {
    // visibilitychangeイベントでページがアクティブになったときに更新
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshData()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    // クリーンアップ関数
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <div>
      {/* 更新ボタン */}
      <button
        onClick={refreshData}
        className="fixed top-2 right-4 z-10 bg-blue-500 text-white py-2 px-4 rounded shadow"
      >
        最新情報に更新
      </button>

      {/* マップ表示 */}
      <MapContainer mapAnnotationData={mapAnnotationData} />
    </div>
  )
}
