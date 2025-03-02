'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LocationMarker: React.FC = () => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      alert(`緯度: ${lat}, 経度: ${lng}`);

      // POSTリクエストを送信
      fetch('/api/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
  });

  return null;
};

const FukuokaMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    // GeoJSONデータを取得
    const fetchGeoJSON = async () => {
      const response = await fetch('/path/to/fukuoka.geojson');
      const data: FeatureCollection = await response.json();
      drawMap(data);
    };

    const drawMap = (geoData: FeatureCollection) => {
      const width = 800;
      const height = 600;

      const projection = d3.geoMercator()
        .fitSize([width, height], geoData);

      const pathGenerator = d3.geoPath().projection(projection);

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      svg.selectAll('path')
        .data(geoData.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#000');
    };

    fetchGeoJSON();
  }, []);

  return (
    <MapContainer
      center={[33.5902, 130.4017]}
      zoom={16}
      style={{ height: '90dvh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default FukuokaMap; 