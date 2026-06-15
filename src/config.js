// ============================================================================
//  MEME SMASH — global config, constants, character roster, stage data
//  Everything tuning-related lives here. Characters are intentionally
//  data-driven so real meme sprite art can be dropped in later without
//  touching engine code (see `sprite` field + assets/sprites/).
// ============================================================================

export const GAME = {
  WIDTH: 960,
  HEIGHT: 540,
  FPS: 60,
};

// --- Physics (units are pixels / frame at 60fps) -----------------------------
export const PHYS = {
  GRAVITY: 0.62,
  MAX_FALL: 17,
  FAST_FALL_MULT: 1.7,
  GROUND_FRICTION: 0.78,
  AIR_FRICTION: 0.94,
  RUN_ACCEL: 1.1,
  AIR_ACCEL: 0.7,
  MAX_RUN: 5.4,
  MAX_AIR: 5.6,
  JUMP_VELOCITY: -13.2,
  DOUBLE_JUMP_VELOCITY: -12.0,
  MAX_JUMPS: 2,
};

// --- Stocks / KO -------------------------------------------------------------
export const RULES = {
  DEFAULT_STOCKS: 3,
  RESPAWN_INVINCIBILITY: 110, // frames
  RESPAWN_DROP_Y: -40,
};

// Blast zones: a fighter past these (relative to the camera world) is KO'd.
export const BLAST = {
  LEFT: -120,
  RIGHT: GAME.WIDTH + 120,
  TOP: -200,
  BOTTOM: GAME.HEIGHT + 180,
};

// --- The stage ---------------------------------------------------------------
// platforms: {x, y, w, passable}. y is the TOP surface fighters stand on.
export const STAGE = {
  name: 'NIGHTMARE ARENA',
  bg: ['#2e0c18', '#631526', '#a51c30'],
  platforms: [
    { x: 170, y: 410, w: 620, h: 220, passable: false }, // main ground
    { x: 250, y: 300, w: 160, h: 14, passable: true },   // left float
    { x: 550, y: 300, w: 160, h: 14, passable: true },   // right float
    { x: 410, y: 210, w: 140, h: 14, passable: true },   // top float
  ],
  // spawn points (x) on the main platform
  spawns: [
    { x: 320, y: 360 },
    { x: 620, y: 360 },
    { x: 460, y: 360 },
    { x: 480, y: 150 },
  ],
};

// ============================================================================
//  ATTACK DEFINITIONS
//  Timings are in frames. angle is the knockback launch angle in degrees,
//  where 0 = straight right, -90 = straight up. reach = horizontal hitbox
//  offset from the fighter's front edge.
// ============================================================================
export const ATTACKS = {
  jab: {
    name: 'jab', startup: 4, active: 4, recovery: 8,
    damage: 4, baseKB: 3.2, kbScaling: 0.05, angle: -18,
    hbw: 38, hbh: 30, reach: 2, hitlag: 5,
  },
  side: { // forward smash
    name: 'side', startup: 11, active: 5, recovery: 22,
    damage: 13, baseKB: 7.5, kbScaling: 0.11, angle: -28,
    hbw: 56, hbh: 40, reach: 6, hitlag: 9,
  },
  up: { // up smash / launcher
    name: 'up', startup: 9, active: 5, recovery: 20,
    damage: 11, baseKB: 7.0, kbScaling: 0.115, angle: -82,
    hbw: 50, hbh: 56, reach: -8, hitlag: 8,
  },
  down: { // sweep
    name: 'down', startup: 8, active: 6, recovery: 16,
    damage: 8, baseKB: 5.0, kbScaling: 0.07, angle: -10,
    hbw: 60, hbh: 26, reach: 4, hitlag: 7,
  },
  air: { // generic aerial
    name: 'air', startup: 5, active: 6, recovery: 10,
    damage: 7, baseKB: 4.5, kbScaling: 0.075, angle: -40,
    hbw: 48, hbh: 44, reach: 0, hitlag: 6,
  },
};

// ============================================================================
//  CHARACTER ROSTER  (meme-themed placeholders)
//  Visuals are drawn procedurally from `palette` (see fighter.js drawPlaceholder).
//  To use real art later: drop a sprite sheet in assets/sprites/<id>.png and
//  set `sprite: 'assets/sprites/<id>.png'` — the renderer will prefer it.
// ============================================================================
function mk(o) {
  return Object.assign({
    weight: 100,     // higher = takes less knockback, falls a bit harder
    speedMult: 1,    // run/air speed multiplier
    jumpMult: 1,     // jump strength multiplier
    dmgMult: 1,      // damage dealt multiplier
    special: 'projectile', // 'projectile' | 'dash'
    sprite: null,
  }, o);
}

export const TROLL_FRAMES = [
  [ // 0: Idle
    { "x": 260, "y": 48,  "w": 143, "h": 265 },
    { "x": 491, "y": 48,  "w": 145, "h": 266 },
    { "x": 714, "y": 48,  "w": 145, "h": 266 }
  ],
  [ // 1: Walk
    { "x": 265, "y": 365, "w": 165, "h": 235 },
    { "x": 491, "y": 365, "w": 165, "h": 239 },
    { "x": 728, "y": 365, "w": 155, "h": 234 },
    { "x": 949, "y": 365, "w": 163, "h": 234 },
    { "x": 1176,"y": 365, "w": 167, "h": 238 }
  ],
  [ // 2: Run
    { "x": 307, "y": 673, "w": 240, "h": 167 },
    { "x": 582, "y": 678, "w": 248, "h": 161 },
    { "x": 866, "y": 674, "w": 245, "h": 162 },
    { "x": 1152,"y": 671, "w": 240, "h": 168 },
    { "x": 1428,"y": 672, "w": 246, "h": 166 }
  ],
  [ // 3: Punch
    { "x": 265, "y": 893, "w": 202, "h": 213 },
    { "x": 507, "y": 890, "w": 218, "h": 217 },
    { "x": 745, "y": 887, "w": 230, "h": 220 },
    { "x": 988, "y": 886, "w": 235, "h": 220 }
  ],
  [ // 4: Kick
    { "x": 505, "y": 1156,"w": 207, "h": 264 },
    { "x": 747, "y": 1156,"w": 226, "h": 264 },
    { "x": 1002,"y": 1156,"w": 222, "h": 225 }
  ],
  [ // 5: Special
    { "x": 470, "y": 1400,"w": 516, "h": 233 },
    { "x": 1000,"y": 1421,"w": 222, "h": 209 },
    { "x": 1270,"y": 1438,"w": 149, "h": 190 },
    { "x": 1503,"y": 1438,"w": 148, "h": 190 }
  ],
  [ // 6: Block
    { "x": 300, "y": 1679,"w": 138, "h": 173 },
    { "x": 533, "y": 1679,"w": 147, "h": 208 }
  ],
  [ // 7: Hit
    { "x": 311, "y": 1892,"w": 161, "h": 171 },
    { "x": 540, "y": 1881,"w": 197, "h": 183 },
    { "x": 819, "y": 1879,"w": 195, "h": 185 }
  ],
  [ // 8: Win
    { "x": 525, "y": 2105,"w": 156, "h": 210 },
    { "x": 742, "y": 2104,"w": 162, "h": 210 },
    { "x": 974, "y": 2102,"w": 145, "h": 212 }
  ],
  [ // 9: Loss
    { "x": 333, "y": 2381,"w": 223, "h": 143 },
    { "x": 616, "y": 2386,"w": 225, "h": 135 },
    { "x": 875, "y": 2414,"w": 238, "h": 106 }
  ]
];

export const CHARACTERS = [
  mk({
    id: 'doge', name: 'DOGE',
    palette: { body: '#e8b558', accent: '#c9933b', eye: '#2b2b2b', trim: '#fff3d6' },
    weight: 105, speedMult: 1.0, jumpMult: 1.0, dmgMult: 1.0, special: 'dash',
    blurb: 'Such balance. Very fighter.',
  }),
  mk({
    id: 'pepe', name: 'PEPE',
    palette: { body: '#5bbf52', accent: '#3d8a37', eye: '#ffffff', trim: '#b33a3a' },
    weight: 86, speedMult: 1.22, jumpMult: 1.12, dmgMult: 0.9, special: 'projectile',
    blurb: 'Feels fast man.',
  }),
  mk({
    id: 'chad', name: 'CHAD',
    palette: { body: '#e9c39b', accent: '#caa178', eye: '#3a6ea5', trim: '#f4d9b8' },
    weight: 128, speedMult: 0.86, jumpMult: 0.92, dmgMult: 1.28, special: 'dash',
    blurb: 'Yes.',
  }),
  mk({
    id: 'wojak', name: 'WOJAK',
    palette: { body: '#dfe6ec', accent: '#b8c2cc', eye: '#2b2b2b', trim: '#9aa7b3' },
    weight: 100, speedMult: 1.0, jumpMult: 1.04, dmgMult: 1.0, special: 'projectile',
    blurb: 'Just wants to fight.',
  }),
  mk({
    id: 'shiba', name: 'SHIBA',
    palette: { body: '#f0913a', accent: '#cf7322', eye: '#2b2b2b', trim: '#ffe0b8' },
    weight: 90, speedMult: 1.18, jumpMult: 1.1, dmgMult: 0.94, special: 'dash',
    blurb: 'Quick lil floof.',
  }),
  mk({
    id: 'troll', name: 'TROLL',
    palette: { body: '#f2f2f2', accent: '#cfcfcf', eye: '#1a1a1a', trim: '#1a1a1a' },
    weight: 96, speedMult: 1.05, jumpMult: 1.0, dmgMult: 0.96, special: 'projectile',
    sprite: 'https://raw.githubusercontent.com/heil-kaizen/assets-for-smashfun/main/Troll-sprite.webp',
    blurb: 'Problem?',
  }),
  mk({
    id: 'pump', name: 'PUMP',
    palette: { body: '#3ad17a', accent: '#23a85c', eye: '#ffffff', trim: '#0e6b39' },
    weight: 112, speedMult: 0.95, jumpMult: 1.0, dmgMult: 1.18, special: 'projectile',
    blurb: 'Number go up.',
  }),
  mk({
    id: 'nyan', name: 'NYAN',
    palette: { body: '#9aa0b5', accent: '#7a7fa0', eye: '#ff5da2', trim: '#ff5da2' },
    weight: 84, speedMult: 1.08, jumpMult: 1.2, dmgMult: 0.9, special: 'projectile',
    blurb: 'Floaty rainbow chaos.',
  }),
];

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}

// --- Control schemes ---------------------------------------------------------
// Codes use KeyboardEvent.code so layout is consistent.
export const CONTROLS = {
  p1: {
    left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
    light: 'KeyX', heavy: 'KeyC', special: 'KeyZ', shield: 'KeyV',
  },
  p2: {
    left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS',
    light: 'KeyJ', heavy: 'KeyK', special: 'KeyL', shield: 'KeyI',
  },
};
