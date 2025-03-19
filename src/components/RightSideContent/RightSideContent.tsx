import React, { useState } from "react"
import { GetNewsData } from "@/utils/type/api/GetNewsType"
import { CalendarIcon } from "@/components/Icons/CalendarIcon"

type RightSideContentProps = {
  mapAnnotationData: GetNewsData[]
  selectedCategories: string[]
  onSelectAnnotation: (annotation: GetNewsData) => void
  handleCategoryChange: (category: string) => void
  categories: string[]
  selectedDate: string
  handleDateChange: (date: string) => void
  dates: string[]
}

export const RightSideContent: React.FC<RightSideContentProps> = ({
  mapAnnotationData,
  selectedCategories,
  onSelectAnnotation,
  handleCategoryChange,
  categories,
  selectedDate,
  handleDateChange,
  dates,
}) => {
  const [activeTab, setActiveTab] = useState<"new" | "filter">("new")

  // 🔹 新着情報を日付の降順でソート
  const sortedAnnotations = [...mapAnnotationData].sort(
    (a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
  )

  // カテゴリーのチェックをすべて外す
  const clearAllCategories = () => {
    selectedCategories.forEach((category) => handleCategoryChange(category))
  }

  // カテゴリーのチェックをすべて付ける
  const selectAllCategories = () => {
    categories.forEach((category) => {
      if (!selectedCategories.includes(category)) {
        handleCategoryChange(category)
      }
    })
  }

  // 日時のチェックを外す
  const clearDateSelection = () => {
    handleDateChange("")
  }

  return (
    <div className="bg-gray-100 max-h-full shadow-lg rounded-lg w-full overflow-hidden h-screen flex flex-col">
      {/* 📌 タブ切り替え */}
      <div className="flex border rounded-t-lg bg-white text-center sticky top-0 z-10">
        <button
          className={`flex-1 rounded-t-lg py-3 font-bold bg-white hover:bg-gray-200 dark:hover:bg-gray-800 ${
            activeTab === "new"
              ? "text-black border-b-2 border-gray-700 dark:text-white"
              : "text-gray-700 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("new")}
        >
          新着情報
        </button>
        <button
          className={`flex-1 rounded-t-lg py-3 font-bold bg-white hover:bg-gray-200 dark:hover:bg-gray-800 ${
            activeTab === "filter"
              ? "text-black border-b-2 border-gray-700 dark:text-white"
              : "text-gray-700 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("filter")}
        >
          フィルタ
        </button>
      </div>

      {/* 📌 コンテンツ表示 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide border rounded-b-lg border-gray-200 bg-white">
        {activeTab === "new" ? (
          // 🆕 新着情報タブ
          <div className="bg-white">
            {sortedAnnotations.map((item, index) => (
              <div
                key={index}
                className="px-4 py-4 border-b border-gray-200 last:rounded-b-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-200 flex flex-col gap-2 cursor-pointer"
                onClick={() => onSelectAnnotation(item)}
              >
                {/* カテゴリ */}
                <span className="text-sm font-semibold px-4 bg-blue-100 text-blue-700 rounded-full self-start">
                  {item.category}
                </span>

                <span className="text-sm font-semibold text-gray-700 self-start">
                  {item.contentBody}
                </span>

                {/* 日付 & エリア */}
                <div className="flex items-center text-sm text-gray-400">
                  <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "日付不明"}
                </div>

                <p className="text-sm text-gray-700">{item.data.address || "エリア情報なし"}</p>
              </div>
            ))}
          </div>
        ) : (
          // 🔍 カテゴリフィルタタブ
          <div className="p-4 space-y-4">
            {/* 📌 カテゴリー選択エリア */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 border-b mb-2"> カテゴリー</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 bg-white p-2 rounded-md cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <p>
                      <span></span>
                      <span className="text-sm text-gray-700">{category}</span>
                    </p>
                  </label>
                ))}
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={clearAllCategories}
                  className="text-sm text-blue-600 hover:underline"
                >
                  全て外す
                </button>
                <button
                  onClick={selectAllCategories}
                  className="text-sm text-blue-600 hover:underline"
                >
                  全て選択
                </button>
              </div>
            </div>
            {/* 📌 他のフィルター項目が増える場合、ここに追加 */}
            {/* 例: <div>エリア選択、日時フィルターなど</div> */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 border-b mb-2">日時</h4>
              <div className="grid gap-2">
                {dates.map((date) => (
                  <label
                    key={date}
                    className="flex items-center space-x-2 bg-white p-2 rounded-md cursor-pointer transition"
                  >
                    <input
                      type="radio"
                      value={date}
                      name="date"
                      checked={selectedDate === date}
                      onChange={() => handleDateChange(date)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <p>
                      <span></span>
                      <span className="text-sm text-gray-700">{date}</span>
                    </p>
                  </label>
                ))}
              </div>
              <button
                onClick={clearDateSelection}
                className="text-sm text-blue-600 hover:underline mt-2"
              >
                選択をクリア
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
