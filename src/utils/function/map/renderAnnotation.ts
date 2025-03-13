import { GetNewsData, MapInstance, MapkitInstance } from "@/utils/type/api/GetNewsType"
import { RefObject } from "react"
import { categoryStyleMap } from "./categoryStyleMap"

export type MarkerAnnotationData = {
  id: number
  category: string
  location: { lat: number; lng: number }
  area: string
  link: string
  publishedAt: Date
  markerImgUrl: string
}

// マーカーの表示をする関数
export const renderAnnotations = (
  mapRef: RefObject<[MapInstance, MapkitInstance] | null>,
  annotationRefs: RefObject<Record<string, any>>,
  annotationData: GetNewsData[]
) => {
  if (!mapRef.current || !annotationData) {
    return
  }

  const newAnnotations = []
  const [map, mapkit]: [MapInstance, MapkitInstance] = mapRef.current

  for (const annotation of annotationData) {
    console.log(annotation)
    if (!annotation.id) {
      throw new Error("Marker must have a id.")
    }

    if (annotationRefs.current[annotation.id]) {
      continue
    }

    const coord = new mapkit.Coordinate(
      Number(annotation.location.lat),
      Number(annotation.location.lng)
    )

    // ImageAnnotationの場合（未使用）
    // const imageAnnotation = new mapkit[annotation.markerImgUrl ? "ImageAnnotation" : "MarkerAnnotation"](
    //   coord,
    //   {
    //     title: annotation.title,
    //     subtitle: annotation.subtitle,
    //     color: annotation.category === "交通" ? "#3333FF99" : "#ff7777",
    //     url: annotation.markerImgUrl
    //       ? { 1: annotation.markerImgUrl, 2: undefined, 3: undefined }
    //       : undefined,
    //     clusteringIdentifier: annotation.category,
    //     collisionMode: mapkit.Annotation.CollisionMode.Rectangle, // Circleの方が良い？
    //     displayPriority: mapkit.Annotation.DisplayPriority.Low,
    //     size: annotation.markerImgUrl ? { width: 36, height: 52 } : undefined,
    //     glyphText: annotation.category === "交通" ? "🚗" : "🍴",
    //     // glyphImage: { 1: "/images/m3.webp" },
    //     data: { id: annotation.id, area: annotation.data.area, link: annotation.data.link },
    //   }
    // )

    // MarkerAnnotationの場合
    const markerAnnotation: mapkit.MarkerAnnotation = new mapkit["MarkerAnnotation"](coord, {
      title: annotation.title,
      subtitle: annotation.summary,
      color: categoryStyleMap[annotation.category]?.color || "#222222", // デフォルトの色を設定
      clusteringIdentifier: "default",
      collisionMode: mapkit.Annotation.CollisionMode.Rectangle, // Circleの方が良い？
      displayPriority: mapkit.Annotation.DisplayPriority.Low,
      size: annotation.markerImgUrl ? { width: 36, height: 52 } : undefined,
      glyphText: categoryStyleMap[annotation.category]?.emoji || "❓", // デフォルトの絵文字を設定
      data: {
        id: annotation.id,
        category: annotation.category,
        location: annotation.location,
        area: annotation.data.area,
        link: annotation.data.link,
        publishedAt: annotation.publishedAt,
        sourceName: annotation.sourceName,
        markerImgUrl: annotation.markerImgUrl,
      } as MarkerAnnotationData,
    })

    // アノテーションをnewAnnotationsに追加
    newAnnotations.push(markerAnnotation)

    // アノテーションの表示の重複を避ける処理（らしい）。表示済みのアノテーションをRefで管理している。
    annotationRefs.current[annotation.id] = annotation
  }

  // newAnnotationsをmapに表示
  if (newAnnotations.length) {
    map.addAnnotations(newAnnotations)
  }
}
