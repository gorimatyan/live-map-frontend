"use client";

import { AppleMap } from "@/components/AppleMap/AppleMap";
import { useEffect, useState } from "react";
import { MapAnnotationData } from "@/utils/type/map/MapAnnotationDataType";
import { fetchJson } from "@/utils/function/fetchUtil";

const FIRE_API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/fire-trucks/missions`;
const NEWS_API_ENDPOINT = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news`;


export default function Home() {
  const [mapAnnotationData, setMapAnnotationData] = useState<MapAnnotationData[]>([]);

  // データを取得して変換
useEffect(() => {
  const fetchData = async () => {
    try {
      const fireTruckResponse = await fetchJson<MapAnnotationData[]>(FIRE_API_ENDPOINT);
      const newsResponse = await fetchJson< MapAnnotationData[] >(NEWS_API_ENDPOINT);
      console.log(fireTruckResponse);
      console.log(newsResponse);
      setMapAnnotationData([...fireTruckResponse, ...newsResponse]);
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[100dvh]">
      <AppleMap
        centerPoint={[33.5902, 130.4017]}
        zoom={12}
        className={"h-full w-full"}
        mapAnnotationData={mapAnnotationData}
      />
    </div>
  );
}
