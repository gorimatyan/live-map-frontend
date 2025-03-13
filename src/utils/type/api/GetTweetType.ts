export interface GetTweetData {
  id: string
  text: string
  createdAt: string
  authorId?: string | null
  authorName?: string | null
  authorProfile?: string | null
  mediaUrl?: string | null
  tweetUrl?: string | null
}
