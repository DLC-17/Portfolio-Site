import { TargetShape } from "./types";

/**
 * Generates the base spherical particle distribution (shown at top of page / scroll = 0).
 */
export function generateSphere(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 5 + Math.random() * 2;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
}

/**
 * Generates the default cube geometry.
 */
export function generateCube(count: number, size = 6): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * size;
    pos[i * 3 + 1] = (Math.random() - 0.5) * size;
    pos[i * 3 + 2] = (Math.random() - 0.5) * size;
  }
  return pos;
}

/**
 * Generates a 3D ribbed pumpkin with stem for Halloween.
 */
export function generatePumpkin(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const bodyCount = Math.floor(count * 0.9);

  for (let i = 0; i < bodyCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    // 8 distinct longitudinal ribs
    const rib = 1.0 + 0.16 * Math.cos(8 * theta);
    // Dimple at top and bottom poles
    const dimple = 0.85 + 0.15 * Math.sin(phi);
    const r = (3.2 + Math.random() * 0.6) * rib * dimple;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi) * 0.72 - 0.3; // slightly squashed y
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  // Stem on top
  for (let i = bodyCount; i < count; i++) {
    const t = Math.random();
    const stemHeight = 1.8 + t * 1.5;
    const stemR = (0.28 - t * 0.14) * Math.random();
    const stemAngle = Math.random() * Math.PI * 2;
    const curve = Math.pow(t, 2) * 0.6;
    pos[i * 3] = stemR * Math.cos(stemAngle) + curve;
    pos[i * 3 + 1] = stemHeight;
    pos[i * 3 + 2] = stemR * Math.sin(stemAngle);
  }

  return pos;
}

/**
 * Generates a 3D tiered evergreen pine tree with star tip for Christmas / Winter Holidays.
 * Perfectly oriented right-side up with bottom trunk, tiered boughs, and glowing star at peak.
 */
export function generateTree(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const trunkCount = Math.floor(count * 0.08);
  const starCount = Math.floor(count * 0.06);
  const foliageCount = count - trunkCount - starCount;

  // 1. Trunk at bottom (y: -4.2 to -2.8)
  for (let i = 0; i < trunkCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.55;
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = -4.2 + Math.random() * 1.4;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }

  // 2. 4 Foliage tiers cascading from wide bottom to narrow peak
  const tierConfigs = [
    { yBottom: -2.8, yTop: -1.3, rBottom: 3.6, rTop: 2.2 },
    { yBottom: -1.4, yTop: 0.2, rBottom: 2.9, rTop: 1.6 },
    { yBottom: 0.1, yTop: 1.7, rBottom: 2.1, rTop: 1.0 },
    { yBottom: 1.6, yTop: 3.3, rBottom: 1.4, rTop: 0.1 },
  ];

  const particlesPerTier = Math.floor(foliageCount / 4);
  let currentIdx = trunkCount;

  for (let t = 0; t < 4; t++) {
    const tier = tierConfigs[t];
    const isLastTier = t === 3;
    const tierParticles = isLastTier ? foliageCount - particlesPerTier * 3 : particlesPerTier;

    for (let p = 0; p < tierParticles; p++) {
      const idx = currentIdx + p;
      const progress = Math.random(); // 0 at bottom of tier, 1 at top of tier
      const y = tier.yBottom + progress * (tier.yTop - tier.yBottom);
      // Radius narrows as you go up the tier
      const maxR = tier.rBottom * (1 - progress) + tier.rTop * progress;
      const r = Math.sqrt(Math.random()) * maxR;
      const theta = Math.random() * Math.PI * 2;

      pos[idx * 3] = r * Math.cos(theta);
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = r * Math.sin(theta);
    }
    currentIdx += tierParticles;
  }

  // 3. 5-pointed star at peak (y: 3.4 to 4.3)
  for (let i = 0; i < starCount; i++) {
    const idx = trunkCount + foliageCount + i;
    const ray = Math.floor(Math.random() * 5);
    const starAngle = (ray * Math.PI * 2) / 5 + Math.PI / 2; // point pointing straight up
    const dist = Math.random() * 0.75;
    const spread = (Math.random() - 0.5) * 0.2;

    pos[idx * 3] = dist * Math.cos(starAngle + spread);
    pos[idx * 3 + 1] = 3.6 + dist * Math.sin(starAngle + spread);
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.25;
  }

  return pos;
}

/**
 * Generates a 3D hexagonal crystalline snowflake for Winter.
 */
export function generateSnowflake(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const arm = Math.floor(Math.random() * 6);
    const baseAngle = (arm * Math.PI) / 3;
    const isBranch = Math.random() > 0.4;
    const armDist = Math.random() * 4.2;

    let x = 0;
    let y = 0;
    const z = (Math.random() - 0.5) * 1.0;

    if (!isBranch || armDist < 1.2) {
      x = armDist * Math.cos(baseAngle);
      y = armDist * Math.sin(baseAngle);
    } else {
      const branchSide = Math.random() > 0.5 ? 1 : -1;
      const branchAngle = baseAngle + branchSide * (Math.PI / 4);
      const branchLength = (1 - armDist / 4.5) * 1.2 * Math.random();
      const px = armDist * Math.cos(baseAngle);
      const py = armDist * Math.sin(baseAngle);
      x = px + branchLength * Math.cos(branchAngle);
      y = py + branchLength * Math.sin(branchAngle);
    }

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/**
 * Generates an Autumn maple leaf silhouette with gentle 3D curvature.
 */
export function generateLeaf(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = (1.8 + 1.6 * Math.abs(Math.sin(2.5 * t)) + 0.6 * Math.sin(t)) * (0.35 + 0.65 * Math.sqrt(Math.random()));
    const x = r * Math.sin(t) * 1.3;
    const y = r * Math.cos(t) * 1.2 - 0.5;
    const z = Math.sin(r * 1.2) * 0.7 + (Math.random() - 0.5) * 0.4;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/**
 * Generates a 5-petal blooming blossom rosette for Spring.
 */
export function generateFlower(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const petalR = (2.2 + 1.8 * Math.cos(5 * t)) * (0.3 + 0.7 * Math.sqrt(Math.random()));
    const x = petalR * Math.cos(t);
    const y = petalR * Math.sin(t);
    const z = Math.sin(petalR * 0.7) * 0.8 + (Math.random() - 0.5) * 0.5;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/**
 * Generates a radiant sun with central solar core and flares for Summer.
 */
export function generateSun(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const coreCount = Math.floor(count * 0.6);

  // Core
  for (let i = 0; i < coreCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 2.2 * Math.cbrt(Math.random());
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }

  // Flares
  for (let i = coreCount; i < count; i++) {
    const rayIndex = Math.floor(Math.random() * 12);
    const rayAngle = (rayIndex * Math.PI * 2) / 12;
    const dist = 2.0 + Math.random() * 3.2;
    const spread = (Math.random() - 0.5) * 0.4;
    pos[i * 3] = dist * Math.cos(rayAngle + spread);
    pos[i * 3 + 1] = dist * Math.sin(rayAngle + spread);
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
  }

  return pos;
}

/**
 * Generates an 8-pointed celebratory starburst for New Year's.
 */
export function generateStar(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = (1.5 + 2.8 * Math.pow(Math.abs(Math.cos(4 * theta)), 3)) * (0.3 + 0.7 * Math.sqrt(Math.random()));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = Math.pow(1 - Math.min(r / 4.3, 1), 2) * 1.5 * (Math.random() > 0.5 ? 1 : -1);
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/**
 * Generates a 3D Earth Globe with equatorial and latitude/longitude rings for Earth Day.
 */
export function generateGlobe(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const R = 3.6;
  for (let i = 0; i < count; i++) {
    if (i % 3 === 0) {
      // Surface sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = R * Math.cos(phi);
      pos[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);
    } else if (i % 3 === 1) {
      // Latitude parallels
      const ringLat = [-0.9, -0.4, 0, 0.4, 0.9][Math.floor(Math.random() * 5)];
      const ringR = Math.sqrt(Math.max(0, 1 - ringLat * ringLat)) * R;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = ringR * Math.cos(theta);
      pos[i * 3 + 1] = ringLat * R;
      pos[i * 3 + 2] = ringR * Math.sin(theta);
    } else {
      // Longitude meridians
      const meridianAngle = (Math.floor(Math.random() * 4) * Math.PI) / 4;
      const phi = Math.random() * Math.PI * 2;
      const x = R * Math.sin(phi);
      const y = R * Math.cos(phi);
      pos[i * 3] = x * Math.cos(meridianAngle);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = x * Math.sin(meridianAngle);
    }
  }
  return pos;
}

/**
 * Generates a 3D 4-leaf shamrock with stem for St. Patrick's Day.
 */
export function generateClover(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const stemCount = Math.floor(count * 0.12);
  const leafCount = count - stemCount;

  for (let i = 0; i < leafCount; i++) {
    const lobe = Math.floor(Math.random() * 4);
    const lobeAngle = (lobe * Math.PI) / 2;
    const t = Math.random() * Math.PI * 2;
    const hx = (1.3 * (16 * Math.pow(Math.sin(t), 3))) / 16;
    const hy =
      (1.3 *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t))) /
        16 +
      1.2;
    const r = Math.sqrt(hx * hx + hy * hy);
    const angle = Math.atan2(hy, hx) + lobeAngle;
    const dist = r * (0.4 + 0.6 * Math.sqrt(Math.random()));

    pos[i * 3] = dist * Math.cos(angle);
    pos[i * 3 + 1] = dist * Math.sin(angle);
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
  }

  for (let i = leafCount; i < count; i++) {
    const t = Math.random();
    const stemY = -t * 3.4;
    const stemX = Math.sin(t * 2.2) * 0.8;
    const spread = (Math.random() - 0.5) * 0.2;
    pos[i * 3] = stemX + spread;
    pos[i * 3 + 1] = stemY;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
  }
  return pos;
}

/**
 * Generates a 3D Acorn with textured cup cap and stem for Thanksgiving.
 */
export function generateAcorn(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const nutCount = Math.floor(count * 0.6);
  const capCount = Math.floor(count * 0.32);

  // Nut body (tapered downward)
  for (let i = 0; i < nutCount; i++) {
    const t = Math.random();
    const y = 0.5 - t * 3.5;
    const maxR = 2.4 * Math.sin(t * Math.PI * 0.85);
    const r = Math.sqrt(Math.random()) * maxR;
    const theta = Math.random() * Math.PI * 2;
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }

  // Textured cup cap
  for (let i = nutCount; i < nutCount + capCount; i++) {
    const t = Math.random();
    const y = 0.3 + t * 1.9;
    const maxR = 2.65 * (1 - Math.pow(t, 2) * 0.6);
    const r = (0.7 + 0.3 * Math.random()) * maxR;
    const theta = Math.random() * Math.PI * 2;
    pos[i * 3] = r * Math.cos(theta);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }

  // Stem
  for (let i = nutCount + capCount; i < count; i++) {
    const t = Math.random();
    const y = 2.1 + t * 1.4;
    const x = Math.sin(t * 1.5) * 0.4;
    const r = Math.random() * 0.25;
    const theta = Math.random() * Math.PI * 2;
    pos[i * 3] = x + r * Math.cos(theta);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = r * Math.sin(theta);
  }
  return pos;
}

/**
 * Generates the Greek letter Pi (π) in 3D for Pi Day.
 */
export function generatePi(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const barCount = Math.floor(count * 0.4);
  const leg1Count = Math.floor(count * 0.3);

  // Top horizontal crossbar with left overhang
  for (let i = 0; i < barCount; i++) {
    const x = (Math.random() - 0.5) * 5.2;
    const y = 2.2 + (Math.random() - 0.5) * 0.55;
    const z = (Math.random() - 0.5) * 0.6;
    const curl = x < -2.0 ? Math.pow(-x - 2.0, 2) * 0.3 : 0;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y - curl;
    pos[i * 3 + 2] = z;
  }

  // Left vertical leg
  for (let i = barCount; i < barCount + leg1Count; i++) {
    const x = -1.3 + (Math.random() - 0.5) * 0.5;
    const y = -2.4 + Math.random() * 4.4;
    const z = (Math.random() - 0.5) * 0.6;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }

  // Right vertical leg with curved foot hook
  for (let i = barCount + leg1Count; i < count; i++) {
    const t = Math.random();
    const y = -2.4 + t * 4.4;
    let x = 1.3 + (Math.random() - 0.5) * 0.5;
    if (t < 0.25) {
      x += Math.pow((0.25 - t) * 4, 1.5) * 0.8;
    }
    const z = (Math.random() - 0.5) * 0.6;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/**
 * Generates a 3D CPU Microchip processor with pins for Programmers' Day.
 */
export function generateChip(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const dieCount = Math.floor(count * 0.65);

  // Central square processor core die
  for (let i = 0; i < dieCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 4.6;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 4.6;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
  }

  // External bus pins
  for (let i = dieCount; i < count; i++) {
    const side = Math.floor(Math.random() * 4);
    const pinIndex = Math.floor(Math.random() * 7) - 3;
    const pinOffset = pinIndex * 0.6;
    const ext = Math.random() * 1.4;

    let x = 0;
    let y = 0;
    if (side === 0) {
      x = pinOffset + (Math.random() - 0.5) * 0.15;
      y = 2.3 + ext;
    } else if (side === 1) {
      x = 2.3 + ext;
      y = pinOffset + (Math.random() - 0.5) * 0.15;
    } else if (side === 2) {
      x = pinOffset + (Math.random() - 0.5) * 0.15;
      y = -2.3 - ext;
    } else {
      x = -2.3 - ext;
      y = pinOffset + (Math.random() - 0.5) * 0.15;
    }

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return pos;
}

/**
 * Generates a 5-petal Cherry Blossom (Sakura) with notched petal clefts.
 */
export function generateSakura(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const petalAngle = (t * 5) % (Math.PI * 2);
    const notch = 1 - 0.22 * Math.pow(Math.cos(petalAngle / 2), 12);
    const baseR = (2.2 + 1.8 * Math.cos(5 * t)) * notch;
    const r = baseR * (0.35 + 0.65 * Math.sqrt(Math.random()));
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const z = Math.sin(r * 0.7) * 0.7 + (Math.random() - 0.5) * 0.4;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/**
 * Generates a richly detailed 3D Pan-African Heritage Shield & Continental Crest for Black History Month.
 * Features:
 * 1. Traditional curved African warrior shield outline with double beveled rim and convex curvature
 * 2. Tri-band Pan-African decorative chevron sashes across the shield face
 * 3. Detailed African continental silhouette embossed in high relief in the center
 * 4. Central vertical warrior spine/staff extending past poles with woven bindings
 * 5. 8-pointed radiant Crown Star of Unity at the peak
 */
export function generateCrest(count: number): Float32Array {
  const pos = new Float32Array(count * 3);

  const rimCount = Math.floor(count * 0.28);
  const stripeCount = Math.floor(count * 0.20);
  const africaCount = Math.floor(count * 0.32);
  const spineCount = Math.floor(count * 0.10);
  const crownCount = count - rimCount - stripeCount - africaCount - spineCount;

  let p = 0;

  // 1. Traditional African Warrior Shield Perimeter & Beveled Rim (convex 3D curve)
  for (let i = 0; i < rimCount; i++, p++) {
    const t = Math.random() * Math.PI * 2;
    // Shield width: wider in the middle chest, tapering gracefully to points at poles
    const shieldWidth = 2.45 * Math.cos(t * 0.5);
    const y = 3.65 * Math.sin(t);
    const x = shieldWidth * Math.cos(t) * 1.32;
    const rimLayer = Math.random() > 0.45 ? 1.0 : 0.91; // double layered beveled rim
    const px = x * rimLayer;
    const py = y * rimLayer;
    // Outward convex curvature across shield face
    const pz = Math.max(0, 1 - Math.pow(px / 2.7, 2) - Math.pow(py / 3.8, 2)) * 0.95;

    pos[p * 3] = px;
    pos[p * 3 + 1] = py;
    pos[p * 3 + 2] = pz + (Math.random() - 0.5) * 0.15;
  }

  // 2. Pan-African Geometric Chevrons / Tri-band Sashes across shield face
  for (let i = 0; i < stripeCount; i++, p++) {
    const band = Math.floor(Math.random() * 3); // 3 bands (-1.3, 0, 1.3)
    const bandY = -1.35 + band * 1.35;
    const u = (Math.random() - 0.5) * 2;
    const maxHalfWidth = 2.3 * Math.sqrt(Math.max(0.1, 1 - Math.pow(bandY / 3.7, 2)));
    const px = u * maxHalfWidth;
    // Traditional African chevron V-accent
    const chevronOffset = -Math.abs(px) * 0.22;
    const py = bandY + chevronOffset + (Math.random() - 0.5) * 0.25;
    const pz = Math.max(0, 1 - Math.pow(px / 2.7, 2) - Math.pow(py / 3.8, 2)) * 0.95 + 0.12;

    pos[p * 3] = px;
    pos[p * 3 + 1] = py;
    pos[p * 3 + 2] = pz;
  }

  // 3. African Continental Silhouette in the Center of the Shield
  for (let i = 0; i < africaCount; i++, p++) {
    const v = Math.random(); // 0 = southern Cape, 1 = northern coast
    const y = -1.85 + v * 3.4;

    let minX = -0.5;
    let maxX = 0.5;

    if (v < 0.35) {
      // Southern Africa: tapers down to the Cape of Good Hope
      const t = v / 0.35;
      minX = -0.15 - t * 0.65;
      maxX = 0.15 + t * 0.55;
    } else if (v < 0.72) {
      // Equatorial & West Africa: strong western bulge, eastern Horn of Africa
      const t = (v - 0.35) / 0.37;
      minX = -0.8 - Math.sin(t * Math.PI) * 0.88; // West Africa bulge
      maxX = 0.65 + (t > 0.35 ? Math.sin((t - 0.35) * Math.PI) * 0.95 : 0.15); // Horn of Africa
    } else {
      // North Africa / Sahara: broad Mediterranean coast tapering into Egypt
      const t = (v - 0.72) / 0.28;
      minX = -1.35 + t * 0.35;
      maxX = 1.15 - t * 0.35;
    }

    const u = Math.random();
    // 65% boundary definition for razor-sharp continental coast, 35% interior fill
    const x =
      Math.random() > 0.35
        ? Math.random() > 0.5
          ? minX + (Math.random() - 0.5) * 0.12
          : maxX + (Math.random() - 0.5) * 0.12
        : minX + u * (maxX - minX);

    // Raised in proud relief on the face of the shield
    const pz = 0.8 + (1 - Math.abs(x) / 1.6) * 0.5;

    pos[p * 3] = x * 1.08;
    pos[p * 3 + 1] = y * 0.95;
    pos[p * 3 + 2] = pz;
  }

  // 4. Central Vertical Warrior Spine / Staff (Traditional African Shield spine)
  for (let i = 0; i < spineCount; i++, p++) {
    const t = Math.random();
    const y = -4.3 + t * 8.6; // runs full height, protruding slightly past poles
    const r = Math.random() * 0.16;
    const theta = Math.random() * Math.PI * 2;
    const spineZ = Math.max(0, 1 - Math.pow(y / 4.0, 2)) * 0.98 + 0.28;

    pos[p * 3] = r * Math.cos(theta);
    pos[p * 3 + 1] = y;
    pos[p * 3 + 2] = spineZ + r * Math.sin(theta);
  }

  // 5. Crown Star of Unity atop the Crest (y: 3.8 to 4.8)
  for (let i = 0; i < crownCount; i++, p++) {
    const ray = Math.floor(Math.random() * 8); // 8-point radiant star
    const angle = (ray * Math.PI * 2) / 8 + Math.PI / 8;
    const dist = Math.random() * (ray % 2 === 0 ? 0.85 : 0.45);
    const spread = (Math.random() - 0.5) * 0.15;

    pos[p * 3] = dist * Math.cos(angle + spread);
    pos[p * 3 + 1] = 4.1 + dist * Math.sin(angle + spread);
    pos[p * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }

  return pos;
}

const AFRICA_PERIMETER: [number, number][] = [
  [-1.8, 3.6], // Tangier / Morocco
  [-0.6, 3.8], // Algerian coast
  [0.5, 4.2], // Tunisia (Cap Blanc - North tip)
  [0.8, 3.7], // Gulf of Gabes
  [1.4, 3.2], // Gulf of Sidra (Libya)
  [2.1, 3.3], // Cyrenaica / Tobruk
  [2.5, 3.1], // Egypt / Sinai
  [2.8, 2.3], // Upper Red Sea
  [3.0, 1.4], // Eritrea / Bab-el-Mandeb
  [3.7, 1.2], // Gulf of Aden coast
  [4.2, 0.9], // Horn of Africa (Somalia - East tip)
  [3.8, 0.2], // Somali Indian Ocean coast
  [3.1, -0.6], // Mogadishu / Kenya border
  [2.5, -1.2], // Mombasa / Tanzania
  [2.4, -2.0], // Mozambique channel coast
  [2.0, -2.8], // Mozambique south
  [1.6, -3.4], // Durban
  [1.0, -4.0], // Port Elizabeth
  [0.5, -4.2], // Cape Agulhas (South tip)
  [0.0, -3.9], // Cape Town
  [-0.4, -3.2], // Namibian south coast
  [-0.6, -2.2], // Walvis Bay
  [-0.6, -1.2], // Angola coast
  [-0.6, 0.3], // Cameroon / Bight of Biafra
  [-1.0, 0.6], // Nigeria / Niger Delta
  [-1.8, 0.7], // Gulf of Guinea (Ghana / Ivory Coast)
  [-2.8, 0.9], // Liberia / Sierra Leone
  [-3.8, 1.3], // Guinea / Guinea-Bissau
  [-4.2, 1.8], // Cap-Vert (Senegal - West tip)
  [-3.9, 2.4], // Mauritania coast
  [-3.2, 3.0], // Western Sahara
  [-2.2, 3.3], // Southern Morocco
];

function isInsideAfrica(x: number, y: number): boolean {
  let inside = false;
  const n = AFRICA_PERIMETER.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = AFRICA_PERIMETER[i][0];
    const yi = AFRICA_PERIMETER[i][1];
    const xj = AFRICA_PERIMETER[j][0];
    const yj = AFRICA_PERIMETER[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Generates an accurate, high-definition 3D map of the African Continent and Madagascar.
 */
export function generateAfrica(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const n = AFRICA_PERIMETER.length;

  const coastCount = Math.floor(count * 0.46);
  const madagascarCount = Math.floor(count * 0.08);
  const interiorCount = count - coastCount - madagascarCount;

  // 1. High-definition coastline along perimeter
  for (let i = 0; i < coastCount; i++) {
    const seg = Math.floor(Math.random() * n);
    const next = (seg + 1) % n;
    const t = Math.random();
    const x0 = AFRICA_PERIMETER[seg][0];
    const y0 = AFRICA_PERIMETER[seg][1];
    const x1 = AFRICA_PERIMETER[next][0];
    const y1 = AFRICA_PERIMETER[next][1];

    const jitter = (Math.random() - 0.5) * 0.08;
    const x = x0 + t * (x1 - x0) + jitter;
    const y = y0 + t * (y1 - y0) + jitter;
    const z = (Math.random() - 0.5) * 0.2;

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
  }

  // 2. Interior landmass fill via point-in-polygon rejection sampling
  let filled = 0;
  let attempts = 0;
  const maxAttempts = interiorCount * 30;

  while (filled < interiorCount && attempts < maxAttempts) {
    attempts++;
    const testX = (Math.random() - 0.5) * 8.4;
    const testY = (Math.random() - 0.5) * 8.4;

    if (isInsideAfrica(testX, testY)) {
      const idx = coastCount + filled;
      // Gentle topographic elevation in the interior
      const topo = Math.sin(testX * 0.8) * Math.cos(testY * 0.8) * 0.35;
      const z = topo + (Math.random() - 0.5) * 0.25;

      pos[idx * 3] = testX;
      pos[idx * 3 + 1] = testY;
      pos[idx * 3 + 2] = z;
      filled++;
    }
  }

  // Fallback if max attempts exceeded
  while (filled < interiorCount) {
    const idx = coastCount + filled;
    const seg = Math.floor(Math.random() * n);
    pos[idx * 3] = AFRICA_PERIMETER[seg][0] * 0.8;
    pos[idx * 3 + 1] = AFRICA_PERIMETER[seg][1] * 0.8;
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;
    filled++;
  }

  // 3. Madagascar island off southeast coast
  for (let i = 0; i < madagascarCount; i++) {
    const idx = coastCount + interiorCount + i;
    const t = (Math.random() - 0.5) * 2; // -1 to 1 along length
    const w = (Math.random() - 0.5) * (1 - Math.pow(t, 2) * 0.45);
    const angle = -0.42; // tilted parallel to Mozambique channel
    const len = t * 1.0;
    const wid = w * 0.35;
    const mx = 3.3 + len * Math.sin(angle) + wid * Math.cos(angle);
    const my = -2.2 + len * Math.cos(angle) - wid * Math.sin(angle);
    const mz = (Math.random() - 0.5) * 0.2;

    pos[idx * 3] = mx;
    pos[idx * 3 + 1] = my;
    pos[idx * 3 + 2] = mz;
  }

  return pos;
}

/**
 * Generates a 3D Mexican Sombrero with a wide upturned brim, tall creased crown, and decorative trim.
 */
export function generateSombrero(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const brimCount = Math.floor(count * 0.52);
  const rimCount = Math.floor(count * 0.12);
  const bandCount = Math.floor(count * 0.08);
  const crownCount = count - brimCount - rimCount - bandCount;

  let idx = 0;

  // 1. Wide flared brim curving gently upward toward the edges
  const rInner = 1.35;
  const rOuter = 4.2;
  for (let i = 0; i < brimCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const u = Math.random();
    const r = rInner + Math.sqrt(u) * (rOuter - rInner);
    const normR = (r - rInner) / (rOuter - rInner);
    const y = -0.6 + Math.pow(normR, 2.2) * 1.15 + (Math.random() - 0.5) * 0.08;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 2. Curled outer rolled rim along the brim perimeter
  for (let i = 0; i < rimCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = rOuter + (Math.random() - 0.5) * 0.25;
    const y = 0.55 + Math.random() * 0.35;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 3. Embroidered hatband wrapping the crown base
  for (let i = 0; i < bandCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.38 + (Math.random() - 0.5) * 0.08;
    const y = -0.55 + Math.random() * 0.35;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 4. Tall conical crown with classic center crease / indent
  for (let i = 0; i < crownCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const t = Math.random(); // 0 at base, 1 at peak
    const rBase = 1.35;
    const rTop = 0.65;
    const r = (rBase * (1 - t) + rTop * t) * (0.94 + 0.06 * Math.sin(6 * theta));

    // Indent at the apex along the front-to-back crease
    const creaseIndent = t > 0.65 ? Math.pow((t - 0.65) / 0.35, 2) * 0.35 * Math.pow(Math.abs(Math.sin(theta)), 1.5) : 0;
    const y = -0.55 + t * 2.85 - creaseIndent + (Math.random() - 0.5) * 0.08;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  return pos;
}

/**
 * Generates the Juneteenth Freedom Star: a 5-pointed Texas star surrounded by a radiating nova burst and arched horizon.
 */
export function generateFreedomStar(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const starCount = Math.floor(count * 0.45);
  const burstCount = Math.floor(count * 0.38);
  const arcCount = count - starCount - burstCount;

  let idx = 0;

  // 1. Central 5-pointed Star of Freedom (faceted 3D geometry)
  const R_outer = 2.1;
  const R_inner = 0.9;
  const dAngle = Math.PI / 5; // 36 degrees per half-segment

  for (let i = 0; i < starCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const shiftedAngle = angle + Math.PI / 2;
    const seg = ((shiftedAngle % (2 * dAngle)) + 2 * dAngle) % (2 * dAngle);
    const thetaInSeg = seg <= dAngle ? seg : 2 * dAngle - seg;

    const edgeR = (R_outer * R_inner * Math.sin(dAngle)) /
      Math.max(0.001, (R_inner * Math.sin(thetaInSeg) + R_outer * Math.sin(dAngle - thetaInSeg)));

    const r = Math.sqrt(Math.random()) * edgeR;
    const zPeak = (1 - r / R_outer) * 0.65 * (Math.random() > 0.5 ? 1 : -1) + (Math.random() - 0.5) * 0.08;

    pos[idx * 3] = r * Math.cos(angle);
    pos[idx * 3 + 1] = r * Math.sin(angle);
    pos[idx * 3 + 2] = zPeak;
    idx++;
  }

  // 2. Radiating Nova Burst (16 radiating starburst rays)
  const numRays = 16;
  for (let i = 0; i < burstCount; i++) {
    const rayIdx = Math.floor(Math.random() * numRays);
    const isLongRay = rayIdx % 2 === 0;
    const baseAngle = rayIdx * (2 * Math.PI / numRays) - Math.PI / 2;
    const rayAngle = baseAngle + (Math.random() - 0.5) * 0.06;

    const rMin = 2.25;
    const rMax = isLongRay ? 4.2 : 3.2;
    const r = rMin + Math.random() * (rMax - rMin);

    pos[idx * 3] = r * Math.cos(rayAngle);
    pos[idx * 3 + 1] = r * Math.sin(rayAngle);
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.28;
    idx++;
  }

  // 3. Arched Freedom Horizon Arc
  for (let i = 0; i < arcCount; i++) {
    const t = Math.random();
    const arcAngle = Math.PI * (0.8 + t * 1.4);
    const rArc = 3.6 + (Math.random() - 0.5) * 0.25;

    pos[idx * 3] = rArc * Math.cos(arcAngle);
    pos[idx * 3 + 1] = rArc * Math.sin(arcAngle) * 0.65 - 0.35;
    pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;
    idx++;
  }

  return pos;
}

/**
 * Generates a traditional Chinese paper lantern with ribs, golden caps, and hanging tassel for Lunar New Year.
 */
export function generateLantern(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const bodyCount = Math.floor(count * 0.6);
  const capCount = Math.floor(count * 0.15);
  const tasselCount = count - bodyCount - capCount;

  let idx = 0;

  // 1. Lantern body: ribbed oval paper shell + inner candle warmth
  for (let i = 0; i < bodyCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const yNorm = Math.random() * 2 - 1; // -1 to 1
    const y = yNorm * 1.95;

    // 10 vertical accordion ribs
    const ribMod = 1.0 + 0.14 * Math.cos(10 * theta);
    const maxR = 2.65 * Math.sqrt(Math.max(0, 1 - Math.pow(yNorm, 2))) * ribMod;

    // Shell vs inner glow
    const isShell = Math.random() > 0.25;
    const r = isShell ? maxR * (0.95 + 0.05 * Math.random()) : maxR * Math.random() * 0.7;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y + 0.5;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 2. Top and bottom golden collars + top suspension ring
  const halfCap = Math.floor(capCount / 2);
  for (let i = 0; i < halfCap; i++) {
    if (i < halfCap * 0.4) {
      const ringAngle = Math.random() * Math.PI * 2;
      const ringR = 0.45;
      pos[idx * 3] = ringR * Math.cos(ringAngle);
      pos[idx * 3 + 1] = 2.85 + ringR * Math.sin(ringAngle);
      pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.1;
    } else {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 1.0;
      pos[idx * 3] = r * Math.cos(theta);
      pos[idx * 3 + 1] = 2.45 + (Math.random() - 0.5) * 0.2;
      pos[idx * 3 + 2] = r * Math.sin(theta);
    }
    idx++;
  }

  for (let i = halfCap; i < capCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.95;
    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = -1.45 + (Math.random() - 0.5) * 0.2;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 3. Hanging tassel cascading downward with knot and flaring silk strands
  for (let i = 0; i < tasselCount; i++) {
    const isKnot = i < tasselCount * 0.22;
    if (isKnot) {
      const angle = Math.random() * Math.PI * 2;
      const knotR = Math.random() * 0.5;
      pos[idx * 3] = knotR * Math.cos(angle);
      pos[idx * 3 + 1] = -1.8 - Math.random() * 0.45;
      pos[idx * 3 + 2] = (Math.random() - 0.5) * 0.25;
    } else {
      const t = Math.random();
      const y = -2.25 - t * 2.25;
      const strandAngle = Math.random() * Math.PI * 2;
      const spread = (0.18 + Math.pow(t, 1.4) * 0.65) * Math.random();

      pos[idx * 3] = spread * Math.cos(strandAngle);
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = spread * Math.sin(strandAngle);
    }
    idx++;
  }

  return pos;
}

/**
 * Generates an ornate Diya (traditional clay oil lamp) with radiant teardrop flame for Diwali.
 */
export function generateDiya(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const bowlCount = Math.floor(count * 0.55);
  const flameCount = Math.floor(count * 0.32);
  const emberCount = count - bowlCount - flameCount;

  let idx = 0;

  // 1. Clay oil lamp bowl (deep circular dish with pinched pouring spout pointing along +X)
  for (let i = 0; i < bowlCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const v = Math.random(); // 0 at base, 1 at rim
    const y = -2.3 + v * 1.4;

    const rBase = 1.05 + Math.sin(v * Math.PI * 0.5) * 1.75;
    const cosVal = Math.cos(theta);
    const spoutFactor = cosVal > 0 ? Math.pow(cosVal, 3.5) * 1.35 : 0;
    const r = (rBase + spoutFactor) * (0.95 + 0.05 * Math.random());

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 2. Radiant teardrop flame rising upright from the wick
  for (let i = 0; i < flameCount; i++) {
    const v = Math.random();
    const flameHeight = 3.2;
    const y = -0.85 + v * flameHeight;

    const flameEnvelope = 1.25 * Math.sin(v * Math.PI) * Math.pow(1 - v, 0.42);
    const isCore = Math.random() > 0.4;
    const rFlame = isCore ? flameEnvelope * Math.random() * 0.55 : flameEnvelope * (0.85 + 0.15 * Math.random());

    const angle = Math.random() * Math.PI * 2;
    const curlX = Math.pow(v, 2.2) * 0.35;
    const curlZ = Math.sin(v * Math.PI * 1.5) * 0.12;

    pos[idx * 3] = 0.55 + curlX + rFlame * Math.cos(angle);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = curlZ + rFlame * Math.sin(angle);
    idx++;
  }

  // 3. Floating embers and warm light particles hovering around and above the flame
  for (let i = 0; i < emberCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 0.4 + Math.random() * 1.8;

    pos[idx * 3] = 0.55 + r * Math.sin(phi) * Math.cos(theta);
    pos[idx * 3 + 1] = 1.5 + r * Math.cos(phi) * 0.9;
    pos[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    idx++;
  }

  return pos;
}

/**
 * Generates Tux the Penguin for Linux Anniversary (complete with round head, beak, eyes, plump torso, flippers, and webbed feet).
 */
export function generatePenguin(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const bodyCount = Math.floor(count * 0.46);
  const headCount = Math.floor(count * 0.22);
  const beakCount = Math.floor(count * 0.08);
  const eyesCount = Math.floor(count * 0.05);
  const flipperCount = Math.floor(count * 0.11);
  const feetCount = count - bodyCount - headCount - beakCount - eyesCount - flipperCount;

  let idx = 0;

  // 1. Plump pear-shaped penguin torso (y: -2.0 to 0.4)
  for (let i = 0; i < bodyCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const t = Math.random(); // 0 at base, 1 at neck
    const y = -2.0 + t * 2.4;

    // Torso radius expands at bottom belly, gently tapers at neck
    const rBase = 2.15 * Math.sin(t * Math.PI * 0.72 + 0.32);
    // Plump forward belly projection
    const forwardBelly = Math.sin(theta) > 0 ? 1.15 : 0.88;
    const r = rBase * forwardBelly * (0.94 + 0.06 * Math.random());

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 2. Round head (centered at y = 1.35)
  for (let i = 0; i < headCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = (1.2 + Math.random() * 0.12);

    pos[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[idx * 3 + 1] = 1.35 + r * Math.cos(phi) * 0.95;
    pos[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    idx++;
  }

  // 3. Iconic wide triangular beak pointing forward (+Z)
  for (let i = 0; i < beakCount; i++) {
    const u = Math.random(); // 0 at face base, 1 at beak tip
    const z = 1.15 + u * 0.85;
    const w = (1 - u) * 0.44; // Tapering width
    const h = (1 - u) * 0.24; // Tapering height

    pos[idx * 3] = (Math.random() - 0.5) * w * 1.8;
    pos[idx * 3 + 1] = 1.25 + (Math.random() - 0.5) * h - u * 0.08;
    pos[idx * 3 + 2] = z;
    idx++;
  }

  // 4. Large expressive round eyes
  const halfEyes = Math.floor(eyesCount / 2);
  for (let i = 0; i < eyesCount; i++) {
    const isLeft = i < halfEyes;
    const eyeX = isLeft ? -0.42 : 0.42;
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.22;

    pos[idx * 3] = eyeX + r * Math.cos(theta);
    pos[idx * 3 + 1] = 1.58 + r * Math.sin(theta);
    pos[idx * 3 + 2] = 1.18 + (Math.random() - 0.5) * 0.08;
    idx++;
  }

  // 5. Flippers / Wings extended on sides and angled downward
  const halfFlippers = Math.floor(flipperCount / 2);
  for (let i = 0; i < flipperCount; i++) {
    const isLeft = i < halfFlippers;
    const side = isLeft ? -1 : 1;
    const t = Math.random(); // 0 at shoulder, 1 at flipper tip
    
    // Shoulder starts at (±1.5, 0.3, 0), extends down to (±2.7, -1.1, -0.35)
    const wingX = side * (1.5 + t * 1.25);
    const wingY = 0.3 - t * 1.45;
    const wingZ = -t * 0.35;
    const spread = (Math.random() - 0.5) * (1 - Math.pow(t, 2) * 0.4) * 0.35;

    pos[idx * 3] = wingX + (Math.random() - 0.5) * 0.15;
    pos[idx * 3 + 1] = wingY + spread;
    pos[idx * 3 + 2] = wingZ + (Math.random() - 0.5) * 0.12;
    idx++;
  }

  // 6. Webbed paddle feet at base
  const halfFeet = Math.floor(feetCount / 2);
  for (let i = 0; i < feetCount; i++) {
    const isLeft = i < halfFeet;
    const side = isLeft ? -1 : 1;
    const footCenterX = side * 0.85;
    const u = Math.random(); // 0 at ankle, 1 at front toes
    const z = 0.3 + u * 1.2;
    const fanWidth = (0.25 + u * 0.65) * (Math.random() - 0.5);

    pos[idx * 3] = footCenterX + fanWidth + side * u * 0.3;
    pos[idx * 3 + 1] = -2.15 - Math.random() * 0.18;
    pos[idx * 3 + 2] = z;
    idx++;
  }

  return pos;
}

/**
 * Generates a majestic 3D Turkey for Thanksgiving with a grand fanned tail, plump roasted body, wings, curved neck, head, wattle, and legs.
 */
export function generateTurkey(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const tailCount = Math.floor(count * 0.36);
  const bodyCount = Math.floor(count * 0.30);
  const wingCount = Math.floor(count * 0.12);
  const headCount = Math.floor(count * 0.12);
  const legCount = count - tailCount - bodyCount - wingCount - headCount;

  let idx = 0;

  // 1. Grand Fanned Tail Feathers arching semi-circularly behind the turkey
  const numRays = 13;
  for (let i = 0; i < tailCount; i++) {
    const rayIdx = Math.floor(Math.random() * numRays);
    const baseAngle = (rayIdx / (numRays - 1)) * Math.PI; // 0 to PI
    const angle = baseAngle + (Math.random() - 0.5) * 0.1;
    const r = 1.0 + Math.random() * 2.7;

    const x = r * Math.cos(angle);
    const y = -0.5 + r * Math.sin(angle) * 0.95;
    const z = -0.75 - (r / 3.7) * 0.45 + (Math.random() - 0.5) * 0.12;

    pos[idx * 3] = x;
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = z;
    idx++;
  }

  // 2. Plump harvest turkey body / torso
  for (let i = 0; i < bodyCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const t = Math.random(); // 0 at base, 1 at neck
    const y = -1.95 + t * 2.1;

    const rBase = 1.85 * Math.sin(t * Math.PI * 0.72 + 0.32);
    const breastBulge = Math.sin(theta) > 0 ? 1.2 : 0.88;
    const r = rBase * breastBulge * (0.94 + 0.06 * Math.random());

    pos[idx * 3] = r * Math.cos(theta) * 1.1;
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 3. Folded feather wings on left and right flanks
  const halfWings = Math.floor(wingCount / 2);
  for (let i = 0; i < wingCount; i++) {
    const isLeft = i < halfWings;
    const side = isLeft ? -1 : 1;
    const wT = Math.random();
    const wingX = side * (1.25 + wT * 0.75);
    const wingY = -0.45 - wT * 1.15;
    const wingZ = -0.1 + (Math.random() - 0.5) * 0.45;

    pos[idx * 3] = wingX + (Math.random() - 0.5) * 0.15;
    pos[idx * 3 + 1] = wingY;
    pos[idx * 3 + 2] = wingZ;
    idx++;
  }

  // 4. Stately S-curve neck, turkey head, beak, and dangling snood / wattle
  for (let i = 0; i < headCount; i++) {
    const part = Math.random();
    if (part < 0.45) {
      const nT = Math.random();
      const nY = -0.15 + nT * 1.45;
      const nZ = 0.4 + Math.sin(nT * Math.PI) * 0.45 + nT * 0.35;
      const nR = (0.42 - nT * 0.15) * Math.random();
      const nAngle = Math.random() * Math.PI * 2;

      pos[idx * 3] = nR * Math.cos(nAngle);
      pos[idx * 3 + 1] = nY;
      pos[idx * 3 + 2] = nZ + nR * Math.sin(nAngle);
    } else if (part < 0.75) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const hR = 0.52 * Math.random();

      pos[idx * 3] = hR * Math.sin(phi) * Math.cos(theta);
      pos[idx * 3 + 1] = 1.35 + hR * Math.cos(phi) * 0.95;
      pos[idx * 3 + 2] = 1.1 + hR * Math.sin(phi) * Math.sin(theta);
    } else {
      const wT = Math.random();
      pos[idx * 3] = (Math.random() - 0.5) * 0.12;
      pos[idx * 3 + 1] = 1.3 - wT * 0.85;
      pos[idx * 3 + 2] = 1.35 - wT * 0.25 + (Math.random() - 0.5) * 0.08;
    }
    idx++;
  }

  // 5. Sturdy turkey legs and claws at base
  const halfLegs = Math.floor(legCount / 2);
  for (let i = 0; i < legCount; i++) {
    const isLeft = i < halfLegs;
    const side = isLeft ? -1 : 1;
    const lT = Math.random();
    if (lT < 0.65) {
      const legY = -1.95 - (lT / 0.65) * 0.85;
      pos[idx * 3] = side * 0.65 + (Math.random() - 0.5) * 0.1;
      pos[idx * 3 + 1] = legY;
      pos[idx * 3 + 2] = 0.05 + (Math.random() - 0.5) * 0.1;
    } else {
      const toeIdx = Math.floor(Math.random() * 3) - 1;
      const cT = Math.random();
      pos[idx * 3] = side * 0.65 + toeIdx * cT * 0.25;
      pos[idx * 3 + 1] = -2.8 - Math.random() * 0.08;
      pos[idx * 3 + 2] = 0.05 + cT * 0.45;
    }
    idx++;
  }

  return pos;
}

/**
 * Generates a spectacular 3D Fireworks celebration for New Year's: multiple expanding burst peonies, willow spark trails, and rising rocket flares.
 */
export function generateFireworks(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const mainBurstCount = Math.floor(count * 0.50);
  const leftBurstCount = Math.floor(count * 0.20);
  const rightBurstCount = Math.floor(count * 0.18);
  const rocketCount = count - mainBurstCount - leftBurstCount - rightBurstCount;

  let idx = 0;

  // 1. Grand central firework peony burst (center at 0, 0.6, 0)
  const numStreamers = 26;
  for (let i = 0; i < mainBurstCount; i++) {
    const sIdx = Math.floor(Math.random() * numStreamers);
    const theta = (sIdx / numStreamers) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 0.5 + Math.random() * 3.4;
    const droop = -0.065 * Math.pow(r, 1.6);

    pos[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[idx * 3 + 1] = 0.6 + r * Math.cos(phi) + droop;
    pos[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    idx++;
  }

  // 2. Secondary companion burst on left (center at -2.7, -0.4, 0.5)
  for (let i = 0; i < leftBurstCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 0.35 + Math.random() * 2.2;
    const droop = -0.05 * Math.pow(r, 1.5);

    pos[idx * 3] = -2.7 + r * Math.sin(phi) * Math.cos(theta);
    pos[idx * 3 + 1] = -0.4 + r * Math.cos(phi) + droop;
    pos[idx * 3 + 2] = 0.5 + r * Math.sin(phi) * Math.sin(theta);
    idx++;
  }

  // 3. Secondary companion burst on right (center at 2.6, 1.7, -0.4)
  for (let i = 0; i < rightBurstCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 0.35 + Math.random() * 2.0;
    const droop = -0.05 * Math.pow(r, 1.5);

    pos[idx * 3] = 2.6 + r * Math.sin(phi) * Math.cos(theta);
    pos[idx * 3 + 1] = 1.7 + r * Math.cos(phi) + droop;
    pos[idx * 3 + 2] = -0.4 + r * Math.sin(phi) * Math.sin(theta);
    idx++;
  }

  // 4. Rising rocket trails ascending from the bottom
  for (let i = 0; i < rocketCount; i++) {
    const t = Math.random();
    const targetRocket = Math.random();
    let rx = 0, ryTarget = 0.6, rz = 0;

    if (targetRocket < 0.55) {
      rx = 0;
      ryTarget = 0.6;
      rz = 0;
    } else if (targetRocket < 0.8) {
      rx = -2.7;
      ryTarget = -0.4;
      rz = 0.5;
    } else {
      rx = 2.6;
      ryTarget = 1.7;
      rz = -0.4;
    }

    const startY = -4.5;
    const y = startY + t * (ryTarget - startY);
    const spread = (1 - t) * 0.25 + 0.05;

    pos[idx * 3] = rx + (Math.random() - 0.5) * spread;
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = rz + (Math.random() - 0.5) * spread;
    idx++;
  }

  return pos;
}

/**
 * Generates a 3D Firework Sparkler: metallic wire handle, pyrotechnic fuel rod, incandescent burning core, and dendritic starburst spark crackles.
 */
export function generateSparkler(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const handleCount = Math.floor(count * 0.18);
  const fuelRodCount = Math.floor(count * 0.20);
  const coreCount = Math.floor(count * 0.15);
  const sparksCount = count - handleCount - fuelRodCount - coreCount;

  let idx = 0;

  // 1. Bare metal wire handle at bottom (held in hand): y from -4.2 to -1.2
  for (let i = 0; i < handleCount; i++) {
    const t = Math.random();
    const y = -4.2 + t * 3.0;
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 0.07;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 2. Coated pyrotechnic fuel cylinder: y from -1.2 to 1.1
  for (let i = 0; i < fuelRodCount; i++) {
    const t = Math.random();
    const y = -1.2 + t * 2.3;
    const theta = Math.random() * Math.PI * 2;
    const r = 0.14 + (Math.random() - 0.5) * 0.06;

    pos[idx * 3] = r * Math.cos(theta);
    pos[idx * 3 + 1] = y;
    pos[idx * 3 + 2] = r * Math.sin(theta);
    idx++;
  }

  // 3. Blazing hot incandescent core at the burning tip (y: 1.0 to 1.35)
  for (let i = 0; i < coreCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = Math.random() * 0.42;

    pos[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[idx * 3 + 1] = 1.18 + r * Math.cos(phi) * 0.7;
    pos[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    idx++;
  }

  // 4. Dendritic starburst sparks crackling and spitting in sharp 3D needles
  const numNeedles = 36;
  for (let i = 0; i < sparksCount; i++) {
    const isDroppingEmber = Math.random() < 0.15;
    if (isDroppingEmber) {
      const fallT = Math.random();
      const dropY = 1.15 - Math.pow(fallT, 1.4) * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const driftR = 0.1 + fallT * 0.6;

      pos[idx * 3] = driftR * Math.cos(angle);
      pos[idx * 3 + 1] = dropY;
      pos[idx * 3 + 2] = driftR * Math.sin(angle);
    } else {
      const needleIdx = Math.floor(Math.random() * numNeedles);
      const theta = (needleIdx / numNeedles) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const phi = Math.acos(Math.random() * 2 - 1);
      const u = Math.random();
      const rayLen = 0.4 + Math.pow(u, 0.8) * 2.8;

      const fork = (Math.random() - 0.5) * 0.22;

      pos[idx * 3] = rayLen * Math.sin(phi) * Math.cos(theta) + fork;
      pos[idx * 3 + 1] = 1.18 + rayLen * Math.cos(phi) - Math.pow(rayLen / 3.2, 2) * 0.35;
      pos[idx * 3 + 2] = rayLen * Math.sin(phi) * Math.sin(theta) + fork;
    }
    idx++;
  }

  return pos;
}

/**
 * Resolves the appropriate target 3D shape array based on TargetShape name.
 */
export function generateTargetShape(shape: TargetShape | undefined, count: number): Float32Array {
  switch (shape) {
    case "pumpkin":
      return generatePumpkin(count);
    case "tree":
      return generateTree(count);
    case "snowflake":
      return generateSnowflake(count);
    case "leaf":
      return generateLeaf(count);
    case "flower":
      return generateFlower(count);
    case "sun":
      return generateSun(count);
    case "star":
      return generateStar(count);
    case "globe":
      return generateGlobe(count);
    case "clover":
      return generateClover(count);
    case "acorn":
      return generateAcorn(count);
    case "pi":
      return generatePi(count);
    case "chip":
      return generateChip(count);
    case "sakura":
      return generateSakura(count);
    case "crest":
      return generateCrest(count);
    case "africa":
      return generateAfrica(count);
    case "sombrero":
      return generateSombrero(count);
    case "freedom-star":
      return generateFreedomStar(count);
    case "lantern":
      return generateLantern(count);
    case "diya":
      return generateDiya(count);
    case "penguin":
      return generatePenguin(count);
    case "turkey":
      return generateTurkey(count);
    case "fireworks":
      return generateFireworks(count);
    case "sparkler":
      return generateSparkler(count);
    case "cube":
    default:
      return generateCube(count);
  }
}
