const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const sourceJpegPath = 'C:\\Users\\kunal\\.gemini\\antigravity\\brain\\c4fee4d0-d9d5-4645-8349-78ec6eb32d1f\\.user_uploaded\\media_1786780257473.jpg';
const outputPngPath = path.resolve(__dirname, '../assets/logo.png');

console.log('🖼️ Decoding source image from:', sourceJpegPath);

const jpegBuffer = fs.readFileSync(sourceJpegPath);
const rawData = jpeg.decode(jpegBuffer, { useTArray: true });

const width = rawData.width;
const height = rawData.height;
const data = rawData.data; // RGBA Uint8Array

console.log(`Image decoded successfully: ${width}x${height} pixels`);

// Helper to check if pixel is near-white background
function isNearWhite(idx) {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  // Near-white outer background
  return r > 220 && g > 220 && b > 220;
}

const visited = new Uint8Array(width * height);
const queue = [];

// Seed the BFS with all outer border pixels that are near-white
for (let x = 0; x < width; x++) {
  // Top border
  const tIdx = (0 * width + x) * 4;
  if (isNearWhite(tIdx)) {
    queue.push(x, 0);
    visited[0 * width + x] = 1;
  }
  // Bottom border
  const bIdx = ((height - 1) * width + x) * 4;
  if (isNearWhite(bIdx)) {
    queue.push(x, height - 1);
    visited[(height - 1) * width + x] = 1;
  }
}

for (let y = 0; y < height; y++) {
  // Left border
  const lIdx = (y * width + 0) * 4;
  if (isNearWhite(lIdx) && !visited[y * width + 0]) {
    queue.push(0, y);
    visited[y * width + 0] = 1;
  }
  // Right border
  const rIdx = (y * width + (width - 1)) * 4;
  if (isNearWhite(rIdx) && !visited[y * width + (width - 1)]) {
    queue.push(width - 1, y);
    visited[y * width + (width - 1)] = 1;
  }
}

// 8-direction BFS Flood Fill from all outer boundaries
let head = 0;
const dx = [1, -1, 0, 0, 1, -1, 1, -1];
const dy = [0, 0, 1, -1, 1, 1, -1, -1];

while (head < queue.length) {
  const cx = queue[head++];
  const cy = queue[head++];
  const cIdx = (cy * width + cx) * 4;

  // Make pixel 100% transparent
  data[cIdx + 3] = 0;

  for (let i = 0; i < 8; i++) {
    const nx = cx + dx[i];
    const ny = cy + dy[i];

    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
      const nPixel = ny * width + nx;
      if (!visited[nPixel]) {
        const nIdx = nPixel * 4;
        if (isNearWhite(nIdx)) {
          visited[nPixel] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }
}

// Feather / anti-alias border transition
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const p = y * width + x;
    const idx = p * 4;
    if (data[idx + 3] > 0) {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      if (r > 195 && g > 195 && b > 195) {
        let hasTransparentNeighbor = false;
        for (let i = 0; i < 4; i++) {
          const nx = x + dx[i];
          const ny = y + dy[i];
          const nIdx = (ny * width + nx) * 4;
          if (data[nIdx + 3] === 0) {
            hasTransparentNeighbor = true;
            break;
          }
        }
        if (hasTransparentNeighbor) {
          const lum = (r + g + b) / 3;
          const factor = Math.max(0, Math.min(1, (255 - lum) / 60));
          data[idx + 3] = Math.round(data[idx + 3] * factor);
        }
      }
    }
  }
}

// Create PNG from processed buffer
const png = new PNG({ width, height });
png.data = Buffer.from(data.buffer);

const pngBuffer = PNG.sync.write(png);

fs.writeFileSync(outputPngPath, pngBuffer);
console.log('✅ Transparent logo written to:', outputPngPath);

fs.writeFileSync(path.resolve(__dirname, '../assets/icon.png'), pngBuffer);
fs.writeFileSync(path.resolve(__dirname, '../assets/adaptive-icon.png'), pngBuffer);
fs.writeFileSync(path.resolve(__dirname, '../assets/splash.png'), pngBuffer);
console.log('✅ Updated all asset files with transparent background');
