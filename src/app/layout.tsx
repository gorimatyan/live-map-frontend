import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Head from "next/head"
import Script from "next/script"
import { Noto_Sans_JP } from "next/font/google"

const NotoSansJPFont = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ライブマップ.net | 地域の災害・ニュース情報をリアルタイムで", // ①ページのタイトル ②検索結果に表示されるタイトルで、クリック率に大きく影響する最重要SEO要素
  description: "ライブマップ.netは、地域の災害・ニュース情報をリアルタイムで提供するサイトです。", // ①ページの概要説明 ②検索結果のスニペットに表示され、クリック率向上に貢献するSEO要素
  keywords:
    "ライブマップ.net, 地域の災害・ニュース情報, リアルタイム, 災害情報, 地図, 安全マップ, リアルタイム, 地域ニュース", // ①ページのキーワード一覧 ②現在の検索エンジンでは重要度は低いが、サイト内の重要語句の明示に役立つ

  // ①SNSシェア時のプレビュー情報を定義するブロック ②SNSでのシェア時の表示を最適化し、ソーシャルメディアからの流入を増やすSEO要素
  openGraph: {
    title: "ライブマップ.net | 地域の災害・ニュース情報をリアルタイムで", // ①SNS共有時のタイトル ②SNSでシェアされた際の表示タイトルで、ソーシャルメディアからの流入増加に寄与
    description: "ライブマップ.netは、地域の災害・ニュース情報をリアルタイムで提供するサイトです。", // ①SNS共有時の説明文 ②SNSでシェアされた際の説明文で、ユーザーのクリック意欲を高める
    images: ["/og-image.jpg"], // ①SNS共有時の画像URL ②SNSシェア時のサムネイル画像として表示され、視覚的注目度を高めるSEO要素
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // データセット全体を示す構造化データ
  const structuredData = {
    "@context": "https://schema.org", // ①schema.orgの名前空間を指定 ②検索エンジンに構造化データの規格を伝える基本設定
    "@type": "Dataset", // ①コンテンツの種類をデータセットとして指定 ②データ集合として検索エンジンが認識し、データセット検索での表示機会を高める
    name: "ライブマップ.net 災害・ニュース情報データセット", // ①データセットの名称 ②検索結果でのリッチスニペット表示時のタイトルとして使用される
    description:
      "ライブマップ.netは、地域の災害・ニュース情報をリアルタイムで提供するサイトです。災害情報、事件・事故情報、地域ニュースなどをマップ上で確認できます。", // ①データセットの説明 ②リッチリザルトの説明文として使用され、コンテンツの内容を詳しく伝える
    keywords: ["災害情報", "防犯情報", "地域ニュース", "リアルタイム", "地図", "福岡"], // ①データセットのキーワード ②コンテンツの主要テーマを検索エンジンに伝え、関連検索での表示確率を高める
    url: "https://livemap.net", // ①データセットのURL ②正規URLを示し、重複コンテンツ問題を回避するためのカノニカルURL指定
    creator: {
      // ①作成者情報のブロック ②コンテンツの信頼性を高める情報として検索エンジンに提供
      "@type": "Organization", // ①組織としての型を指定 ②法人/組織が提供するコンテンツであることを示し、E-E-A-Tスコアに寄与
      name: "ライブマップ.net", // ①組織名 ②ブランド名を明示し、検索エンジンにコンテンツの発行元を伝える
      url: "https://livemap.net", // ①組織のURL ②公式サイトを示し、情報の権威性を高める
    },
    temporalCoverage: "2023-01-01/..", // ①データの時間的範囲 ②データの鮮度や時間範囲を検索エンジンに伝え、時間的関連性を示す
    spatialCoverage: {
      // ①地理的範囲のブロック ②地域に関連するデータであることを明示し、ローカル検索での表示確率を高める
      "@type": "Place", // ①場所の型を指定 ②地理情報であることを検索エンジンに伝える
      name: "福岡県", // ①地域名 ②特定地域との関連性を明示し、地域検索での上位表示に貢献
      geo: {
        // ①地理座標情報 ②正確な位置情報を検索エンジンに提供し、地図検索での関連性を高める
        "@type": "GeoShape", // ①地理形状の型 ②エリアを示す地理データであることを検索エンジンに伝える
        box: "33.4 130.1 33.9 130.8", // ①緯度経度の境界ボックス ②カバーする地理的範囲を示し、地域検索での関連性を高める
      },
    },
    includedInDataCatalog: {
      // ①所属するカタログ情報 ②より大きなデータ集合の一部であることを示し、データの文脈を提供
      "@type": "DataCatalog", // ①データカタログの型 ②カタログ情報であることを検索エンジンに伝える
      name: "ライブマップ.net データカタログ", // ①カタログ名 ②データの出所を示し、情報の信頼性を高める
    },
    distribution: [
      // ①データ配布方法のリスト ②データへのアクセス方法を検索エンジンに伝え、データの利用可能性を示す
      {
        "@type": "DataDownload", // ①データダウンロードの型 ②アクセス可能なデータであることを検索エンジンに伝える
        encodingFormat: "application/json", // ①データ形式 ②データフォーマットを示し、技術的な互換性を伝える
        contentUrl: "https://livemap.net/api/disaster-data", // ①データアクセスURL ②APIやデータへの直接リンクを提供し、データの検証可能性を高める
      },
      {
        "@type": "DataDownload", // ①データダウンロードの型 ②アクセス可能なデータであることを検索エンジンに伝える
        encodingFormat: "text/html", // ①データ形式 ②HTMLフォーマットであることを示し、ウェブページとしての閲覧可能性を伝える
        contentUrl: "https://livemap.net/fukuoka", // ①データアクセスURL ②ウェブページとしてのアクセス方法を提供し、ユーザーフレンドリーなデータ表示を示す
      },
    ],
    variableMeasured: [
      // ①測定変数のリスト ②データセットに含まれる情報の種類を検索エンジンに伝え、関連検索での表示確率を高める
      "災害情報",
      "事件情報",
      "事故情報",
      "防犯情報",
      "地域ニュース",
    ],
    isAccessibleForFree: true, // ①無料アクセス可能かの真偽値 ②無料コンテンツであることを検索エンジンに伝え、ユーザーにとっての価値を高める
    license: "https://creativecommons.org/licenses/by/4.0/", // ①ライセンス情報 ②データの使用条件を示し、再利用性と信頼性を高める
    dateModified: new Date().toISOString(), // ①最終更新日 ②コンテンツの鮮度を示し、検索エンジンの新鮮さ評価に寄与
    publisher: {
      // ①発行者情報 ②コンテンツの公式発行元を示し、権威性と信頼性を高める
      "@type": "Organization", // ①組織としての型 ②法人発行のコンテンツであることを示し、E-E-A-Tスコアに寄与
      name: "ライブマップ.net", // ①組織名 ②ブランド名を再確認し、一貫性のある情報提供
      logo: {
        // ①ロゴ情報 ②視覚的アイデンティティを提供し、ブランド認知を高める
        "@type": "ImageObject", // ①画像オブジェクトの型 ②画像データであることを検索エンジンに伝える
        url: "https://livemap.net/logo.png", // ①ロゴURL ②ブランドの公式ロゴを示し、視覚的アイデンティティを確立
      },
    },
    potentialAction: {
      // ①可能なアクション ②ユーザーが取れるアクションを検索エンジンに伝え、機能性を強調
      "@type": "SearchAction", // ①検索アクションの型 ②検索機能があることを検索エンジンに伝える
      target: {
        // ①アクションのターゲット ②検索URLの構造を検索エンジンに伝え、直接検索機能を提供
        "@type": "EntryPoint", // ①エントリーポイントの型 ②アクション開始点であることを検索エンジンに伝える
        urlTemplate: "https://livemap.net/search?q={search_term_string}", // ①検索URL形式 ②検索パラメータの渡し方を示し、検索機能へのアクセス方法を提供
      },
      "query-input": "required name=search_term_string", // ①検索入力パラメータ ②検索に必要なパラメータ名を示し、検索機能の使い方を説明
    },
  }

  return (
    <html lang="en">
      <Head>
        <Script src="https://cdn.apple-mapkit.com/mk/5.0.x/mapkit.js"></Script>
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${NotoSansJPFont.className} antialiased h-full w-full`}
      >
        <h1 className="opacity-40 absolute top-1 left-1 text-xl font-bold z-10">
          ライブマップ.NET
        </h1>
        {children}
      </body>
    </html>
  )
}
