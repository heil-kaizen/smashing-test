import sharp from "sharp";
(async () => {
  const response = await fetch("https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/Troll-sprite.webp");
  const buffer = await response.arrayBuffer();
  const image = sharp(Buffer.from(buffer));
  const metadata = await image.metadata();
  const { width, height } = metadata;

  const raw = await image.raw().toBuffer();
  
  const getPixel = (x, y) => {
    const idx = (y * width + x) * metadata.channels;
    const r = raw[idx];
    const g = raw[idx+1];
    const h = raw[idx+2];
    const a = metadata.channels === 4 ? raw[idx+3] : 255;
    return a > 10 && (r < 250 || g < 250 || h < 250);
  };

  let fw = width / 6;
  console.log(`Cell width: ${fw}`);
  
  let allFrames = [];
  for(let row_y = [48, 365, 671, 886, 1156, 1430, 1679, 1897, 2108, 2379]; row_y.length > 0; ) {
     let y_start = row_y.shift();
     // Find the max y for this row
     let y_end = height;
     if (row_y.length > 0) {
         y_end = row_y[0] - 10;
     }
     
     let rects = [];
     for(let x_scan = 0; x_scan < width; x_scan++) {
        let isHit = false;
        let ymin = height, ymax = -1;
        
        for(let y_scan = y_start - 30; y_scan < y_end; y_scan++) {
            if (y_scan < 0) continue;
            if (getPixel(x_scan, y_scan)) { 
                isHit = true; 
                if (y_scan < ymin) ymin = y_scan;
                if (y_scan > ymax) ymax = y_scan;
            }
        }
        if (isHit) {
            if (rects.length === 0 || x_scan - rects[rects.length-1].lastX > 10) {
                rects.push({firstX: x_scan, lastX: x_scan, firstY: ymin, lastY: ymax});
            } else {
                rects[rects.length-1].lastX = x_scan;
                if (ymin < rects[rects.length-1].firstY) rects[rects.length-1].firstY = ymin;
                if (ymax > rects[rects.length-1].lastY) rects[rects.length-1].lastY = ymax;
            }
        }
     }
     allFrames.push(rects.map(r => ({
         x: r.firstX, 
         y: r.firstY, 
         w: r.lastX - r.firstX + 1, 
         h: r.lastY - r.firstY + 1
     })));
  }
  let cleanFrames = [];
  for(let row of allFrames) {
      // The first rect is the text on the left, let's just shift it.
      if (row.length > 0 && row[0].x < 100) {
          row.shift();
      }
      
      // Sometimes there's a tiny garbage rect, filter them out
      row = row.filter(r => r.w > 50 && r.h > 50);
      cleanFrames.push(row);
  }
  
  console.log("export const TROLL_FRAMES = " + JSON.stringify(cleanFrames, null, 2) + ";");
})();
