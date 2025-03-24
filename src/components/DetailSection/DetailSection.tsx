import React from "react"
import Link from "next/link"
import { ChevronIcon } from "../Icons/ChevronIcon"
import { ExternalLinkIcon } from "../Icons/ExternalLinkIcon"
import { categoryStyleMap } from "@/utils/function/map/categoryStyleMap"

type DetailSectionProps = {
  selectedAnnotation: mapkit.Annotation
}

/**
 * 詳細情報セクション
 * @param selectedAnnotation 選択されたアノテーション
 * @returns 詳細情報セクション
 */
export const DetailSection: React.FC<DetailSectionProps> = ({ selectedAnnotation }) => (
  <section className="text-gray-700 flex flex-col gap-2">
    <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">📍詳細情報</h2>

    <div className="mb-4">
      <p className="flex text-lg font-bold items-center gap-2 bg-white p-4 border border-gray-300 rounded-lg">
        <span className="text-2xl mb-1">
          {categoryStyleMap[selectedAnnotation.data.category]?.emoji || "❓"}
        </span>
        {selectedAnnotation.data.category}
      </p>
    </div>

    {selectedAnnotation.data.address && (
      <div className="mb-4">
        <h3 className="font-semibold text-lg leading-loose">エリア情報</h3>
        <p>{selectedAnnotation.data.address}</p>
      </div>
    )}

    {selectedAnnotation.data.predictedLocation && (
      <div className="mb-4">
        <h3 className="font-semibold text-lg leading-loose">AIによる位置推定</h3>
        <p>{selectedAnnotation.data.predictedLocation}</p>
      </div>
    )}

    {selectedAnnotation.title && (
      <div className="mb-4">
        <h3 className="font-semibold text-lg leading-loose">概要</h3>
        <p>{selectedAnnotation.title}</p>
      </div>
    )}

    {selectedAnnotation.data.sourceName && (
      <div className="mb-4">
        <h3 className="font-semibold text-lg leading-loose">情報発信元</h3>
        <Link
          href={selectedAnnotation.data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between border dark:hover:bg-gray-800 border-gray-300 text-gray-700 p-4 rounded-md transition"
        >
          <p className="flex items-center gap-2">
            <ExternalLinkIcon className="fill-gray-700 size-3.5" />
            <span className="text-lg tracking-wide">{selectedAnnotation.data.sourceName}</span>
          </p>
          <ChevronIcon className="fill-gray-700 size-3 rotate-180" />
        </Link>
      </div>
    )}

    {selectedAnnotation.data.publishedAt && (
      <div className="mb-4">
        <h3 className="font-semibold text-lg leading-loose">情報発信日時</h3>
        <p>
          {new Date(selectedAnnotation.data.publishedAt).toLocaleString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </p>
      </div>
    )}
  </section>
)
