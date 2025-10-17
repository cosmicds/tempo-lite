/** 
 * Utitlity function for downloading canvas content as an image file.
 */
import html2canvas from "html2canvas";

function downloadCanvas(canvas: HTMLCanvasElement | string, filename: string = 'canvas_image.png') {
  // allow eith a canvas or a data URL string
  // following https://gist.github.com/Kaundur/2aca9a9edb003555f44195e826af4084
  const dataUrl = canvas instanceof HTMLCanvasElement ? canvas.toDataURL('image/png') : canvas;

  // Create a temporary link element
  const link = document.createElement('a');
  link.id='canvas-download-link';
  link.href = dataUrl;
  link.download = filename;

  // Append to the document and trigger download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
}

export async function downloadCanvasAsImage2(html: HTMLElement, filename: string = 'canvas_image.png') {

  return html2canvas(html, {useCORS: true, scale: 2})
    .then((canvas) => downloadCanvas(canvas, filename))
    .catch(err =>  {
      console.error('Failed to download canvas as image:', err);
      alert('Failed to download image.');
    });
}


// some convenient helps for leaflet
const displayValues: string[] = [];
export function hideLeafletControls() {
  const lc = document.getElementsByClassName('leaflet-control-container');
  if (lc.length > 0) {
    displayValues.push((lc[0] as HTMLElement).style.display);
    (lc[0] as HTMLElement).style.display = 'none';
  }
}

export function showLeafletControls() {
  const lc = document.getElementsByClassName('leaflet-control-container');
  if (lc.length > 0 && displayValues.length > 0) {
    (lc[0] as HTMLElement).style.display = displayValues.pop() as string;
  }
}