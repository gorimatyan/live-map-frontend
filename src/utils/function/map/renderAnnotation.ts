import { GetNewsData, MapInstance, MapkitInstance } from "@/utils/type/api/GetNewsType"
import { RefObject } from "react"
import { categoryStyleMap } from "./categoryStyleMap"
import { MarkerAnnotationData } from "@/utils/type/api/common/GetAnnotationsType"

/**
 * マーカー（アノテーション）の表示をする関数
 * @param mapRef マップのRef
 * @param annotationRefs アノテーションのRef
 * @param annotationData アノテーションのデータ
 */
export const renderAnnotations = (
  mapRef: RefObject<[MapInstance, MapkitInstance] | null>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  annotationRefs: RefObject<Record<string, any>>,
  annotationData: GetNewsData[]
) => {
  if (!mapRef.current || !annotationData) {
    return
  }

  console.log("renderAnnotations", annotationData.length)

  const newAnnotations: mapkit.Annotation[] = []
  const [map, mapkit]: [MapInstance, MapkitInstance] = mapRef.current

  annotationData.forEach((annotation) => {
    if (!annotation.id) {
      throw new Error("Marker must have a id.")
    }

    if (annotationRefs.current[annotation.id]) {
      return
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
    //     data: { id: annotation.id, address: annotation.data.address, link: annotation.data.link },
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
        address: annotation.data.address,
        predictedLocation: annotation.data.predictedLocation,
        link: annotation.data.link,
        publishedAt: annotation.publishedAt,
        sourceName: annotation.sourceName,
        markerImgUrl: annotation.markerImgUrl,
      } as MarkerAnnotationData,
    })

    // アノテーションをnewAnnotationsに追加
    newAnnotations.push(markerAnnotation)

    // アノテーションの表示の重複を避ける処理（らしい）。表示済みのアノテーションをRefで管理している。
    // 重複を避けるために、idとtitleの先頭10文字を結合した文字列をキーにして管理している。
    annotationRefs.current[annotation.id + annotation.title.substring(0, 10)] = annotation
  })

  // newAnnotationsをmapに表示
  if (newAnnotations.length) {
    map.addAnnotations(newAnnotations)
  }
}
