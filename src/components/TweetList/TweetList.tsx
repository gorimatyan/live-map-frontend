import React from "react"
import { TweetData } from "@/utils/type/api/TweetType"
import { HeartIcon } from "../Icons/HeartIcon"
import { RetweetIcon } from "../Icons/RetweetIcon"

type TweetListProps = {
  tweets: TweetData[] | null
}

export const TweetList: React.FC<TweetListProps> = ({ tweets }) => {
  if (tweets === null) {
    return <p>データを取得中...</p>
  }

  // API制限チェック
  if (tweets.length > 0 && tweets[0].isRateLimited) {
    return (
      <div className="p-4 text-center text-red-600">
        <p className="font-semibold">⚠️ Twitter APIの制限によりデータを取得できません。</p>
        {tweets[0].retryAfter && (
          <p className="text-sm text-gray-500 mt-1">
            {tweets[0].retryAfter} 秒後に再試行してください。
          </p>
        )}
      </div>
    )
  }

  if (tweets.length === 0) {
    return <p>関連ツイートはありません。</p>
  }

  return (
    <div className="mt-2 space-y-6">
      {tweets.map((tweet, index) => (
        <a
          key={index}
          href={tweet.tweetUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-gray-300 w-full p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md flex-col flex items-start gap-4 hover:bg-gray-100 transition"
        >
          <div className="flex items-start space-x-4">
            <img
              src={tweet.authorProfile || "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-start gap-0.5 flex-col text-gray-700 dark:text-gray-400">
                <span className="font-semibold">{tweet.authorName}</span>
                <span className="text-sm">@{tweet.authorId}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <p className="text-lg text-gray-700 whitespace-pre-line">{tweet.text}</p>
            {tweet.mediaUrl && (
              <img
                src={tweet.mediaUrl}
                alt="Tweet media"
                className="rounded-lg border w-full object-cover"
              />
            )}
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-between">
              <div className="flex space-x-6 text-sm">
                <button className="hover:text-green-600 text-green-500 fill-green-500 hover:fill-green-600 flex items-center space-x-2">
                  <RetweetIcon className="size-3.5" />
                  <span className="text-sm">リツイート</span>
                </button>
                <button className="hover:text-red-600 text-red-500 fill-red-500 hover:fill-red-600 flex items-center space-x-2">
                  <HeartIcon className="size-3.5" />
                  <span className="text-sm">いいね</span>
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-400">
                {new Date(tweet.createdAt).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}