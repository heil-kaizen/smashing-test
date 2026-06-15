import sharp from "sharp";

async function extractFrames(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const image = sharp(Buffer.from(buffer));
  const metadata = await image.metadata();
  const { width, height } = metadata;

  const raw = await image.raw().toBuffer();
  
  let allFrames = [];
  const ROW_Y = [48, 365, 671, 886, 1156, 1430, 1679, 1897, 2108, 2379];
  
  let row_y = [...ROW_Y];
  for(; row_y.length > 0; ) {
     let y_start = row_y.shift();
     let y_end = height;
     if (row_y.length > 0) y_end = row_y[0] - 10;

     let bg_idx = (y_start * width + (width - 5)) * metadata.channels;
     let bg_r = raw[bg_idx], bg_g = raw[bg_idx+1], bg_b = raw[bg_idx+2];
     
     let getPixelReal = (x, y) => {
         let idx = (y * width + x) * metadata.channels;
         let r = raw[idx], g = raw[idx+1], b = raw[idx+2];
         let a = metadata.channels === 4 ? raw[idx+3] : 255;
         if (a < 100) return false;
         let diff = Math.abs(r - bg_r) + Math.abs(g - bg_g) + Math.abs(b - bg_b);
         return diff > 50; 
     };
     
     let emptyCols = [];
     for(let x = 0; x < width; x++) {
       let has = false;
       for(let y = Math.max(0, y_start - 30); y < y_end; y++) {
         if (getPixelReal(x, y)) { has = true; break; }
       }
       if (!has) emptyCols.push(x);
     }
     
     // Group empty cols into gaps
     let gaps = [];
     if (emptyCols.length > 0) {
       let s = emptyCols[0];
       for(let i=1; i<emptyCols.length; i++) {
         if (emptyCols[i] !== emptyCols[i-1] + 1) {
           gaps.push({s, e: emptyCols[i-1], w: emptyCols[i-1] - s + 1});
           s = emptyCols[i];
         }
       }
       gaps.push({s, e: emptyCols[emptyCols.length-1], w: emptyCols[emptyCols.length-1] - s + 1});
     }
     
     // Frame boundaries are gaps >= 8 pixels wide
     let frameBounds = [];
     let lastEnd = 0;
     for (let g of gaps) {
       if (g.w >= 8 || g.s === 0 || g.e === width - 1) {
         if (g.s > lastEnd) {
           frameBounds.push({ startX: lastEnd, endX: g.s - 1 });
         }
         lastEnd = g.e + 1;
       }
     }
     if (lastEnd < width) {
       frameBounds.push({ startX: lastEnd, endX: width - 1 });
     }
     
     let cellRects = [];
     let row_max_y = -1;
     
     for (let b of frameBounds) {
         let ymin = y_end, ymax = -1, xmin = b.endX, xmax = b.startX;
         let hasPixels = false;
         
         for(let x_scan = b.startX; x_scan <= b.endX; x_scan++) {
            for(let y_scan = Math.max(0, y_start - 30); y_scan < y_end; y_scan++) {
                if (getPixelReal(x_scan, y_scan)) {
                    hasPixels = true;
                    if (y_scan < ymin) ymin = y_scan;
                    if (y_scan > ymax) ymax = y_scan;
                    if (x_scan < xmin) xmin = x_scan;
                    if (x_scan > xmax) xmax = x_scan;
                }
            }
         }
         
         if (hasPixels && xmin <= xmax) {
             let w = xmax - xmin + 1;
             let h = ymax - ymin + 1;
             if (w > 20 && h > 20) {
                 if (ymax > row_max_y) row_max_y = ymax;
                 
                 // Smart anchor: find the center of the bottom-most 20% pixels to anchor feet!
                 let feetY = ymax - Math.max(10, Math.floor(h * 0.2));
                 let fxmin = xmax, fxmax = xmin;
                 for(let x_scan = xmin; x_scan <= xmax; x_scan++) {
                    for(let y_scan = feetY; y_scan <= ymax; y_scan++) {
                        if (getPixelReal(x_scan, y_scan)) {
                            if (x_scan < fxmin) fxmin = x_scan;
                            if (x_scan > fxmax) fxmax = x_scan;
                        }
                    }
                 }
                 let smartOx = Math.floor(w / 2); // fallback
                 if (fxmin <= fxmax) {
                     smartOx = Math.floor((fxmin + fxmax) / 2) - xmin;
                 }
                 
                 cellRects.push({ xmin, ymin, w, h, ox: smartOx });
             }
         }
     }
     
     let cleanRects = [];
     for (let r of cellRects) {
         cleanRects.push({
             x: r.xmin,
             y: r.ymin,
             w: r.w,
             h: r.h,
             ox: r.ox,
             oy: row_max_y - r.ymin
         });
     }
     
     allFrames.push(cleanRects);
  }
  return allFrames;
}

(async () => {
  const chars = [
    {id: 'shiba', url: "https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/assets/chara%20assets%20sprite%20sheets/Shiba-sprite.webp"},
    {id: 'wojak', url: "https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/assets/chara%20assets%20sprite%20sheets/Wojak-sprite.webp"},
    {id: 'whale', url: "https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/assets/chara%20assets%20sprite%20sheets/whitewhale-sprite.webp"},
    {id: 'troll', url: "https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/assets/chara%20assets%20sprite%20sheets/Troll-sprite.webp"},
    {id: 'alon', url: "https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/assets/chara%20assets%20sprite%20sheets/Alon-sprite.webp"},
    {id: 'punch', url: "https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/assets/chara%20assets%20sprite%20sheets/punch-sprite.webp"}
  ];
  
  let result = {};
  for (let c of chars) {
    try {
        result[c.id] = await extractFrames(c.url);
        console.log(`Extracted ${c.id}: ${result[c.id].length} rows`);
    } catch(e) {
        console.log("error", e.message);
    }
  }
  
  import("fs").then(async fs => {
      await fs.promises.writeFile("src/frames.js", `export const SPRITE_FRAMES = ${JSON.stringify(result, null, 2)};`);
      console.log("Wrote src/frames.js");
  });
})();
