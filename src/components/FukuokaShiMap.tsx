"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { Topology } from "topojson-specification";
import { fukuokaShiTopoJSON } from "@/topojson/fukuokashi";

const FukuokaShiMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const fetchTopoJSON = async () => {
      // const response = await fetch('https://geoshape.ex.nii.ac.jp/city/topojson/20230101/40/40130A1972.topojson');
      // const topoData: Topology = await response.json();

      const topoData: Topology = fukuokaShiTopoJSON;
      const geoData = feature(topoData, topoData.objects.city);

      drawMap(geoData);
    };

    const drawMap = (geoData: any) => {
      const width = 800;
      const height = 600;

      const projection = d3.geoMercator().fitSize([width, height], geoData);

      const pathGenerator = d3.geoPath().projection(projection);

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      svg
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", pathGenerator as any)
        .attr("fill", "transparent")
        .attr("stroke", "#000");
    };

    fetchTopoJSON();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default FukuokaShiMap;
