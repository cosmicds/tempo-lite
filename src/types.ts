import L from "leaflet";

export type SheetType = "text" | "video" | null;
export type Timeout = ReturnType<typeof setTimeout>;

export interface LocationOfInterest {
  latlng: L.LatLngExpression;
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
  
}

export class LatLngBounds extends L.LatLngBounds {
  constructor(sw: L.LatLng, ne: L.LatLng) {
    super(sw, ne);
  }

  toLeaflet(): L.LatLngBounds {
    return this;
  }
}