import { AppleMap } from "@/components/AppleMap/AppleMap"

export default function Home() {
  return (
    <div className="w-full h-[100dvh]">
      <AppleMap
        centerPoint={[33.5902, 130.4017]}
        zoom={12}
        className={"h-full w-full"}
        mapAnnotationData={[
          {
            id: 1,
            category: "火事",
            location: { lat: 33.5902, lng: 130.4017 },
            title: "フロートで沖に流され転落事故、注意喚起！",
            subtitle: "福岡県福岡市東区 志賀島",
            clusteringIdentifier: "fukuoka",
            data: {
              area: "福岡市中央区",
              link: "https:\/\/mainichi.jp",
            },
            // marker: "/images/m3.webp",
          },
          {
            id: 2,
            category: "火事",
            location: { lat: 33.5952, lng: 130.4027 },
            title: "家が燃えました",
            subtitle: "福岡市中央区",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市中央区",
              link: "https://ja.wikipedia.org/wiki/大濠公園",
            },
          },
          {
            id: 3,
            category: "殺人",
            location: { lat: 33.5972, lng: 130.4047 },
            title: "駅付近で殺人事件",
            subtitle: "福岡市東区",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市中央区", // クラスターアノテーションで使用
              link: "https://www.google.com/?igu=1", //
            },
          },
          {
            id: 4,
            category: "殺人",
            location: { lat: 33.6192, lng: 130.4197 },
            title: "道端で殺人事件",
            subtitle: "福岡市東区",
            clusteringIdentifier: "fukuoka",
            // marker: "/images/m3.webp",
            data: {
              area: "福岡市東区",
              link: "https://www.nishinippon.co.jp/item/o/1324494/",
            },
          },
          {
            id: 5,
            category: "殺人",
            location: { lat: 33.6082, lng: 130.4192 },
            title: "薬院大通駅で事件発生。",
            subtitle: "福岡市東区",
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
