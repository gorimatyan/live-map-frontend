import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-300 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="relative text-3xl md:text-4xl font-bold mb-8 inline-block">
          福岡の「今」を確認してみませんか？
        </h2>
        <p className="text-xl mb-8">登録不要・完全無料でご利用いただけます</p>
        <Link
          target="_blank"
          href="/"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-bold hover:bg-gray-100 transition"
        >
          マップを開く
        </Link>
      </div>
    </section>
  )
}
