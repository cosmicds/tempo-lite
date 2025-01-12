/* eslint-disable @typescript-eslint/naming-convention */
export interface Manifest {
  early_release: {
    image_directory: string;
    resized_image_directory: string;
    timestamps: number[];
  };
  released: {
    image_directory: string;
    resized_image_directory: string;
    timestamps: number[];
  };
  clouds: {
    image_directory: string;
    resized_image_directory: string;
    timestamps: number[];
  };
}

export async function fetchManifest(): Promise<Manifest> {
  console.log("fetching manifest");
  // const url = "https://raw.githubusercontent.com/johnarban/tempo-data-holdings/main/manifest.json";
  const url = "https://raw.githubusercontent.com/johnarban/wwt_interactives/refs/heads/main/images/tempo-data/manifest.json";
  // try to use cache busting, but if that fails try with plain url
  return fetch(`${url}?version=${Date.now()}}`)
    .then((response) => response.json())
    .catch(() => fetch(url).then((response) => response.json()));
    
}

interface Timestamps {
  early_release: number[];
  released: number[];
  clouds: number[];
}

export  async function getTimestamps(): Promise<Timestamps> {
  const manifest = await fetchManifest();
  const earlyRelease = manifest.early_release;
  const released = manifest.released;
  const clouds = manifest.clouds;
  return { early_release: earlyRelease.timestamps, released: released.timestamps, clouds: clouds.timestamps };
}
