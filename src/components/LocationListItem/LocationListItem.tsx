"use client"

import { CalendarIcon } from "@/components/Icons/CalendarIcon"

type LocationListItemProps = {
  category: string
  contentBody: string
  publishedAt: Date
  address: string | null
  onClick: () => void
}

/**
 * サイドバーに表示する情報のリストアイテム
 * @param param0
 * @returns
 */
export function LocationListItem({
  onClick,
  category,
  contentBody,
  publishedAt,
  address,
}: LocationListItemProps) {
  return (
    <div
      className="px-4 py-4 border-b border-gray-200 last:rounded-b-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-200 flex flex-col gap-2 cursor-pointer"
      onClick={onClick}
    >
      {/* カテゴリ */}
      <span className="text-sm font-semibold px-4 bg-blue-100 text-blue-700 rounded-full self-start">
        {category}
      </span>

      <span className="text-sm font-semibold text-gray-700 self-start">{contentBody}</span>

      {/* 日付 & エリア */}
      <div className="flex items-center text-sm text-gray-400">
        <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
        {publishedAt
          ? new Date(publishedAt).toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "日付不明"}
      </div>

      <p className="text-sm text-gray-700">{address || "エリア情報なし"}</p>
    </div>
  )
}
