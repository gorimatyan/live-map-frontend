import { MapkitInstance } from "@/utils/type/map/MapAnnotationDataType"

/**
 * Mapkit.jsを読み込む
 * @returns Mapkit.jsのインスタンス
 */
export const loadMapkitJs = (): Promise<MapkitInstance> =>
  new Promise((resolve) => {
    if (typeof window === undefined) {
      return
    }

    if ("mapkit" in window && window.mapkit) {
      resolve(window.mapkit)
      return
    }

    const element = document.createElement("script")
    element.addEventListener("load", async () => {
      if (!("mapkit" in window)) {
        return
      }
      await window.mapkit.init({
        authorizationCallback: async (done) => {
          //   const { data } = await axios.get("/api/frontend/mapkit");
          //   done(data.token);
          done(process.env.NEXT_PUBLIC_MAPKIT_TOKEN || "")
        },
      })
      resolve(window.mapkit)
    })
    element.src = "https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js"
    document.head.appendChild(element)
  })
