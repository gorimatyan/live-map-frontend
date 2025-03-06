"use client"
import { Annotation, CoordinateRegion, Map, Marker } from "mapkit-react"
import { useMemo, useState } from "react"

export const AppleMap = () => {
  const token = process.env.NEXT_PUBLIC_MAPKIT_TOKEN || ""
  const [selected, setSelected] = useState<number | null>(null)
  const clusteringIdentifier = "Fukuoka"

  const initialRegion: CoordinateRegion = useMemo(
    () => ({
      centerLatitude: 46.20738751546706,
      centerLongitude: 6.155891756231,
      latitudeDelta: 0.007,
      longitudeDelta: 0.015,
    }),
    []
  )
  const fukuokaKen = [
    {
      fukuokaShi: [
        {
          latitude: 46.24988751546706,
          longitude: 6.175891756231,
        },
        {
          latitude: 46.25908751546706,
          longitude: 6.185891756231,
        },
        {
          latitude: 46.28908751546706,
          longitude: 6.2091756231,
        },
      ],
    },
  ]
  return (
    <div className="w-full h-full">
      <Map token={token} initialRegion={initialRegion}>
        <Annotation
          latitude={46.20738751546706}
          longitude={6.155891756231}
          title="Jet d’eau"
          subtitle="Iconic landmark of Geneva"
          calloutElement={
            <CustomCalloutElement
              title="Jet d’eau"
              subtitle="Iconic landmark of Geneva"
              url="https://en.wikipedia.org/wiki/Jet_d%27Eau"
            />
          }
          calloutEnabled
          calloutOffsetX={-148}
          calloutOffsetY={-82}
        >
          <Marker latitude={46.20738751546706} longitude={6.155891756231} />
        </Annotation>
        <Annotation
          latitude={46.207}
          longitude={6.1558}
          title="Jet d’eau"
          subtitle="Iconic landmark of Geneva"
          calloutElement={
            <CustomCalloutElement
              title="Jet d’eau"
              subtitle="Iconic landmark of Geneva"
              url="https://en.wikipedia.org/wiki/Jet_d%27Eau"
            />
          }
          calloutEnabled
          calloutOffsetX={-148}
          calloutOffsetY={-82}
        >
          <Marker latitude={46.207} longitude={6.1558} />
        </Annotation>

        {/* {coordinates.map(({ latitude, longitude }, index) => (
          <Marker
            latitude={latitude}
            longitude={longitude}
            title={`Marker #${index + 1}`}
            selected={selected === index + 1}
            onSelect={() => setSelected(index + 1)}
            onDeselect={() => setSelected(null)}
            clusteringIdentifier={clusteringIdentifier}
            collisionMode="Circle"
            displayPriority={750}
          />
        ))} */}
      </Map>
      ;
    </div>
  )
}

const CustomCalloutElement: React.FC<{
  title: string
  subtitle: string
  url: string
}> = ({ title, subtitle, url }) => {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
      }}
    >
      <h3 style={{ margin: "0 0 5px 0" }}>{title}</h3>
      <p style={{ margin: "0 0 5px 0" }}>{subtitle}</p>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#007aff" }}>
        Website
      </a>
    </div>
  )
}
