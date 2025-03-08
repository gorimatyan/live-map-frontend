import { AppleMap } from "@/components/AppleMap/AppleMap"

export default function Home() {
  return (
    <div className="p-2 w-full h-[90dvh]">
      <h1 className="text-2xl font-bold">福岡県</h1>
      <AppleMap
        centerPoint={[33.5902, 130.4017]}
        zoom={12}
        className={"h-full w-full"}
        mapAnnotationData={[
          {
            id: 1,
            category: "エンタメ",
            location: { lat: 33.5902, lng: 130.4017 },
            title: "福岡タワー",
            subtitle: "福岡のランドマーク",
            clusteringIdentifier: "fukuoka",
            data: {
              area: "福岡市中央区",
              link: "https://ja.wikipedia.org/wiki/福岡タワー",
            },
            // marker: "/images/m3.webp",
          },
          {
            id: 2,
            category: "エンタメ",
            location: { lat: 33.5952, lng: 130.4027 },
            title: "大濠公園",
            subtitle: "福岡のランドマーク",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市中央区",
              link: "https://ja.wikipedia.org/wiki/大濠公園",
            },
          },
          {
            id: 3,
            category: "交通",
            location: { lat: 33.5972, lng: 130.4047 },
            title: "天神駅",
            subtitle: "福岡のランドマーク",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市中央区", // クラスターアノテーションで使用
              link: "https://www.google.com/?igu=1", //
            },
          },
          {
            id: 4,
            category: "交通",
            location: { lat: 33.6192, lng: 130.4197 },
            title: "天神駅",
            subtitle: "福岡のランドマーク",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市東区",
              link: "https://www.nishinippon.co.jp/item/o/1324494/",
            },
          },
          {
            id: 5,
            category: "交通",
            location: { lat: 33.6082, lng: 130.4192 },
            title: "薬院大通駅",
            subtitle: "福岡のランドマーク",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市東区",
              link: "https://ja.wikipedia.org/wiki/薬院大通駅",
            },
          },
        ]}
      />
    </div>
  )
}
