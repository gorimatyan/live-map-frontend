import React, { useState } from "react";
import { MapAnnotationData } from "@/utils/type/map/MapAnnotationDataType";
import { CalendarIcon } from "@/components/Icons/CalendarIcon";

type NewPointsListProps = {
  mapAnnotationData: MapAnnotationData[];
  selectedCategories: string[];
  onSelectAnnotation: (annotation: MapAnnotationData) => void;
  handleCategoryChange: (category: string) => void;
  categories: string[];
};

const NewPointsList: React.FC<NewPointsListProps> = ({
  mapAnnotationData,
  selectedCategories,
  onSelectAnnotation,
  handleCategoryChange,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<"new" | "filter">("new");

  // 🔹 新着情報を日付の降順でソート
  const sortedAnnotations = [...mapAnnotationData].sort((a, b) =>
    new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
  );

  return (
    <div className="bg-white shadow-lg rounded-xl w-full max-w-[400px] border border-gray-200 overflow-hidden h-screen flex flex-col">
      {/* 📌 タブ切り替え */}
      <div className="flex border-b bg-gray-100 text-center">
        <button
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === "new" ? "text-black border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("new")}
        >
          新着情報
        </button>
        <button
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === "filter" ? "text-black border-b-2 border-black" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("filter")}
        >
          フィルタ
        </button>
      </div>

      {/* 📌 コンテンツ表示 */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "new" ? (
          // 🆕 新着情報タブ
          <div>
            {sortedAnnotations.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition duration-200 flex flex-col cursor-pointer"
                onClick={() => onSelectAnnotation(item)}
              >
                {/* カテゴリ */}
                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full self-start">
                  {item.category}
                </span>

                {/* 日付 & エリア */}
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "日付不明"}
                </div>

                <p className="text-xs text-gray-700 mt-1">{item.data.area || "エリア情報なし"}</p>
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
                className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition"
                >
                <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-800">{category}</span>
                </label>
            ))}
            </div>
        </div>

        {/* 📌 他のフィルター項目が増える場合、ここに追加 */}
        {/* 例: <div>エリア選択、日時フィルターなど</div> */}
        </div>
        )}
      </div>
    </div>
  );
};

export default NewPointsList;