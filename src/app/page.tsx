"use client";

import { AppleMap } from "@/components/AppleMap/AppleMap";
import { useEffect, useState } from "react";
import { MapAnnotationData } from "@/utils/type/map/MapAnnotationDataType";
import { NewsData } from "@/utils/type/api/NewsType";
import { FireTruckData } from "@/utils/type/api/FireTruckType";
import { fetchJson } from "@/utils/function/fetchUtil";

const FIRE_API_ENDPOINT = "http://localhost:3001/api/fire-trucks/missions";
const NEWS_API_ENDPOINT = "http://localhost:3001/api/news";

const mapFireTruckDataToAnnotationData = (fireTruckData: FireTruckData[]): MapAnnotationData[] => {
  return fireTruckData.map((fireTruck, index) => ({
    id: Date.now() + index, // 一意なIDを生成
    category: fireTruck.disasterType,
    location: { lat: fireTruck.latitude ?? 0, lng: fireTruck.longitude ?? 0 },
    title: fireTruck.subject,
    subtitle: fireTruck.body,
    clusteringIdentifier: fireTruck.disasterType,
    data: {
      area: fireTruck.address,
      link: "",
    },
  }));
};

const mapNewsDataToAnnotationData = (newsData: NewsData[], offset: number): MapAnnotationData[] => {
  return newsData.map((news, index) => ({
    id: Date.now() + offset + index, // 一意なIDを生成
    category: news.category,
    location: {
      lat: news.latitude ? parseFloat(news.latitude) : 0,
      lng: news.longitude ? parseFloat(news.longitude) : 0,
    },
    title: news.title,
    subtitle: news.summary,
    clusteringIdentifier: news.category,
    data: {
      area: news.formattedAddress,
      link: news.url,
    },
  }));
};


export default function Home() {
  const [mapAnnotationData, setMapAnnotationData] = useState<MapAnnotationData[]>([]);

  // データを取得して変換
useEffect(() => {
  const fetchData = async () => {
    try {
      const fireTruckResponse = await fetchJson<{ data: FireTruckData[] }>(FIRE_API_ENDPOINT);
      const newsResponse = await fetchJson<{ data?: NewsData[] }>(NEWS_API_ENDPOINT);

      const fireTruckData = fireTruckResponse.data || [];
      const newsData = newsResponse.data ?? [];

      const fireTruckAnnotationData = mapFireTruckDataToAnnotationData(fireTruckData);
      const newsAnnotationData = mapNewsDataToAnnotationData(newsData, fireTruckAnnotationData.length);

      setMapAnnotationData([...fireTruckAnnotationData, ...newsAnnotationData]);
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
