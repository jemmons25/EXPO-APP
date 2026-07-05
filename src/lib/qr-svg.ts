import QRCode from "qrcode";
import type { QrDotStyle, QrErrorLevel } from "@/lib/card-types";

export type QrSvgOptions = {
  color?: string;
  bgColor?: string; // "transparent" or a CSS color
  errorLevel?: QrErrorLevel;
  style?: QrDotStyle;
  size?: number;
  /** URL or data-URI of a logo to embed in the center. */
  logoHref?: string | null;
  margin?: number; // in modules
};

type Matrix = { size: number; get: (r: number, c: number) => boolean };

function isFinderModule(r: number, c: number, size: number): boolean {
  const inTL = r < 7 && c < 7;
  const inTR = r < 7 && c >= size - 7;
  const inBL = r >= size - 7 && c < 7;
  return inTL || inTR || inBL;
}

function finderPath(x: number, y: number, style: QrDotStyle): string {
  // Outer 7x7 ring (stroke-free: outer shape minus inner hole) + 3x3 center.
  const r = style === "square" ? 0 : style === "rounded" ? 1.8 : 2.8;
  const ri = style === "square" ? 0 : style === "rounded" ? 1 : 1.6;
  const rc = style === "square" ? 0 : style === "rounded" ? 0.8 : 1.5;
  const rect = (px: number, py: number, w: number, h: number, rad: number) =>
    `M${px + rad},${py} h${w - 2 * rad} a${rad},${rad} 0 0 1 ${rad},${rad} v${h - 2 * rad} a${rad},${rad} 0 0 1 -${rad},${rad} h-${w - 2 * rad} a${rad},${rad} 0 0 1 -${rad},-${rad} v-${h - 2 * rad} a${rad},${rad} 0 0 1 ${rad},-${rad} z`;
  const outer = rect(x, y, 7, 7, r);
  const hole = rect(x + 1, y + 1, 5, 5, ri);
  const center = rect(x + 2, y + 2, 3, 3, rc);
  return `${outer} ${hole} ${center}`;
}

function buildModulesPath(m: Matrix, style: QrDotStyle): string {
  const parts: string[] = [];
  for (let r = 0; r < m.size; r++) {
    for (let c = 0; c < m.size; c++) {
      if (!m.get(r, c) || isFinderModule(r, c, m.size)) continue;
      if (style === "dots") {
        // Radius 0.53 slightly overlaps adjacent dots so scanners read
        // module runs reliably (verified with jsQR at all error levels).
        parts.push(`M${c + 0.5},${r - 0.03} a0.53,0.53 0 1 0 0,1.06 a0.53,0.53 0 1 0 0,-1.06 z`);
      } else if (style === "rounded") {
        const rad = 0.3;
        parts.push(
          `M${c + rad},${r} h${1 - 2 * rad} a${rad},${rad} 0 0 1 ${rad},${rad} v${1 - 2 * rad} a${rad},${rad} 0 0 1 -${rad},${rad} h-${1 - 2 * rad} a${rad},${rad} 0 0 1 -${rad},-${rad} v-${1 - 2 * rad} a${rad},${rad} 0 0 1 ${rad},-${rad} z`
        );
      } else {
        parts.push(`M${c},${r} h1 v1 h-1 z`);
      }
    }
  }
  return parts.join(" ");
}

/**
 * Build a styled QR code as an SVG string. Works on both server and client.
 */
export function buildQrSvg(data: string, opts: QrSvgOptions = {}): string {
  const {
    color = "#000000",
    bgColor = "transparent",
    errorLevel = "M",
    style = "square",
    size = 512,
    logoHref = null,
    margin = 2,
  } = opts;

  const qr = QRCode.create(data, { errorCorrectionLevel: errorLevel });
  const n = qr.modules.size;
  const raw = qr.modules.data as unknown as Uint8Array;
  const matrix: Matrix = { size: n, get: (r, c) => raw[r * n + c] === 1 };

  const total = n + margin * 2;
  const bgRect =
    bgColor && bgColor !== "transparent"
      ? `<rect width="${total}" height="${total}" fill="${bgColor}"/>`
      : "";

  // Center logo: clear a quiet zone and place the image (~5 modules on each side of center).
  let logoMarkup = "";
  let logoClear = "";
  if (logoHref) {
    const logoModules = Math.floor(n * 0.24);
    const start = margin + (n - logoModules) / 2;
    const pad = 0.6;
    logoClear = `<rect x="${start - pad}" y="${start - pad}" width="${logoModules + pad * 2}" height="${logoModules + pad * 2}" rx="${logoModules * 0.2}" fill="${bgColor !== "transparent" ? bgColor : "#ffffff"}"/>`;
    logoMarkup = `<image href="${logoHref}" x="${start}" y="${start}" width="${logoModules}" height="${logoModules}" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round ${logoModules * 0.18}px)"/>`;
  }

  const modulesPath = buildModulesPath(matrix, style);
  const finders = [
    finderPath(margin, margin, style),
    finderPath(margin + n - 7, margin, style),
    finderPath(margin, margin + n - 7, style),
  ].join(" ");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${size}" height="${size}" shape-rendering="geometricPrecision">
${bgRect}
<g transform="translate(${margin},${margin})"><path d="${modulesPath}" fill="${color}"/></g>
<path d="${finders}" fill="${color}" fill-rule="evenodd"/>
${logoClear}${logoMarkup}
</svg>`;
}
