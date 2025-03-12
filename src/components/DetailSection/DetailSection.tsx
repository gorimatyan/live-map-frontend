import React from "react"
import { MapAnnotationData } from "@/utils/type/map/MapAnnotationDataType"
import Link from "next/link"
import { ChevronIcon } from "../Icons/ChevronIcon"
import { ExternalLinkIcon } from "../Icons/ExternalLinkIcon"
import { categoryStyleMap } from "@/utils/function/map/categoryStyleMap"

type DetailSectionProps = {
  selectedAnnotation: MapAnnotationData
}

export const DetailSection: React.FC<DetailSectionProps> = ({ selectedAnnotation }) => (
  <section className="text-gray-700 flex flex-col gap-2">
    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">📍詳細情報</h2>

    <div className="mb-4">
      <p className="flex text-lg font-bold items-center gap-2 bg-white p-4 border border-gray-300 rounded-lg">
        <span className="text-2xl mb-1">
          {categoryStyleMap[selectedAnnotation.category]?.emoji || "❓"}
        </span>
        {selectedAnnotation.category}
      </p>
    </div>

    <div className="mb-4">
      <h3 className="font-semibold text-lg leading-loose">エリア情報</h3>
      <p>{selectedAnnotation.data.area}</p>
    </div>

    {selectedAnnotation.title && (
      <div className="mb-4">
        <h3 className="font-semibold text-lg leading-loose">概要</h3>
        <p>{selectedAnnotation.title}</p>
      </div>
    )}

    {selectedAnnotation.data.link && (
      <Link
        href={selectedAnnotation.data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between bg-blue-500 hover:bg-blue-600 text-[#ffffff] p-4 rounded-md transition"
      >
        <p className="flex items-center gap-2">
          <ExternalLinkIcon className="fill-[#ffffff] size-3.5" />
          <span className="text-lg tracking-wide">詳細ページへ</span>
        </p>
        <ChevronIcon className="fill-[#eeeeee] size-3 rotate-180" />
      </Link>
    )}
  </section>
)
