"use client";

import { useMemo } from "react";
import { buildQrSvg, type QrSvgOptions } from "@/lib/qr-svg";

type Props = QrSvgOptions & {
  data: string;
  className?: string;
};

/** Styled QR code rendered as inline SVG (client-side, zero network). */
export function QrCode({ data, className, ...options }: Props) {
  const svg = useMemo(() => {
    try {
      return buildQrSvg(data, options);
    } catch {
      return "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, options.color, options.bgColor, options.errorLevel, options.style, options.logoHref, options.size]);

  return (
    <div
      className={className}
      style={{ lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
