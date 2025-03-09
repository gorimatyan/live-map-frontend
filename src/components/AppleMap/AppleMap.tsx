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
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [isSideFrameOpen, setIsSideFrameOpen] = useState<boolean>(false)
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!div.current || mapRef.current) {
      return
    }

    // Mapkit.jsを読み込んだらマップの初期化を実行
    loadMapkitJs().then((mapkit: MapkitInstance) => {
      if (mapRef.current) {
        return
      }

      if (!div.current) {
        return
      }

      _initializeMap(mapkit)
    })
  }, [div])

  useEffect(() => {
    renderAnnotations(mapRef, annotationRefs, mapAnnotationData)
  }, [mapAnnotationData])

  useEffect(() => {
    setIsSideFrameOpen(!!iframeUrl)
  }, [iframeUrl])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const selectedElement = document.getElementsByClassName(".mk-selected")[0]
          console.log(`selectedElement`, selectedElement)
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
    const map = new mapkit.Map(div.current!, mapOptions)
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
      console.log(`clusterAnnotation`, clusterAnnotation.memberAnnotations)

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
      console.log(`annotation.data`, annotation.data)
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
    map.addEventListener("select", function (event) {
      console.log("select", event)

      if (!event.annotation?.coordinate) {
        return
      }

      // クラスターアノテーションのクリック時のみ実行
      if (event.annotation?.memberAnnotations != undefined) {
        // クリックしたクラスターアノテーションの座標にズームする
        const coordinate = event.annotation.coordinate
        const span = new mapkit.CoordinateSpan(0.025, 0.025)
        const region = new mapkit.CoordinateRegion(coordinate, span)
        map.setRegionAnimated(region)
        return
      }

      // 普通のアノテーションのクリック時のみ実行
      if (event.annotation?.memberAnnotations == undefined) {
        // アノテーションを選択状態にする
        handleSelect(event.annotation.data?.link, event.annotation.data?.id)
      }

      annotationRefs.current[event.annotation.data?.id]?.onClick?.()
    })

    // マーカーを選択解除したときの処理
    map.addEventListener("deselect", function (event) {
      console.log("deselect", event)
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
        console.log("Region Change ended", event)
        onBoundsChanged(toCompatibleBounds(event.target.region.toBoundingRegion()))
      })
    }
  }

  /**
   * マーカーをクリックしたときの処理
   * @param url クリックしたマーカーのURL
   * @param id クリックしたマーカーのID
   */
  const handleSelect = (url: string | null, id: number | null) => {
    setIframeUrl(url)
  }

  /**
   * マーカーを選択解除したときの処理
   */
  const handleDeselect = () => {
    setIframeUrl(null)
  }

  return (
    <>
      <div ref={div} className={className} {...props} />
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-transform ${
          isSideFrameOpen ? "w-5/6 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {selectedElement && <div dangerouslySetInnerHTML={{ __html: selectedElement.outerHTML }} />}

        {isSideFrameOpen && (
          <button
            tabIndex={undefined}
            onClick={() => setIsSideFrameOpen(!isSideFrameOpen)}
            className="absolute rounded-full top-[50dvh] right-0 transform translate-x-full bg-white border border-gray-300 p-4 mr-8"
          >
            <ChevronIcon className="fill-gray-500 size-7" />
          </button>
        )}
      </div>
    </>
  )
}
