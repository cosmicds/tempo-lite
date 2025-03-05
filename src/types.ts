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
    endDate?: Date;
    dateString: string;
    locations: LocationOfInterest[];
    label?: string;
    info?: string;
    highlighted?: boolean;
    hasFeature?: boolean;
  }