"use client"

import { useEffect, useState } from "react"
import { MapContainer } from "@/components/MapContainer/MapContainer"
import { GetNewsData } from "@/utils/type/api/GetNewsType"
import { fetchJson } from "@/utils/function/fetchUtil"
import { NEWS_API_ENDPOINT } from "@/utils/type/api/GetNewsType"
import { FIRE_API_ENDPOINT, GetFireData } from "@/utils/type/api/GetMissionType"
import Link from "next/link"

type RealtimeMapContainerProps = {
  initialData: GetNewsData[]
}

// モーダルコンポーネントを作成
const WelcomeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          🗺️
          <span className="text-xl">
            福岡のニュースマップ！
            <br />
            ライブマップ.netへようこそ！
          </span>
        </h2>

        <div className="space-y-4">
          <p>このマップでは、地域のニュース情報をリアルタイムで確認できます。</p>

          <div className="space-y-2">
            <h3 className="font-bold text-lg">📍 主な機能：</h3>
            <ul className="ml-2 list-disc pl-5 space-y-1">
              <li>地域のニュースや火災・救急情報をマップ上でチェック</li>
              <li>カテゴリー別の情報フィルタリング</li>
              <li>詳細情報の表示＋外部ニュースサイトへのリンク</li>
              <li>(ほぼ)リアルタイムでの情報更新</li>
            </ul>
          </div>

          <div className="pt-4">
            <Link
              href="/guide"
              className="block text-center w-full text-blue-500 border border-blue-500 mb-2 bg-white py-2 px-4 rounded hover:bg-blue-600 hover:text-white transition-colors"
            >
              使い方を見る
            </Link>
            <button
              onClick={onClose}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              はじめる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RealtimeMapContainer({ initialData }: RealtimeMapContainerProps) {
  const [mapAnnotationData, setMapAnnotationData] = useState<GetNewsData[]>(initialData)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  useEffect(() => {
    // ローカルストレージをチェック
    const hasVisited = localStorage.getItem("hasVisitedBefore")
    if (!hasVisited) {
      setShowWelcomeModal(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  // 初期データをサーバーから受け取る
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
      <WelcomeModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />

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
