import { MapContainer } from "@/components/MapContainer/MapContainer"
import { NEWS_API_ENDPOINT, GetNewsData } from "@/utils/type/api/GetNewsType"
import { FIRE_API_ENDPOINT, GetFireData } from "@/utils/type/api/GetMissionType"
import { serverFetchJson } from "@/utils/function/serverFetch"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ライブマップ.net | 地域の災害・ニュース情報をリアルタイムで",
  description: "ライブマップ.netは、地域の災害・ニュース情報をリアルタイムで提供するサイトです。",
  // その他のメタデータ...
}

// サーバーサイドでデータを取得
async function getData() {
  try {
    const fireTruckResponse = await serverFetchJson<GetFireData[]>(FIRE_API_ENDPOINT)
    const newsResponse = await serverFetchJson<GetNewsData[]>(NEWS_API_ENDPOINT)

    // データを結合
    const mapAnnotationData = [...fireTruckResponse, ...newsResponse]
    return mapAnnotationData
  } catch (error) {
    console.error("サーバーサイドでのデータ取得に失敗しました", error)
    return []
  }
}

export default async function Home() {
  // サーバーサイドでデータを取得
  const mapAnnotationData = await getData()

  // 最新10件のデータを抽出してスキーママークアップを作成
  const latestItems = [...mapAnnotationData]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10)

  // ItemListとしてマークアップ（コレクションを示す最適な方法）
  const structuredData = {
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
  }

  return (
    <>
      {/* JSON-LDスクリプトをページに埋め込む */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <MapContainer mapAnnotationData={mapAnnotationData} />
    </>
  )
}
