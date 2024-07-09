type Pixel = [number, number, number, number]; // RGBA

function getNeighborhood(data: Uint8ClampedArray, width: number, height: number, x: number, y: number, kernelSize: number): Pixel[] {
  const radius = Math.floor(kernelSize / 2);
  const neighborhood: Pixel[] = [];

  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      const nx = x + i;
      const ny = y + j;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const index = (ny * width + nx) * 4;
        neighborhood.push([
          data[index],   // R
          data[index + 1], // G
          data[index + 2], // B
          data[index + 3]  // A
        ]);
      }
    }
  }

  return neighborhood;
}

function medianFilter(data: Uint8ClampedArray, width: number, height: number, kernelSize: number): Uint8ClampedArray {
  if (kernelSize % 2 === 0) {
    throw new Error('内核大小必须是奇数');
  }

  const result = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighborhood = getNeighborhood(data, width, height, x, y, kernelSize);
      const sortedNeighborhood = neighborhood.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
      const medianIndex = Math.floor(sortedNeighborhood.length / 2);
      const medianPixel = sortedNeighborhood[medianIndex];
      const index = (y * width + x) * 4;
      result[index] = medianPixel[0];     // R
      result[index + 1] = medianPixel[1]; // G
      result[index + 2] = medianPixel[2]; // B
      result[index + 3] = medianPixel[3]; // A
    }
  }

  return result;
}

// 将Base64字符串解码为Blob对象
function base64ToBlob(base64: string, mimeType: string): Blob {
    const bytes = atob(base64);
    const arrayBuffer = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      arrayBuffer[i] = bytes.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeType });
  }
  
  // 将Blob对象转换为Image对象
  async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        resolve(img);
        URL.revokeObjectURL(url);
      };
      img.onerror = reject;
      img.src = url;
    });
  }
  
  // 将Image对象转换为Canvas，然后获取图像数据
  function imageToCanvas(image: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    return canvas;
  }
  
// 应用中值滤波（这里需要你之前的中值滤波函数）
async function applyMedianFilter(base64: string): Promise<string> {
    // 将Base64转换为Blob
    const blob = base64ToBlob(base64, 'image/png');
    
  
    // 将Blob转换为Image
    const image = await blobToImage(blob);
  
    // 将Image转换为Canvas
    const canvas = imageToCanvas(image);
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
    // 应用中值滤波（这里需要你之前的中值滤波函数）
    const filteredData = medianFilter(imageData.data, canvas.width, canvas.height, 3);
  
    // 创建一个新的ImageData对象来存放过滤后的数据
    const filteredImageData = new ImageData(filteredData, canvas.width, canvas.height);
  
    // 将过滤后的图像数据放回Canvas
    ctx.putImageData(filteredImageData, 0, 0);
  
    // 将Canvas转换为Base64
    return canvas.toDataURL('image/png');
  }

export async function prepare_manual(img:HTMLImageElement):Promise<void> {
    
    img.src=await applyMedianFilter(img.src);
}
  