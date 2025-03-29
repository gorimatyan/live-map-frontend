import Link from "next/link"
import { Header } from "@/components/Header/Header"

export const metadata = {
  openGraph: {
    title: "ライブマップ.NETの使い方ガイド",
    description: "地域の最新情報をリアルタイムで確認できるマップサービスの使い方を詳しく解説",
    images: ["/images/guide-ogp.png"],
  },
  alternates: {
    canonical: "https://livemap.net/guide",
  },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm w-full z-40 mb-4">
        <div className="container mx-auto px-4">
          <ol
            className="flex items-center h-12 text-sm"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            <li
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <Link
                href="/"
                itemProp="item"
                className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                <span className="inline-block mr-2">🏠</span>
                <span itemProp="name">ホーム</span>
              </Link>
              <span className="inline-block mx-2">→</span>
            </li>
            <li
              className="flex items-center text-blue-600 font-medium"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <span className="inline-block mr-2">📖</span>
              <span itemProp="name">使い方ガイド</span>
            </li>
          </ol>
        </div>
      </nav>
    </div>
  )
}
