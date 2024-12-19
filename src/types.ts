import L from "leaflet";

export type SheetType = "text" | "video" | null;
export type Timeout = ReturnType<typeof setTimeout>;

export interface LocationOfInterest {
  latlng: [number, number];
  zoom: number;
  text: string;
  description: string;
  time: string;
  index?: number;
}

export interface InterestingEvent {
  date: Date;
  dateString: string;
  locations: LocationOfInterest[];
  label?: string;
  info?: string;
}

export class LatLng extends L.LatLng {
  constructor(lat: number, lng: number) {
    super(lat, lng);
  }

  toLeaflet(): L.LatLng {
    return this;
  }
  
  toLngLat(): maplibregl.LngLat {
    return new maplibregl.LngLat(this.lng, this.lat);
  }
  
}

export class LatLngBounds extends L.LatLngBounds {
  constructor(public sw: LatLng, public ne: LatLng) {
    super(sw, ne);
  }

  toLeaflet(): L.LatLngBounds {
    return this;
  }
  
  toMaplibreBounds(): maplibregl.LngLatBounds {
    return new maplibregl.LngLatBounds(
      this.sw.toLngLat(),
      this.ne.toLngLat()
    );
  }
}

import maplibregl from 'maplibre-gl';
