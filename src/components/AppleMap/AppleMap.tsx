"use client"

import React, { useEffect, useRef, useState } from "react"
import { GetNewsData, MapInstance, MapkitInstance } from "@/utils/type/api/GetNewsType"
import { renderAnnotations } from "@/utils/function/map/renderAnnotation"
import { loadMapkitJs } from "@/utils/function/map/loadMapkitJs"
import { toCompatibleBounds } from "@/utils/function/map/toCompatibleBounds"
import { ChevronIcon } from "../Icons/ChevronIcon"
import { fetchJson } from "@/utils/function/fetchUtil"
import { GetTweetData } from "@/utils/type/api/GetTweetType"
import { formatTweetQueryParams } from "@/utils/function/formatTweetQueryParams"
import { TweetList } from "../TweetList/TweetList"
import { DetailSection } from "../DetailSection/DetailSection"
import { DarkModeToggle } from "../DarkModeToggle/DarkModeToggle"
import { RightSideContent } from "../RightSideContent/RightSideContent"
import { convertDateLabelToDate } from "@/utils/function/date/convertDateLabelToDate"
import { HamburgerToggle } from "../HamburgerToggle/HamburgerToggle"
import { categoryStyleMap } from "@/utils/function/map/categoryStyleMap"
import { LocationListItem } from "../LocationListItem/LocationListItem"
import Link from "next/link"

type AppleMapProps = {
  centerPoint: [number, number]
  mapOptions?: mapkit.MapConstructorOptions
  zoom: number
  onBoundsChanged?: (bounds: {
    getSouthWest: () => [number, number]
    getNorthEast: () => [number, number]
  }) => void
  /**
   * APIから取得したニュース・消防データ
   */
  mapAnnotationData: GetNewsData[]
} & React.HTMLAttributes<HTMLDivElement>

const categories = Object.keys(categoryStyleMap)
const dates = ["今日", "今日と昨日", "3日以内", "1週間以内", "1ヶ月以内"]

export const AppleMap = ({
  centerPoint,
  zoom,
  onBoundsChanged,
  className,
  mapAnnotationData = [],
  ...props
}: AppleMapProps) => {
  const div = useRef<HTMLDivElement>(null)
  const mapRef = useRef<[MapInstance, MapkitInstance] | null>(null) // マップの状態管理用のref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotationRefs = useRef<Record<string, any>>({}) // アノテーション（マップにある印）の状態管理用のref
  const [isSideFrameOpen, setIsSideFrameOpen] = useState<boolean>(false)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<mapkit.Annotation | null>(null)
  const [tweetsCache, setTweetsCache] = useState<Record<number, GetTweetData[]>>({})
  const [tweets, setTweets] = useState<GetTweetData[] | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false) // ダークモードの状態を管理
  const [isListOpen, setIsListOpen] = useState(false)
  const [isClusterListOpen, setIsClusterListOpen] = useState(false)
  const [selectedClusterAnnotation, setSelectedClusterAnnotation] = useState<
    mapkit.Annotation[] | null
  >(null)

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
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
   * このuseEffectは絞り込み機能でカテゴリーが変更されたときの処理。
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

    // 選択済みのカテゴリーと日時を除外したアノテーションを取得
    const shouldRemoveAnnotations = newAllAnnotations.filter((annotation) => {
      const annotationDate = new Date(annotation.data.publishedAt || 0)
      const selectedDateObj = convertDateLabelToDate(selectedDate)

      // カテゴリーと日時の条件に合わないアノテーションを除外
      return (
        !selectedCategories.includes(annotation.data.category) ||
        (selectedDate && annotationDate < selectedDateObj)
      )
    })

    // 全てのアノテーションから選択済みのカテゴリーを除外したアノテーションを削除
    map.removeAnnotations(shouldRemoveAnnotations)
  }, [selectedCategories, selectedDate, mapAnnotationData])

  useEffect(() => {
    if (!div.current) {
      return
    }

    // Mapkit.jsを読み込んだらマップの初期化を実行
    loadMapkitJs().then((mapkit: MapkitInstance) => {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
   * マップを指定のアノテーションに移動する関数
   * @param annotation
   * @returns
   */
  const moveMapToAnnotation = (annotation: GetNewsData) => {
    setIsListOpen(false)
    if (!mapRef.current) {
      return
    }

    const [map, mapkit] = mapRef.current

    if (!annotation || !annotation.location) {
      return
    }

    // 📌 指定の座標へマップを移動（スムーズなアニメーション付き）
    const coordinate = new mapkit.Coordinate(
      Number(annotation.location.lat),
      Number(annotation.location.lng)
    )

    const span = new mapkit.CoordinateSpan(0.01, 0.01) // 📌 拡大率を調整
    const region = new mapkit.CoordinateRegion(coordinate, span)

    map.setRegionAnimated(region)
  }

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

    /**
     * アノテーションが画面外に出たときに、画面内にインジケーターを表示する関数
     */
    function styleAnnotations() {
      map.annotations.forEach((annotation) => {
        if (!annotation.element) return
        const element = annotation.element as HTMLElement

        // 基本スタイル
        element.style.position = "absolute"
        element.style.top = "50%"
        element.style.left = "50%"

        // 画面外インジケーターの作成
        const indicator = document.createElement("div")
        indicator.style.cssText = `
          position: fixed;
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: pointer;
          background-color: ${categoryStyleMap[annotation.data.category]?.color || "#222222"};
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        `
        indicator.innerHTML = categoryStyleMap[annotation.data.category]?.emoji || "📍"
        document.body.appendChild(indicator)

        // インジケーターのクリックイベント
        indicator.addEventListener("click", () => {
          const coordinate = annotation.coordinate
          const span = new mapkit.CoordinateSpan(0.01, 0.01)
          const region = new mapkit.CoordinateRegion(coordinate, span)
          map.setRegionAnimated(region)
        })

        // 位置更新の関数
        function updateIndicatorPosition() {
          const rect = annotation.element.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const padding = 0 // 画面端からの距離

          // 画面外かどうかの判定
          const isOffScreen =
            rect.right < 0 || // 完全に左側にはみ出している
            rect.left > viewportWidth || // 完全に右側にはみ出している
            rect.bottom < 0 || // 完全に上側にはみ出している
            rect.top > viewportHeight // 完全に下側にはみ出している

          if (isOffScreen) {
            // マーカーの中心座標
            const markerX = rect.left + rect.width / 2
            const markerY = rect.top + rect.height / 2

            // インジケーターの位置とサイズを設定
            indicator.style.display = "flex"

            if (markerX < 0) {
              // 左端
              indicator.style.left = `${padding}px`
              indicator.style.top = `${Math.max(padding, Math.min(viewportHeight - 60, markerY))}px`
              indicator.style.width = "30px"
              indicator.style.height = "30px"
              indicator.style.borderRadius = "999px"
            } else if (markerX > viewportWidth) {
              // 右端
              indicator.style.right = `${padding}px`
              indicator.style.left = "auto"
              indicator.style.top = `${Math.max(padding, Math.min(viewportHeight - 60, markerY))}px`
              indicator.style.width = "30px"
              indicator.style.height = "30px"
              indicator.style.borderRadius = "999px"
            } else if (markerY < 0) {
              // 上端
              indicator.style.top = `${padding}px`
              indicator.style.left = `${Math.max(padding, Math.min(viewportWidth - 60, markerX))}px`
              indicator.style.width = "30px"
              indicator.style.height = "30px"
              indicator.style.borderRadius = "999px"
            } else if (markerY > viewportHeight) {
              // 下端
              indicator.style.bottom = `${padding}px`
              indicator.style.top = "auto"
              indicator.style.left = `${Math.max(padding, Math.min(viewportWidth - 60, markerX))}px`
              indicator.style.width = "30px"
              indicator.style.height = "30px"
              indicator.style.borderRadius = "999px"
            }
          } else {
            indicator.style.display = "none"
          }
        }

        // スクロールとリサイズ時に位置を更新
        window.addEventListener("scroll", updateIndicatorPosition)
        window.addEventListener("resize", updateIndicatorPosition)

        // マップの移動時に位置を更新
        map.addEventListener("region-change-start", (event) => {
          console.log("🗺️ region-change-start", event)
          updateIndicatorPosition()
        })

        map.addEventListener("region-change-end", (event) => {
          console.log("🗺️ region-change-end", event)
          updateIndicatorPosition()
        })

        // 初期位置の設定
        updateIndicatorPosition()

        // クリーンアップ関数
        return () => {
          window.removeEventListener("scroll", updateIndicatorPosition)
          window.removeEventListener("resize", updateIndicatorPosition)
          map.removeEventListener("region-change-start", () => updateIndicatorPosition())
          map.removeEventListener("region-change-end", () => updateIndicatorPosition())
          indicator.remove()
        }
      })
    }

    styleAnnotations()
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

      // クラスター（複数のピンがまとまった状態）のアノテーションの設定
      const memberAnnotations = clusterAnnotation.memberAnnotations
      const allAnnotationsCount = memberAnnotations.length

      // クリック時に表示される要素の設定
      const calloutDelegate = _createCalloutDelegate(allAnnotationsCount)

      const firstAddress = memberAnnotations[0].data.address
      const firstTitle = memberAnnotations[0].title
      const hasDifferentAddress = memberAnnotations.some(
        (annotation) => annotation.data.address !== firstAddress
      )
      const hasDifferentTitle = memberAnnotations.some(
        (annotation) => annotation.title !== firstTitle
      )

      const includedAddress = hasDifferentAddress ? `${firstAddress} +他` : firstAddress
      const includedTitle = hasDifferentTitle ? `${firstTitle} +他` : firstTitle

      const customAnnotationForCluster = new mapkit.MarkerAnnotation(clusterAnnotation.coordinate, {
        title: includedTitle,
        subtitle: includedAddress || "",
        glyphText: allAnnotationsCount.toString(),
        color: "#e30aFF",
        size: { width: 36, height: 52 },
        collisionMode: mapkit.Annotation.CollisionMode.Rectangle, // Circleの方が良い？
        callout: calloutDelegate,
        data: {
          address: firstAddress,
          link: memberAnnotations[0].data.link,
        },
      })

      return customAnnotationForCluster
    }
  }

  /**
   * クリック時に表示される要素の設定を行う関数
   */
  const _createCalloutDelegate = (allAnnotationsCount: number) => ({
    calloutElementForAnnotation: function (clusterAnnotation: mapkit.Annotation) {
      console.log("🔍 クリック時に表示される要素の設定", clusterAnnotation)

      const element = document.createElement("div")
      element.className = "review-callout text-gray-700 p-4"

      const topText = element.appendChild(document.createElement("p"))
      topText.textContent = `${allAnnotationsCount}件のニュース`

      const bottomText = element.appendChild(document.createElement("p"))
      bottomText.textContent = clusterAnnotation.data.address
      bottomText.className = "text-sm"

      // スタイルを設定
      element.style.width = "250px"
      element.style.position = "relative"
      element.style.backgroundColor = "white"
      element.style.border = "1px solid #ccc"
      element.style.borderRadius = "10px"
      element.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"

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
      const markerAnnotation = event.annotation

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
        } else {
          // 座標が重複した場合はリストを開く
          setIsClusterListOpen(true)
          setSelectedClusterAnnotation(event.annotation.memberAnnotations)
        }

        return
      }

      map.setRegionAnimated(region)

      if (markerAnnotation) {
        await handleSelect(markerAnnotation)
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

  const handleSelect = async (annotation: mapkit.Annotation) => {
    setSelectedAnnotation(annotation)
    setIsSideFrameOpen(true)
    setTweets(null) // 前回のツイート情報をクリア

    // キャッシュがあれば、それを利用
    if (tweetsCache[annotation.data.id]) {
      console.log(`📌 キャッシュからツイートを取得: ${annotation.data.id}`)
      setTweets(tweetsCache[annotation.data.id])
      return
    }

    try {
      // 📌 `formatTweetQueryParams` を使って検索クエリを作成
      const groupsParam = formatTweetQueryParams(annotation.data)
      console.log("🔍 APIからツイートを取得", annotation.data)

      // 📌 APIリクエストを送る
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/twitter/tweets?groups=${encodeURIComponent(groupsParam)}`
      console.log(`🚀 APIリクエスト: ${apiUrl}`)

      const res = await fetchJson<{ data?: GetTweetData[]; error?: string }>(apiUrl)

      if (res.error) {
        console.error("❌ Twitterデータの取得に失敗:", res.error)
        return
      }

      if (res.data) {
        console.log("✅ 取得したツイート:", res.data)

        // 📌 キャッシュに保存 & ステート更新
        setTweetsCache((prev) => ({ ...prev, [annotation.data.id]: res.data ?? [] }))
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
      <div ref={div} className={className} {...props} />

      {/* 📌 右上のダークモードボタン */}
      <div className="fixed top-14 right-3 flex flex-col gap-2">
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        {/* 📌 右上のハンバーガーボタン */}
        <HamburgerToggle toggleHamburger={() => setIsListOpen(!isListOpen)} />
        {/* 📌 右上の使い方ボタン */}
        <Link href="/guide">
          <button
            className="p-1 sm:p-2 rounded-full shadow-lg bg-white dark:bg-[#272935] text-2xl z-10"
            aria-label="使い方ボタン"
          >
            🗺️
          </button>
        </Link>
      </div>

      {/* 📌 右側スライドパネル */}
      <div
        className={`fixed z-20 top-0 right-0 h-full bg-white shadow-lg transition-transform ${
          isListOpen ? "xl:w-5/12 md:w-2/3 w-11/12 translate-x-0" : "w-0 translate-x-full"
        }`}
      >
        {isListOpen && (
          <>
            {/* 📌 閉じるボタン */}
            <button
              className="absolute rounded-full top-[50dvh] right-0 transform -translate-y-1/2 bg-white border border-gray-300 p-3 shadow-lg"
              onClick={() => setIsListOpen(false)}
            >
              <ChevronIcon className="fill-gray-700 size-6 rotate-180" />
            </button>

            {/* 📌 新着情報リスト */}
            <div className="p-6 overflow-y-auto h-full">
              <RightSideContent
                mapAnnotationData={mapAnnotationData.filter((item) =>
                  selectedCategories.includes(item.category)
                )}
                onSelectAnnotation={moveMapToAnnotation}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                categories={categories}
                selectedDate={selectedDate}
                handleDateChange={handleDateChange}
                dates={dates}
              />
            </div>
          </>
        )}
      </div>

      {/* 📌 クラスターリスト */}
      <div
        className={`fixed z-20 top-0 right-0 h-full bg-white shadow-lg transition-transform ${
          isClusterListOpen ? "xl:w-5/12 md:w-2/3 w-11/12 translate-x-0" : "w-0 translate-x-full"
        }`}
      >
        {isClusterListOpen && (
          <>
            {/* 📌 閉じるボタン */}
            <button
              className="absolute rounded-full top-[50dvh] right-0 transform -translate-y-1/2 bg-white border border-gray-300 p-3 shadow-lg"
              onClick={() => setIsClusterListOpen(false)}
            >
              <ChevronIcon className="fill-gray-700 size-6 rotate-180" />
            </button>

            {/* 📌 クラスターアノテーションのリスト */}
            <div className="p-6 overflow-y-auto h-full">
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
                📌 {selectedClusterAnnotation?.[0].data.address}付近
              </h2>
              {selectedClusterAnnotation?.map((annotation, index) => (
                <LocationListItem
                  key={index}
                  category={annotation.data.category}
                  contentBody={annotation.title}
                  publishedAt={annotation.data.publishedAt}
                  address={annotation.data.address}
                  onClick={() => handleSelect(annotation)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 📌 左側スライドパネル */}
      <div
        className={`fixed text-gray-700 top-0 left-0 h-full bg-white shadow-lg transition-transform z-20 ${
          isSideFrameOpen ? "xl:w-5/12 md:w-2/3 w-11/12 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {selectedElement && <div dangerouslySetInnerHTML={{ __html: selectedElement.outerHTML }} />}

        {isSideFrameOpen && (
          <button
            tabIndex={undefined}
            onClick={() => setIsSideFrameOpen(!isSideFrameOpen)}
            className="absolute rounded-full border border-gray-300 top-[50dvh] right-6 transform -translate-y-1/2 translate-x-full bg-white p-3"
          >
            <ChevronIcon className="fill-gray-700 size-6" />
          </button>
        )}

        {isSideFrameOpen && selectedAnnotation && (
          <div className="py-6 pl-6 pr-8 overflow-y-auto flex flex-col gap-6 h-full scrollbar-hide">
            <DetailSection selectedAnnotation={selectedAnnotation} />
            <section className="text-gray-700 mt-6">
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
                📢関連ツイート
              </h2>
              <TweetList tweets={tweets} />
            </section>
          </div>
        )}
      </div>
    </>
  )
}
