import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const brandDir = path.join(projectRoot, "public", "brand");
const appDir = path.join(projectRoot, "src", "app");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">
  <defs>
    <radialGradient id="aura" cx="50%" cy="50%" r="58%">
      <stop offset="0%" stop-color="#9B8BFF" stop-opacity="0.94" />
      <stop offset="42%" stop-color="#FF77B6" stop-opacity="0.44" />
      <stop offset="76%" stop-color="#67B9FF" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#67B9FF" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="core" x1="72" x2="184" y1="48" y2="208" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#BBA8FF" />
      <stop offset="45%" stop-color="#FF7AB7" />
      <stop offset="100%" stop-color="#7EC6FF" />
    </linearGradient>
    <linearGradient id="facet" x1="88" x2="160" y1="70" y2="190" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.38" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="ringPrimary" x1="18" x2="236" y1="76" y2="176" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#7D6EFF" stop-opacity="0.2" />
      <stop offset="26%" stop-color="#B995FF" stop-opacity="0.88" />
      <stop offset="58%" stop-color="#FF7AB7" stop-opacity="0.96" />
      <stop offset="100%" stop-color="#6EBEFF" stop-opacity="0.28" />
    </linearGradient>
    <linearGradient id="ringSecondary" x1="34" x2="224" y1="28" y2="232" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6EBEFF" stop-opacity="0.22" />
      <stop offset="34%" stop-color="#B59CFF" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#FF8ABF" stop-opacity="0.88" />
      <stop offset="100%" stop-color="#6EBEFF" stop-opacity="0.3" />
    </linearGradient>
    <linearGradient id="shimmer" x1="76" x2="170" y1="70" y2="166" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.92" />
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
    </linearGradient>
    <path id="glyph" d="M66 54H99L128 90L157 54H190L141 117V202H115V117L66 54Z" />
    <clipPath id="clip">
      <use href="#glyph" />
    </clipPath>
  </defs>

  <g opacity="0.58">
    <circle cx="128" cy="128" r="94" fill="url(#aura)" />
    <ellipse cx="128" cy="128" rx="78" ry="58" fill="url(#aura)" />
  </g>

  <g opacity="0.9">
    <ellipse
      cx="128"
      cy="128"
      rx="100"
      ry="58"
      transform="rotate(-18 128 128)"
      stroke="url(#ringPrimary)"
      stroke-width="6"
      stroke-linecap="round"
      stroke-dasharray="164 84"
    />
    <ellipse
      cx="128"
      cy="128"
      rx="100"
      ry="58"
      transform="rotate(-18 128 128)"
      stroke="#F7F8FF"
      stroke-opacity="0.28"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="14 18"
    />
    <ellipse
      cx="128"
      cy="128"
      rx="74"
      ry="104"
      transform="rotate(28 128 128)"
      stroke="url(#ringSecondary)"
      stroke-width="5"
      stroke-linecap="round"
      stroke-dasharray="142 96"
    />
    <ellipse
      cx="128"
      cy="128"
      rx="74"
      ry="104"
      transform="rotate(28 128 128)"
      stroke="#F7F8FF"
      stroke-opacity="0.22"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-dasharray="16 16"
      opacity="0.24"
    />
    <circle cx="210" cy="96" r="4.5" fill="#FFD6EB" opacity="0.72" />
    <circle cx="49" cy="158" r="3.5" fill="#8BCBFF" opacity="0.7" />
    <circle cx="175" cy="32" r="3.5" fill="#AFA2FF" opacity="0.7" />
    <circle cx="84" cy="218" r="4" fill="#FF9AC5" opacity="0.72" />
  </g>

  <use
    href="#glyph"
    fill="url(#core)"
    stroke="#FFFFFF"
    stroke-opacity="0.22"
    stroke-width="1.4"
    stroke-linejoin="round"
  />
  <path
    d="M94 66H108L128 91L148 66H162L135 104V188H121V104L94 66Z"
    fill="url(#facet)"
    opacity="0.56"
  />
  <path
    d="M83 63H98L128 100L158 63H173"
    stroke="#FFFFFF"
    stroke-opacity="0.42"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
    opacity="0.68"
  />
  <path
    d="M128 100V193"
    stroke="#FFFFFF"
    stroke-opacity="0.34"
    stroke-width="3"
    stroke-linecap="round"
    opacity="0.34"
  />
  <g clip-path="url(#clip)" opacity="0.22">
    <rect
      x="108"
      y="24"
      width="42"
      height="210"
      fill="url(#shimmer)"
      transform="rotate(18 128 128)"
    />
  </g>
</svg>
`;

const rasterTargets = [
  { size: 32, output: path.join(brandDir, "yotei-icon-32.png") },
  { size: 64, output: path.join(brandDir, "yotei-icon-64.png") },
  { size: 180, output: path.join(brandDir, "yotei-icon-180.png") },
  { size: 192, output: path.join(brandDir, "yotei-icon-192.png") },
  { size: 512, output: path.join(brandDir, "yotei-icon-512.png") },
  { size: 180, output: path.join(appDir, "apple-icon.png") },
  { size: 512, output: path.join(appDir, "icon.png") },
];

function createIco(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(64, 0);
  entry.writeUInt8(64, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12);

  return Buffer.concat([header, entry, pngBuffer]);
}

await fs.mkdir(brandDir, { recursive: true });
await fs.mkdir(appDir, { recursive: true });
await fs.writeFile(path.join(brandDir, "yotei-orbital-mark.svg"), svg, "utf8");

for (const target of rasterTargets) {
  await sharp(Buffer.from(svg))
    .resize(target.size, target.size)
    .png()
    .toFile(target.output);
}

const faviconPng = await sharp(Buffer.from(svg)).resize(64, 64).png().toBuffer();
await fs.writeFile(path.join(appDir, "favicon.ico"), createIco(faviconPng));
