/* eslint-disable @typescript-eslint/naming-convention */
import { rectangleToGeometry, pointToGeometry } from './geometry';
import type { RectBounds, PointBounds, EsriGeometryType } from './geometry';
import type { EsriGetSamplesReturn, EsriGetSamplesReturnError, EsriGetSamplesSample, Variables, EsriInterpolationMethod, CEsriTimeseries } from './types';

function safeParseNumber(value: string | null | undefined): number | null {
  if (value === null || value === '' || value === undefined) return null;

  const parsed = parseFloat(value); // parsing only fails if 1st digit is not a number :)
  return isNaN(parsed) ? null : parsed; // Return null if parsing fails
}



export interface EsriGetSamplesParameters {
  geometry: ReturnType<typeof rectangleToGeometry> | ReturnType<typeof pointToGeometry>;
  geometryType: EsriGeometryType;
  sampleDistance?: number;
  sampleCount?: number;
  mosaicRule?: string | Record<string, unknown>;
  pixelSize?: number;
  returnFirstValueOnly?: boolean;
  interpolation: EsriInterpolationMethod;
  outFields?: string | string[];
  sliceID?: string | number;
  time?: string | [number, number] | [Date, Date];
  f: 'pjson'; // Format of the response
}

function stringifyEsriGetSamplesParameters(params: EsriGetSamplesParameters): URLSearchParams {
  const {
    geometry,
    geometryType,
    sampleDistance,
    sampleCount,
    mosaicRule,
    pixelSize,
    returnFirstValueOnly,
    interpolation,
    outFields,
    sliceID,
    time,
  } = params;
  
  

  const options: Record<string, string> = {
    f: 'pjson',
    geometry: JSON.stringify(geometry),
    geometryType: geometryType,
    interpolation: interpolation,
  };

  if (sampleDistance) options.sampleDistance = sampleDistance.toString();
  if (sampleCount) options.sampleCount = sampleCount.toString();
  if (mosaicRule) options.mosaicRule = JSON.stringify(mosaicRule);
  if (pixelSize) options.pixelSize = pixelSize.toString();
  if (returnFirstValueOnly !== undefined) options.returnFirstValueOnly = returnFirstValueOnly.toString();
  if (outFields) options.outFields = Array.isArray(outFields) ? outFields.join(',') : outFields;
  if (sliceID !== undefined) options.sliceID = sliceID.toString();
  if (time) {
    const timeStr = Array.isArray(time)
      ? time.map((t) => (t instanceof Date ? t.getTime() : t)).join(',')
      : time;
    options.time = timeStr;
  }

  return new URLSearchParams(options);
}


const esriGetSamplesRequest = async (url: string, params: EsriGetSamplesParameters): Promise<EsriGetSamplesReturn | EsriGetSamplesReturnError> => {
  const getSamplesUrl = `${url}/getSamples/?`;
  const urlWithParams = getSamplesUrl + stringifyEsriGetSamplesParameters(params).toString();
  
  console.log(urlWithParams.replace('pjson', 'html'));

  try {
    const response = await fetch(urlWithParams);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in esriGetSamplesRequest:', error);
    throw error;
  }
};

export function esriGetSamples(
  url: string,
  variableName: Variables,
  geometry: RectBounds | PointBounds,
  start: number,
  end: number,
  sampleCount: number = 30,
): Promise<CEsriTimeseries[]> {
  // const getSamplesUrl = `${url}/getSamples/?`;

  const esriGeometry =
    Object.keys(geometry).includes('xmin') ?
      rectangleToGeometry(geometry as RectBounds)
      : pointToGeometry(geometry as PointBounds);

  const geometryType: EsriGeometryType =
    Object.keys(geometry).includes('xmin') ?
      'esriGeometryPolygon'
      : 'esriGeometryPoint';

  // https://developers.arcgis.com/rest/services-reference/enterprise/get-samples/
  const options: EsriGetSamplesParameters = {
    f: 'pjson',
    interpolation: 'RSP_NearestNeighbor',
    returnFirstValueOnly: false,
    geometry: esriGeometry,
    geometryType: geometryType,
    time: `${start},${end}`,
    sampleCount: sampleCount,
  };
  

  return esriGetSamplesRequest(url, options)
    .then((data) => {
      if ('error' in data) {
        throw new Error(`Error fetching samples (${data.error.code}): ${data.error.message} ${data.error.details}`);
      }
      // want to get the location x, y, the time, the variableName (NO2_Troposphere)
      return data.samples.map((sample: EsriGetSamplesSample) => {
        return {
          x: sample.location.x,
          y: sample.location.y,
          time: sample.attributes.StdTime,
          date: new Date(sample.attributes.StdTime), // assuming StdTime is in seconds
          variable: safeParseNumber(sample.attributes[variableName] ?? ''), // assuming NO2_Troposphere is the variable we want
          value: safeParseNumber(sample.value),
          locationId: sample.locationId,
        };
      });
    })
    .catch((error) => {
      console.error('Error fetching samples:', error);
      throw error;
    });
}

export function test() {
  console.log('test function called');
  const url =
    'https://gis.earthdata.nasa.gov/image/rest/services/C2930763263-LARC_CLOUD/TEMPO_NO2_L3_V03_HOURLY_TROPOSPHERIC_VERTICAL_COLUMN/ImageServer';
  const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

  const test_geometry = { x: -110, y: 44 };
  // test small rectangle around new york city
  // const test_geometry = {
  //   xmin: -110,
  //   ymin: 40,
  //   xmax: -100,
  //   ymax: 45,
  // } as RectBounds;
  esriGetSamples(
    url,
    'NO2_Troposphere',
    test_geometry,
    Date.now() - 3 * oneDay,
    Date.now() - 2 * oneDay,
    30,
  )
    .then((samples) => {
      const grouped = groupSamplesByTime(samples);
      const aggregated = aggregate(grouped, (samples) =>
        nullMean(samples.map((sample) => sample.value)),
      );
      console.log('Aggregated Samples:', aggregated);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export function groupSamplesByTime(
  samples: CEsriTimeseries[],
): Map<number, CEsriTimeseries[]> {
  const groupd: Map<number, CEsriTimeseries[]> = new Map();

  samples.forEach((sample) => {
    if (!groupd.has(sample.time)) {
      groupd.set(sample.time, []);
    }
    groupd.get(sample.time)?.push(sample);
  });

  return groupd;
}

function nullMean(samples: (number | null)[]): number | null {
  const validSamples = samples.filter((sample) => sample !== null);
  if (validSamples.length === 0) return null;
  const sum = validSamples.reduce((acc, val) => acc + (val ?? 0), 0);
  return sum / validSamples.length;
}

type AggValue = {
  value: number | null;
  date: Date;
};
export function aggregate(
  grouped: Map<number, CEsriTimeseries[]>,
  aggFunction: (samples: CEsriTimeseries[]) => number | null,
) {
  const aggregated: Record<number, AggValue> = {};
  grouped.forEach((samples, time) => {
    aggregated[time] = {value: aggFunction(samples), date: new Date(time)};
  });
  return aggregated;
}


// now write a function that takes a url and returns the aggregated values for a given variable, geometry, start and end time
export async function getAggregatedSamples(
  url: string,
  variableName: Variables,
  geometry: RectBounds | PointBounds,
  start: number,
  end: number,
  sampleCount: number = 30,
): Promise<Record<number, AggValue>> {
  const samples = await esriGetSamples(url, variableName, geometry, start, end, sampleCount);
  const grouped = groupSamplesByTime(samples);
  return aggregate(grouped, (samples) => nullMean(samples.map((sample) => sample.value)));
}