/**
 * fetchを使ってAPIからJSONを取得する関数
 * @param url 取得するURL
 * @returns JSON
 */
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
    next: { revalidate: 600 }, // 10分 = 600秒ごとにサーバー側のキャッシュを再検証
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return response.json()
}
