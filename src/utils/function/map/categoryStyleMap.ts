// カテゴリーに基づく絵文字と色のマッピング
export const categoryStyleMap: Record<string, { emoji: string; color: string }> = {
  火災: { emoji: "🔥", color: "#cc0000" },
  殺人: { emoji: "💀", color: "#222222" },
  救急: { emoji: "🚑", color: "#ffffff" },
  警戒: { emoji: "🚨", color: "#eeee00" },
  窃盗: { emoji: "🕵🏽‍♂️", color: "#222222" },
  事故: { emoji: "💥", color: "#222222" },
  その他: { emoji: "❓", color: "#cccccc" },
  // 他のカテゴリーを追加
}
