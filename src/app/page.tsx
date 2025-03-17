import { MapContainer } from "@/components/MapContainer/MapContainer"
import { NEWS_API_ENDPOINT, GetNewsData } from "@/utils/type/api/GetNewsType"
import { FIRE_API_ENDPOINT, GetFireData } from "@/utils/type/api/GetMissionType"
import { serverFetchJson } from "@/utils/function/serverFetch"
import { Metadata } from "next"
import { RealtimeMapContainer } from "@/components/RealtimeMapContainer/RealtimeMapContainer"

export const metadata: Metadata = {
  title: "ライブマップ.net | 地域の災害・ニュース情報をリアルタイムで",
  description: "ライブマップ.netは、地域の災害・ニュース情報をリアルタイムで提供するサイトです。",
  // その他のメタデータ...
}

// サーバーサイドでの再検証期間を設定（10分 = 600秒）
export const revalidate = 600

// サーバーサイドでの初期データを取得
async function getData() {
  try {
    const fireTruckResponse = await serverFetchJson<GetFireData[]>(FIRE_API_ENDPOINT)
    const newsResponse = await serverFetchJson<GetNewsData[]>(NEWS_API_ENDPOINT)

    // データを結合
    const mapAnnotationData = [...fireTruckResponse, ...newsResponse]

    // 構造化データを生成（最新10件）
    const latestItems = [...mapAnnotationData]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 10)

    return {
      mapAnnotationData,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: latestItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "NewsArticle",
            headline: item.title,
            datePublished: item.publishedAt,
            description: item.summary,
            articleBody: item.contentBody,
            publisher: {
              "@type": "Organization",
              name: item.sourceName || "ライブマップ.net",
              url: item.sourceUrl || "https://livemap.net",
            },
            locationCreated: {
              "@type": "Place",
              name: "福岡県",
              geo: {
                "@type": "GeoCoordinates",
                latitude: item.location.lat,
                longitude: item.location.lng,
              },
            },
          },
        })),
      },
    }
  } catch (error) {
    console.error("サーバーサイドでのデータ取得に失敗しました", error)
    return { mapAnnotationData: [], structuredData: null }
  }
}

export default async function Home() {
  // サーバーサイドで初期データを取得（10分間キャッシュされる）
  const { mapAnnotationData, structuredData } = await getData()

  return (
    <>
      {/* 構造化データを埋め込み（SEO用） */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* リアルタイムデータを取得するクライアントコンポーネント */}
      <RealtimeMapContainer initialData={mapAnnotationData} />
    </>
  )
}
