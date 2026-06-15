// ============================================================================
//  Stage — bright, inviting daytime park: sky, sun, drifting clouds, a
//  friendly city skyline, rolling hills with trees, and grassy platforms.
// ============================================================================
import { STAGE, GAME } from './config.js';

export class Stage {
  constructor() {
    this.t = 0;

    // drifting clouds (parallax)
    this.clouds = [];
    for (let i = 0; i < 7; i++) {
      this.clouds.push({
        x: Math.random() * GAME.WIDTH,
        y: 40 + Math.random() * 160,
        s: 0.7 + Math.random() * 0.9,   // scale
        spd: 0.12 + Math.random() * 0.22,
      });
    }

    // city skyline (mid-ground), generated once
    this.buildings = [];
    let bx = -20;
    while (bx < GAME.WIDTH + 40) {
      const w = 34 + Math.floor(Math.random() * 40);
      const h = 70 + Math.floor(Math.random() * 130);
      this.buildings.push({ x: bx, w, h, tone: 0.8 + Math.random() * 0.2 });
      bx += w + 6 + Math.floor(Math.random() * 14);
    }

    // background trees on the hills
    this.trees = [];
    for (let i = 0; i < 9; i++) {
      this.trees.push({ x: 40 + i * 105 + Math.random() * 40, s: 0.8 + Math.random() * 0.6 });
    }
  }

  update() { this.t++; }

  drawBg(ctx) {
    // --- sky ---
    const g = ctx.createLinearGradient(0, 0, 0, GAME.HEIGHT);
    g.addColorStop(0, STAGE.bg[0]);
    g.addColorStop(0.55, STAGE.bg[1]);
    g.addColorStop(1, STAGE.bg[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, GAME.WIDTH, GAME.HEIGHT);

    // --- sun with soft glow ---
    const sunX = 120, sunY = 96;
    const halo = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 130);
    halo.addColorStop(0, 'rgba(255,80,50,0.9)');
    halo.addColorStop(1, 'rgba(255,80,50,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 320, 280);
    ctx.fillStyle = '#ff2222';
    ctx.beginPath(); ctx.arc(sunX, sunY, 36, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#aa0000';
    ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, Math.PI * 2); ctx.fill();

    // --- city skyline along the horizon ---
    const horizon = 350;
    for (const b of this.buildings) {
      const top = horizon - b.h;
      // body (dark silhouettes)
      ctx.fillStyle = `rgba(${Math.round(20 * b.tone)},${Math.round(10 * b.tone)},${Math.round(15 * b.tone)},0.95)`;
      ctx.fillRect(b.x, top, b.w, b.h);
      // lighter top edge
      ctx.fillStyle = 'rgba(255,100,100,0.15)';
      ctx.fillRect(b.x, top, b.w, 3);
      // windows
      ctx.fillStyle = 'rgba(255,100,50,0.3)';
      for (let wy = top + 8; wy < horizon - 6; wy += 12) {
        for (let wx = b.x + 5; wx < b.x + b.w - 5; wx += 11) {
          if ((wx + wy + b.x) % 3 !== 0) ctx.fillRect(wx, wy, 5, 6);
        }
      }
    }

    // --- clouds (drift + wrap) ---
    for (const c of this.clouds) {
      c.x += c.spd;
      if (c.x > GAME.WIDTH + 70) c.x = -70;
      this.drawCloud(ctx, c.x, c.y, c.s);
    }

    // --- rolling green hills behind the stage ---
    this.drawHills(ctx, horizon);

    // background trees
    for (const tr of this.trees) {
      this.drawTree(ctx, tr.x, horizon + 6, tr.s);
    }
  }

  drawCloud(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(70,30,40,0.8)';
    const puff = (dx, dy, r) => { ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, Math.PI * 2); ctx.fill(); };
    puff(0, 0, 18); puff(20, 4, 14); puff(-20, 4, 14); puff(8, -10, 13); puff(-10, -8, 12);
    ctx.fillStyle = 'rgba(70,30,40,0.8)';
    ctx.fillRect(x - 26 * s, y + 2 * s, 54 * s, 12 * s);
  }

  drawHills(ctx, horizon) {
    // far hill
    ctx.fillStyle = '#1c0a12';
    ctx.beginPath();
    ctx.moveTo(0, horizon + 20);
    for (let x = 0; x <= GAME.WIDTH; x += 20) {
      ctx.lineTo(x, horizon - 6 + Math.sin(x * 0.012) * 22);
    }
    ctx.lineTo(GAME.WIDTH, GAME.HEIGHT); ctx.lineTo(0, GAME.HEIGHT); ctx.closePath(); ctx.fill();
    // near hill (darker, ground fill)
    ctx.fillStyle = '#0a0306';
    ctx.beginPath();
    ctx.moveTo(0, horizon + 36);
    for (let x = 0; x <= GAME.WIDTH; x += 20) {
      ctx.lineTo(x, horizon + 22 + Math.cos(x * 0.01 + 1) * 18);
    }
    ctx.lineTo(GAME.WIDTH, GAME.HEIGHT); ctx.lineTo(0, GAME.HEIGHT); ctx.closePath(); ctx.fill();
  }

  drawTree(ctx, x, y, s) {
    const w = 10 * s, h = 26 * s;
    // trunk
    ctx.fillStyle = '#0f0508';
    ctx.fillRect(x - w * 0.18, y - h * 0.5, w * 0.36, h * 0.6);
    // canopy (chunky pixel leaves)
    ctx.fillStyle = '#260a14';
    ctx.beginPath(); ctx.arc(x, y - h * 0.7, 16 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x - 12 * s, y - h * 0.55, 11 * s, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 12 * s, y - h * 0.55, 11 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a0f1e';
    ctx.beginPath(); ctx.arc(x - 4 * s, y - h * 0.85, 9 * s, 0, Math.PI * 2); ctx.fill();
  }

  drawPlatforms(ctx) {
    for (let i = 0; i < STAGE.platforms.length; i++) {
      const p = STAGE.platforms[i];
      if (p.passable) {
        // floating grassy ledge on a wooden base
        ctx.fillStyle = '#220810';            // wood
        ctx.fillRect(p.x, p.y + 4, p.w, p.h - 2);
        ctx.fillStyle = '#110206';
        ctx.fillRect(p.x, p.y + p.h, p.w, 4);
        ctx.fillStyle = '#4a1122';            // dark grass
        ctx.fillRect(p.x, p.y, p.w, 6);
        ctx.fillStyle = '#63152c';
        ctx.fillRect(p.x, p.y, p.w, 2);
        this.grassBlades(ctx, p.x, p.y, p.w, '#63152c');
      } else {
        // main ground: dirt body + grassy top
        ctx.fillStyle = '#1f0810';            // dark earth
        ctx.fillRect(p.x, p.y, p.w, p.h);
        // dirt speckles
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        for (let gx = p.x + 10; gx < p.x + p.w; gx += 22) {
          for (let gy = p.y + 22; gy < p.y + p.h; gy += 20) {
            ctx.fillRect(gx + ((gy / 20) % 2) * 8, gy, 4, 4);
          }
        }
        // grass top (two-tone)
        ctx.fillStyle = '#3d0a19';
        ctx.fillRect(p.x, p.y, p.w, 12);
        ctx.fillStyle = '#591024';
        ctx.fillRect(p.x, p.y, p.w, 5);
        this.grassBlades(ctx, p.x, p.y, p.w, '#591024');
        // soft shadow under the lip
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(p.x, p.y + 12, p.w, 3);
      }
    }
  }

  grassBlades(ctx, x, y, w, color = '#7ad96a') {
    ctx.fillStyle = color;
    for (let gx = x + 6; gx < x + w - 4; gx += 14) {
      const sway = Math.sin(this.t * 0.06 + gx * 0.3) > 0 ? 1 : 0;
      ctx.fillRect(gx + sway, y - 3, 2, 3);
      ctx.fillRect(gx + 6 - sway, y - 2, 2, 2);
    }
  }
}
