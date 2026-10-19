function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function save(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

//this turns the certificate on screen into a PNG and If a browser refuses to draw the SVG it gets the SVG itself
export async function downloadCertificate(svg, fileName) {
  const markup = new XMLSerializer().serializeToString(svg);
  const vector = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(vector);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = 2400;
    canvas.height = 1696;
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

    if (!png){
      throw new Error('No image');
    }
    save(png, `${fileName}.png`);
    } 
    catch {
      save(vector, `${fileName}.svg`);
    } 
    finally {
      URL.revokeObjectURL(url);
    }
}