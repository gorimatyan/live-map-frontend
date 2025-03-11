"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  MapAnnotationData,
  MapInstance,
  MapkitInstance,
} from "@/utils/type/map/MapAnnotationDataType"
import { renderAnnotations } from "@/utils/function/map/renderAnnotation"
import { loadMapkitJs } from "@/utils/function/map/loadMapkitJs"
import { toCompatibleBounds } from "@/utils/function/map/toCompatibleBounds"
import { ChevronIcon } from "../Icons/ChevronIcon"
import { fetchJson } from "@/utils/function/fetchUtil"
import { TweetData } from "@/utils/type/api/TweetType"
import { formatTweetQueryParams } from "@/utils/function/formatTweetQueryParams"
import Link from "next/link"
import { ExternalLinkIcon } from "../Icons/ExternalLinkIcon"
import { MoonIcon } from "../Icons/MoonIcon"
import { SunIcon } from "../Icons/SunIcon"
import { categoryStyleMap } from "@/utils/function/map/categoryStyleMap"
import { HeartIcon } from "../Icons/HeartIcon"
import { RetweetIcon } from "../Icons/RetweetIcon"

type AppleMapProps = {
  centerPoint: [number, number]
  mapOptions?: mapkit.MapConstructorOptions
  zoom: number
  onBoundsChanged?: (bounds: {
    getSouthWest: () => [number, number]
    getNorthEast: () => [number, number]
  }) => void
  mapAnnotationData: MapAnnotationData[]
} & React.HTMLAttributes<HTMLDivElement>

const categories = ["火災", "殺人", "救急", "警戒", "ハッカソン", "その他"]

export const AppleMap = ({
  centerPoint,
  mapOptions = {},
  zoom,
  onBoundsChanged,
  className,
  mapAnnotationData = [],
  ...props
}: AppleMapProps) => {
  const div = useRef<HTMLDivElement>(null)
  const mapRef = useRef<[MapInstance, MapkitInstance] | null>(null) // マップの状態管理用のref
  const annotationRefs = useRef<Record<string, any>>({}) // アノテーション（マップにある印）の状態管理用のref
  const [isSideFrameOpen, setIsSideFrameOpen] = useState<boolean>(false)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<MapAnnotationData | null>(null)
  const [tweetsCache, setTweetsCache] = useState<Record<number, TweetData[]>>({})
  const [tweets, setTweets] = useState<TweetData[] | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false) // ダークモードの状態を管理

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }

  /**
   * このuseEffectはカテゴリーが変更されたときの処理。
   * やってることはアノテーションを全部消して、新しく追加してフィルターで弾かれたやつを消すだけ。
   */
  useEffect(() => {
    if (!mapRef.current) return

    // mapの状態を取得
    const [map] = mapRef.current

    // 全てのアノテーションを一旦削除
    const allAnnotations = map.annotations
    map.removeAnnotations(allAnnotations)

    // 重複を避けるためのannotationRefsも一旦削除
    annotationRefs.current = {}

    // 全てのアノテーションを追加
    renderAnnotations(mapRef, annotationRefs, mapAnnotationData)

    // 全てのアノテーションを取得
    const newAllAnnotations = map.annotations

    // 選択済みのカテゴリーを除外したアノテーションを取得
    const shouldRemoveAnnotations = newAllAnnotations.filter(
      (annotation) => !selectedCategories.includes(annotation.data.category)
    )

    // 全てのアノテーションから選択済みのカテゴリーを除外したアノテーションを削除
    map.removeAnnotations(shouldRemoveAnnotations)
  }, [selectedCategories, mapAnnotationData])

  useEffect(() => {
    if (!div.current) {
      return
    }

    // Mapkit.jsを読み込んだらマップの初期化を実行
    loadMapkitJs().then((mapkit: MapkitInstance) => {
      console.log("mapkitがloadされました")
      if (mapRef.current) {
        // 既存のマップインスタンスを削除
        const [map] = mapRef.current
        map.destroy()
        mapRef.current = null
        // 重複を避けるためのannotationRefsも一旦削除
        annotationRefs.current = {}
      }

      _initializeMap(mapkit)
    })
  }, [div, isDarkMode]) // isDarkModeが変わるたびに再レンダリング

  useEffect(() => {
    setIsSideFrameOpen(!!selectedAnnotation)
  }, [selectedAnnotation])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const selectedElement = document.getElementsByClassName(".mk-selected")[0]
          if (selectedElement) {
            setSelectedElement(selectedElement.cloneNode(true) as HTMLElement)
          }
        }
      })
    })

    const targetNode = document.body
    observer.observe(targetNode, { attributes: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  /**
   * マップを初期化する関数
   * @param mapkit Mapkit.jsのインスタンス
   */
  const _initializeMap = (mapkit: MapkitInstance) => {
    div.current!.innerHTML = ""
    const map = new mapkit.Map(div.current!, {
      colorScheme: isDarkMode ? mapkit.Map.ColorSchemes.Dark : mapkit.Map.ColorSchemes.Light, // モードに応じて色を設定
    })
    mapRef.current = [map, mapkit] as [MapInstance, MapkitInstance]

    _setInitialRegion(map)
    _setupClusterAnnotation(map)
    _setupEventListeners(map)
    renderAnnotations(mapRef, annotationRefs, mapAnnotationData)
  }

  /**
   * マップの初期表示座標を設定する関数
   * @param map マップのインスタンス
   */
  const _setInitialRegion = (map: MapInstance) => {
    const zoomLevel = Math.min(21, zoom + 1 || 12)
    const delta = (1 / Math.exp(zoomLevel * Math.LN2)) * 360
    map.region = new mapkit.CoordinateRegion(
      new mapkit.Coordinate(Number(centerPoint[0]), Number(centerPoint[1])),
      new mapkit.CoordinateSpan(delta, delta)
    )
  }

  /**
   * クラスターアノテーションの設定を行う関数
   * @param map マップのインスタンス
   */
  const _setupClusterAnnotation = (map: MapInstance) => {
    map.annotationForCluster = function (clusterAnnotation) {
      if (clusterAnnotation.clusteringIdentifier === "city") {
      }

      // クリック時に表示される要素の設定
      const calloutDelegate = _createCalloutDelegate()

      // クラスター（複数のピンがまとまった状態）のアノテーションの設定
      const allAnnotationsCount = clusterAnnotation.memberAnnotations.length

      const firstArea = clusterAnnotation.memberAnnotations[0].data.area
      const firstTitle = clusterAnnotation.memberAnnotations[0].title
      const hasDifferentArea = clusterAnnotation.memberAnnotations.some(
        (annotation) => annotation.data.area !== firstArea
      )
      const hasDifferentTitle = clusterAnnotation.memberAnnotations.some(
        (annotation) => annotation.title !== firstTitle
      )

      const includedArea = hasDifferentArea ? `${firstArea} +他` : firstArea
      const includedTitle = hasDifferentTitle ? `${firstTitle} +他` : firstTitle

      const customAnnotationForCluster = new mapkit.MarkerAnnotation(clusterAnnotation.coordinate, {
        title: includedTitle,
        subtitle: includedArea,
        glyphText: allAnnotationsCount.toString(),
        color: "#e30aFF",
        size: { width: 36, height: 52 },
        collisionMode: mapkit.Annotation.CollisionMode.Rectangle, // Circleの方が良い？
        callout: calloutDelegate,
        data: {
          area: includedArea,
          link: clusterAnnotation.memberAnnotations[0].data.link,
        },
      })

      return customAnnotationForCluster
    }
  }

  /**
   * クリック時に表示される要素の設定を行う関数
   */
  const _createCalloutDelegate = () => ({
    calloutElementForAnnotation: function (annotation: mapkit.Annotation) {
      const element = document.createElement("div")
      element.className = "review-callout"

      const title = element.appendChild(document.createElement("h1"))
      title.textContent = annotation.title

      const link = element.appendChild(document.createElement("a"))
      link.href = annotation.data.link
      link.textContent = annotation.data.area

      // スタイルを設定
      element.style.width = "240px"
      element.style.height = "100px"
      element.style.position = "relative"
      element.style.backgroundColor = "white"
      element.style.border = "1px solid #ccc"
      element.style.borderRadius = "10px"
      element.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
      element.style.padding = "10px"

      // 吹き出しの三角形を追加
      const triangle = document.createElement("div")
      triangle.style.position = "absolute"
      triangle.style.bottom = "-10px"
      triangle.style.left = "50%"
      triangle.style.transform = "translateX(-50%)"
      triangle.style.width = "0"
      triangle.style.height = "0"
      triangle.style.borderLeft = "10px solid transparent"
      triangle.style.borderRight = "10px solid transparent"
      triangle.style.borderTop = "10px solid white"

      element.appendChild(triangle)

      return element
    },
  })

  /**
   * マップのイベントリスナーを設定する関数
   * @param map マップのインスタンス
   */
  const _setupEventListeners = (map: MapInstance) => {
    // マーカーをクリックしたときの処理
    map.addEventListener("select", async function (event) {
      if (!event.annotation?.coordinate) {
        return
      }

      // クリックしたマーカーの座標を取得して拡大表示する
      const coordinate = event.annotation.coordinate
      const currentRegion = map.region
      const currentSpan = currentRegion.span
      const region = new mapkit.CoordinateRegion(coordinate, currentSpan)

      // クラスターアノテーションをクリックの場合は処理を中断
      if (event.annotation?.memberAnnotations != undefined) {
        const newSpan = new mapkit.CoordinateSpan(
          currentSpan.latitudeDelta / 4,
          currentSpan.longitudeDelta / 4
        )
        const region = new mapkit.CoordinateRegion(coordinate, newSpan)

        // ズームレベルが0.005以上の場合は拡大表示する
        if (currentSpan.latitudeDelta > 0.005) {
          map.setRegionAnimated(region)
        }

        return
      }

      map.setRegionAnimated(region)

      if (event.annotation?.data) {
        await handleSelect(event.annotation.data)
      }

      annotationRefs.current[event.annotation.data?.id]?.onClick?.()
    })

    // マーカーを選択解除したときの処理
    map.addEventListener("deselect", function (event) {
      handleDeselect()
      setSelectedElement(null)
      const annotationKey = event.annotation?.data.id
      if (annotationKey) {
        annotationRefs.current[annotationKey]?.onDeselect?.()
      }
    })

    // マップの座標が変更されたときの処理
    if (onBoundsChanged) {
      onBoundsChanged(toCompatibleBounds(map.region.toBoundingRegion()))
      map.addEventListener("region-change-end", function (event) {
        onBoundsChanged(toCompatibleBounds(event.target.region.toBoundingRegion()))
      })
    }
  }

  const handleSelect = async (data: MapAnnotationData) => {
    setSelectedAnnotation(data)
    setIsSideFrameOpen(true)
    setTweets(null) // 前回のツイート情報をクリア

    // キャッシュがあれば、それを利用
    if (tweetsCache[data.id]) {
      console.log(`📌 キャッシュからツイートを取得: ${data.id}`)
      setTweets(tweetsCache[data.id])
      return
    }

    try {
      console.log(`🔍 APIからツイートを取得: ${data.id}`)

      // 📌 `formatTweetQueryParams` を使って検索クエリを作成
      const groupsParam = formatTweetQueryParams(data)

      // 📌 APIリクエストを送る
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/twitter/tweets?groups=${encodeURIComponent(groupsParam)}`
      console.log(`🚀 APIリクエスト: ${apiUrl}`)

      const res = await fetchJson<{ data?: TweetData[]; error?: string }>(apiUrl)

      if (res.error) {
        console.error("❌ Twitterデータの取得に失敗:", res.error)
        return
      }

      if (res.data) {
        console.log("✅ 取得したツイート:", res.data)

        // 📌 キャッシュに保存 & ステート更新
        setTweetsCache((prev) => ({ ...prev, [data.id]: res.data ?? [] }))
        setTweets(res.data)
      }
    } catch (error) {
      console.error("❌ API呼び出しエラー:", error instanceof Error ? error.message : error)
    }
  }

  /**
   * マーカーを選択解除したときの処理
   */
  const handleDeselect = () => {
    setSelectedAnnotation(null)
  }

  return (
    <>
      <button
        onClick={toggleDarkMode}
        className="z-10 bg-white rounded-full p-2 absolute top-12 right-3"
      >
        {isDarkMode ? (
          <SunIcon className="fill-orange-400 sm:size-8 size-6" />
        ) : (
          <MoonIcon className="fill-yellow-500 sm:size-8 size-6" />
        )}
      </button>
      <div ref={div} className={className} {...props} />
      <div>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
            {category}
          </label>
        ))}
      </div>
      <div
        className={`fixed text-gray-700 top-0 left-0 h-full bg-white shadow-lg transition-transform ${
          isSideFrameOpen ? "xl:w-5/12 md:w-2/3 w-11/12 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {selectedElement && <div dangerouslySetInnerHTML={{ __html: selectedElement.outerHTML }} />}

        {isSideFrameOpen && (
          <button
            tabIndex={undefined}
            onClick={() => setIsSideFrameOpen(!isSideFrameOpen)}
            className="absolute rounded-lg top-[50dvh] right-4 transform translate-x-full bg-white p-4"
          >
            <ChevronIcon className="fill-gray-700 size-7" />
          </button>
        )}

        {/* ↓↓↓ ココに書く ↓↓↓ */}
        {isSideFrameOpen && selectedAnnotation && (
          <div className="p-6 overflow-y-auto flex flex-col gap-6 h-full scrollbar-hide">
            <section className="text-gray-700 flex flex-col gap-2">
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">📍詳細情報</h2>

              <div className="mb-4">
                <p className="flex text-lg font-bold items-center gap-2 bg-white p-4 border border-gray-300 rounded-lg">
                  <span className="text-2xl mb-1">
                    {categoryStyleMap[selectedAnnotation.category]?.emoji || "❓"}
                  </span>
                  {selectedAnnotation.category}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg leading-loose">エリア情報</h3>
                <p>{selectedAnnotation.data.area}</p>
              </div>

              {selectedAnnotation.title && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg leading-loose">概要</h3>
                  <p>{selectedAnnotation.title}</p>
                </div>
              )}

              {/* {selectedAnnotation.markerImgUrl && (
              <div className="mb-4">
                <h3 className="font-semibold text-lg leading-loose mb-2">画像</h3>
                <img
                  src={selectedAnnotation.markerImgUrl}
                  alt="マーカー画像"
                  className="rounded-md shadow-md w-full max-w-xs"
                />
              </div>
            )} */}

              {selectedAnnotation.data.link && (
                <Link
                  href={selectedAnnotation.data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-blue-500 hover:bg-blue-600 text-[#ffffff] p-4 rounded-md transition"
                >
                  <p className="flex items-center gap-2">
                    <ExternalLinkIcon className="fill-[#ffffff] size-3.5" />
                    <span className="text-lg tracking-wide">詳細ページへ</span>
                  </p>
                  <ChevronIcon className="fill-[#eeeeee] size-3 rotate-180" />
                </Link>
              )}
            </section>

            {/* 🔥 ツイート一覧の表示 */}
            <section className="text-gray-700 mt-6">
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
                📢関連ツイート
              </h2>
              {tweets === null ? (
                <p>データを取得中...</p>
              ) : tweets.length > 0 ? (
                <div className="mt-2 space-y-6">
                  {tweets.map((tweet, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 w-full p-5 rounded-lg bg-white dark:bg-gray-800 shadow-md flex-col flex items-start gap-4"
                    >
                      <div className="flex items-start space-x-4">
                        {/* プロフィール画像 */}
                        <img
                          src={
                            "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png"
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full"
                        />

                        <div className="flex-1 flex flex-col gap-4">
                          {/* ユーザー情報 */}
                          <div className="flex items-start gap-0.5 flex-col text-gray-700 dark:text-gray-400">
                            <span className="font-semibold">{tweet.authorName}</span>
                            <span className="text-sm">@{tweet.authorId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {/* ツイート本文（大きめ＆余白増やす） */}
                        <p className="text-lg text-gray-700 whitespace-pre-line">{tweet.text}</p>

                        {/* メディア（画像をより大きく） */}
                        {tweet.mediaUrl && (
                          <img
                            src={tweet.mediaUrl}
                            alt="Tweet media"
                            className="rounded-lg border w-full object-cover"
                          />
                        )}

                        {/* いいね・リツイート風デザイン（余白大きく） */}
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
                              hour12: true, // 午前/午後を表示
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>関連ツイートはありません。</p>
              )}
            </section>
          </div>
        )}
      </div>
    </>
  )
}
