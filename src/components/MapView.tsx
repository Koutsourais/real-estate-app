"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type WPItem = {
  id: number;
  slug?: string;
  title?: { rendered?: string };
  acf?: Record<string, any>;
};

type MarkerData = {
  id: number;
  title: string;
  slug: string;
  position: [number, number];
  price?: string;
  imageUrl?: string | null;
  region?: string;
};

// Διορθώνουμε icons Leaflet στο Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component για auto-fit στα bounds
function FitBounds({ markers }: { markers: MarkerData[] }) {
  const map = useMap();
  useEffect(() => {
    if (!markers.length) return;
    const bounds = L.latLngBounds(markers.map((m) => m.position));
    map.fitBounds(bounds, { padding: [32, 32] }); // λίγο padding γύρω
  }, [markers, map]);
  return null;
}

function extractMarkers(items: WPItem[]): MarkerData[] {
  const out: MarkerData[] = [];

  for (const it of items) {
    const coords = it?.acf?.coordinates as string | undefined;
    if (!coords) continue;

    const [latS, lngS] = coords.split(",").map((s: string) => s.trim());
    const lat = Number(latS);
    const lng = Number(lngS);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const price =
      it?.acf?.price !== undefined && it?.acf?.price !== ""
        ? Number(String(it.acf.price).replace(/[^\d.]/g, "")).toLocaleString(
            "el-GR"
          )
        : undefined;

    out.push({
      id: it.id,
      title: it?.title?.rendered || "Χωρίς τίτλο",
      slug: it?.slug || String(it.id),
      position: [lat, lng],
      price,
      imageUrl: it?.acf?.image?.url || null,
      region: it?.acf?.region || "",
    });
  }

  return out;
}

export default function MapView({ items }: { items: WPItem[] }) {
  const markers = useMemo(() => extractMarkers(items || []), [items]);

  // Fallback κέντρο = Αθήνα
  const fallbackCenter: [number, number] = [37.9838, 23.7275];
  const hasAny = markers.length > 0;

  return (
    <div className="ui-card p-0 overflow-hidden">
      <div className="h-80 w-full">
        <MapContainer
          center={hasAny ? markers[0].position : fallbackCenter}
          zoom={hasAny ? 11 : 6}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* εδώ κάνει fit σε ΟΛΑ τα markers */}
          {hasAny && <FitBounds markers={markers} />}

          {markers.map((m) => (
            <Marker key={m.id} position={m.position}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{m.title}</div>
                  {m.region && (
                    <div className="text-xs text-gray-600">📍 {m.region}</div>
                  )}
                  {m.price && (
                    <div className="text-xs text-green-700">{m.price} €</div>
                  )}
                  <a
                    href={`/real-estate/${encodeURIComponent(m.slug)}`}
                    className="inline-block text-xs text-blue-600 underline"
                  >
                    Προβολή →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
