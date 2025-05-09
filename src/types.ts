
// Types



// eslint-disable-next-line @typescript-eslint/naming-convention
type LocationOrderedPair<T extends string> = [number, number] & {_order: T};

export type LatLngPair = LocationOrderedPair<'(Lat,Lng)'>;
// eslint-disable-next-line @typescript-eslint/naming-convention
export type LngLatPair = LocationOrderedPair<'(Lng,Lat)'>;

export type MappingBackends = 'leaflet' | 'maplibre';

export interface InitMapOptions {
  loc: LatLngPair,
  zoom: number,
  t?: number | null,
}
export interface LocationOfInterest {
    latlng: LatLngPair;
    zoom: number;
    text: string;
    description: string;
    time: string;
    index?: number;
  }
export interface InterestingEvent {
    date: Date;
    endDate?: Date;
    dateString: string;
    locations: LocationOfInterest[];
    label?: string;
    info?: string;
    highlighted?: boolean;
    hasFeature?: boolean;
  }
  
import L from 'leaflet';
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


// Library-agnostic bounds representation
export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export type BoundsSelector = (date: Date) => BoundingBox;
