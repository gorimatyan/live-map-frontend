"use client"

import { AppleMap } from "@/components/AppleMap/AppleMap"
import { GetNewsData } from "@/utils/type/api/GetNewsType"

type MapContainerProps = {
  mapAnnotationData: GetNewsData[]
}

export const MapContainer = ({ mapAnnotationData }: MapContainerProps) => {
  return (
    <div className="w-full h-[100dvh]">
      <AppleMap
        centerPoint={[33.5902, 130.4017]}
        zoom={10}
        className={"h-full w-full"}
        mapAnnotationData={mapAnnotationData}
      />
    </div>
  )
}
