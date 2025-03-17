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
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`)
  }
  return response.json()
}
