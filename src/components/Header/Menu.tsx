"use client"

import Link from "next/link"

type MenuProps = {
  isOpen: boolean
  onClose: () => void
}

export function Menu({ isOpen, onClose }: MenuProps) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute right-0 top-0 h-full w-64 bg-white shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <nav className="space-y-4">
            <Link
              href="/"
              className="block text-lg hover:text-blue-600 transition-colors"
              onClick={onClose}
            >
              🗺️ マップを見る
            </Link>
            <Link
              href="/guide"
              className="block text-lg hover:text-blue-600 transition-colors"
              onClick={onClose}
            >
              📖 使い方ガイド
            </Link>
            {/* 必要に応じて他のメニュー項目を追加 */}
          </nav>

          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500">
              ライブマップ.NETは、地域の最新情報をリアルタイムでお届けするサービスです。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
