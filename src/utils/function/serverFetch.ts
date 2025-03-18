/**
 * サーバーサイドからJSONを取得する関数
 * @param url 取得するURL
 * @returns JSON
 */
export async function serverFetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    // サーバーサイドレンダリング時にキャッシュの挙動を指定
    cache: "no-cache", // キャッシュを使用するが毎回検証（最適なバランス）
    // または revalidate: 600, // ISR向けに10分間キャッシュする場合
  })

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }

  return response.json()
}
