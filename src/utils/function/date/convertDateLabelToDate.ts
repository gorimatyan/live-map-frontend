/**
 * 日付ラベルを実際の日付に変換する関数
 * @param label 日付ラベル
 * @returns 実際の日付
 */
export const convertDateLabelToDate = (label: string): Date => {
  const today = new Date()

  switch (label) {
    case "今日":
      today.setHours(0, 0, 0, 0) // 今日の00:00:00.000に設定
      return today
    case "今日と昨日":
      const yesterday = new Date(today)
      today.setDate(today.getDate() - 1)
      return today
    case "3日以内":
      return new Date(today.setDate(today.getDate() - 3))
    case "1週間以内":
      return new Date(today.setDate(today.getDate() - 7))
    case "1ヶ月以内":
      return new Date(today.setMonth(today.getMonth() - 1))
    default:
      return today
  }
}
