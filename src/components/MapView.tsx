import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import type { Location, PeriodFilter } from "../types";

// Center of Chinatown (approx. Grant Ave & Clay St)
const CHINATOWN_CENTER: [number, number] = [37.7937, -122.4066];
const INITIAL_ZOOM = 16; // shows all of Chinatown, Bush St to Broadway
const FOCUS_ZOOM = 17; // zoom used when a site is selected

interface MapViewProps {
  locations: Location[];
  period: PeriodFilter;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function makeIcon(label: number, state: "default" | "dimmed" | "selected") {
  const cls = state === "selected" ? "is-selected" : state === "dimmed" ? "is-dimmed" : "";
  return L.divIcon({
    className: `site-marker ${cls}`,
    html: `<span class="pin">${label}</span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    tooltipAnchor: [0, -18],
  });
}

/** Pans the map to the selected location. */
function FlyToSelected({ location }: { location: Location | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (!location) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target: [number, number] = [location.latitude, location.longitude];
    const zoom = Math.max(map.getZoom(), FOCUS_ZOOM);
    if (reduceMotion) map.setView(target, zoom);
    else map.flyTo(target, zoom, { duration: 0.6 });
  }, [location, map]);
  return null;
}

export default function MapView({ locations, period, selectedId, onSelect }: MapViewProps) {
  const selected = useMemo(() => locations.find((l) => l.id === selectedId), [locations, selectedId]);

  return (
    <MapContainer
      center={CHINATOWN_CENTER}
      zoom={INITIAL_ZOOM}
      minZoom={14}
      maxZoom={19}
      scrollWheelZoom
      className="h-full w-full"
      aria-label="Interactive map of San Francisco Chinatown"
    >
      <TileLayer
        className="map-tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {locations.map((loc, i) => {
        const inPeriod = period === "all" || loc.relevantPeriods.includes(period);
        const state = loc.id === selectedId ? "selected" : inPeriod ? "default" : "dimmed";
        return (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            icon={makeIcon(i + 1, state)}
            zIndexOffset={state === "selected" ? 1000 : state === "dimmed" ? -500 : 0}
            title={loc.name}
            alt={loc.name}
            keyboard
            eventHandlers={{ click: () => onSelect(loc.id) }}
          >
            <Tooltip direction="top" opacity={1}>
              <span className="font-medium">{loc.name}</span>
            </Tooltip>
          </Marker>
        );
      })}
      <FlyToSelected location={selected} />
    </MapContainer>
  );
}
