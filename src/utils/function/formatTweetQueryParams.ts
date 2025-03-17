import { MarkerAnnotationData } from "@/utils/type/map/MapAnnotationType"

/**
 * 🔄 マップアノテーションデータを Twitter API に渡すためのクエリに変換する関数
 *
 * @param {MapAnnotationData} data - 選択されたマップアノテーションデータ
 * @returns {string} 変換後の検索クエリ（例: `"ハッカソン,福岡市|ハッカソン,中央区|ハッカソン,天神"`）
 */
export const formatTweetQueryParams = (data: MarkerAnnotationData): string => {
  // 📌 エリア情報を都道府県・市区町村レベルまでにする（丁目・番地は除外）
  let areaParts = data.area
    .replace(/[0-9０-９\-−丁目番地号]/g, "") // 「1丁目10−20」などの詳細住所を削除
    .replace(/市|区|町|村|県|府|道|都/g, " ") // 「市・区・町・村・県」をスペースに変換
    .split(/\s+/) // 空白で分割
    .map((part) => part.trim()) // 前後のスペースを除去
    .filter((part) => part.length > 1) // 1文字の単語は削除（例: "区"）

  if (areaParts.length === 0) {
    return data.category // エリア情報がない場合はカテゴリのみ
  }

  // 📌 `ハッカソン,福岡市 | ハッカソン,中央区 | ハッカソン,天神`
  const andGroups = areaParts.map((area) => `${data.category},${area}`)

  // 📌 `groups` パラメータを作成（`|` で結合）
  return andGroups.join("|")
}
