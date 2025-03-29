import Image from "next/image"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex items-center min-h-[80vh]">
      <div className="container mx-auto h-full px-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-8">
          {/* キャッチコピー */}
          <div className="inline-block bg-blue-600/10 px-6 py-2 rounded-full">
            <p className="text-blue-700 font-medium">地域の安全・安心をリアルタイムで</p>
          </div>
          {/* h1を移動し、デザインを変更 */}
          <h1 className="text-4xl md:text-6xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-400">
              ライブマップ.NET
            </span>
          </h1>
          <h2 className="text-2xl md:text-5xl font-bold text-gray-800 leading-tight">
            福岡の「今」を
            <span className="text-blue-600">地図</span>
            で見える化
          </h2>
          <p className="text-base text-gray-600">
            ニュースも、事件も、消防・救急情報も。
            <br />
            あなたの街の出来事をリアルタイムでお届け。
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              target="_blank"
              className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition"
            >
              今すぐ確認する
            </Link>
          </div>
        </div>
        <div className="relative w-full h-full min-h-[480px] rounded-lg overflow-hidden">
          <Image
            src="/images/map-preview.png"
            alt="ライブマップのプレビュー"
            fill
            className="object-contain shadow-2xl"
          />
          {/* フローティングカード */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg w-[90%]">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🚨</div>
              <div>
                <p className="text-sm text-gray-500">最新の更新</p>
                <p className="font-medium">福岡市中央区で交通事故の情報を確認</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
