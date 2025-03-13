export interface GetTweetData {
  id: string
  text: string
  createdAt: string
  authorId?: string | null
  authorName?: string | null
  authorProfile?: string | null
  mediaUrl?: string | null
  tweetUrl?: string | null
  isRateLimited?: boolean // API制限時に true
  retryAfter?: number // 429発生時のリトライ推奨秒数
}
