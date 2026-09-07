/**
 * Restored from HomePostList.astro and styles/liquid_glass.css at ad52106.
 * Keeps the original four layers and light/dark styles with smooth, deterministic refraction.
 * Mount on a decorative host with an explicit size; importing is SSR-safe.
 */
export interface LiquidGlassOptions {
  /** Distance from the edge to the midpoint of the fade, in CSS pixels. Default: 3. */
  edgeWidth?: number;
  /** Gaussian feather radius in CSS pixels. Default: 2. */
  edgeFeather?: number;
  /** Peak inward displacement in CSS pixels. Default: 12. */
  refraction?: number;
}

export interface LiquidGlassInstance {
  readonly element: HTMLDivElement;
  destroy(): void;
}

const styles = `
.liquid-glass3-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  pointer-events: none;
}
.liquid-glass3-wrapper {
  --liquid-glass3-border-radius: 1rem;
  position: relative;
  display: flex;
  overflow: hidden;

  border: 1px solid #00000020;
  background: linear-gradient(180deg, #ffffff10, #fafafa00);
  box-shadow:
    inset 0 2px 4px 0 #fff,
    inset 0 -4px 4px 0 hsla(0, 0%, 100%, 0.1),
    inset 0 -4px 16px 0 #fff,
    inset 0 4px 10px 0 hsla(240, 3%, 45%, 0.07),
    0 4px 14px -10px rgba(53, 53, 79, 0.4),
    0 11px 28px -10px rgba(53, 53, 79, 0.1);
  border-radius: var(--liquid-glass3-border-radius);
}

.liquid-glass3-outer {
  backdrop-filter: var(--liquid-glass3-filter);
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: var(--liquid-glass3-border-radius);

  -webkit-mask-image: var(--liquid-glass3-edge-mask);
  mask-image: var(--liquid-glass3-edge-mask);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.liquid-glass3-cover {
  -webkit-backdrop-filter: blur(0px);
  backdrop-filter: blur(0px);
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--liquid-glass3-border-radius);
  background: rgba(0, 0, 0, 0.01);
}

.liquid-glass3-sharp {
  position: absolute;
  inset: 0;
  z-index: 3;

  box-shadow:
    inset 1px 1px 0px 0px rgba(255, 255, 255, 0.5),
    inset -1px -1px 0px 0px rgba(255, 255, 255, 0.6);
  border-radius: var(--liquid-glass3-border-radius);
}

.liquid-glass3-reflect {
  position: absolute;
  inset: 1px;
  z-index: 2;

  
  
  
  border-radius: var(--liquid-glass3-border-radius);
}


.dark {
  
  .liquid-glass3-wrapper {
    --liquid-glass3-border-radius: 1rem;
    position: relative;
    display: flex;
    overflow: hidden;

    border: 1px solid #ffffff20;
    background: linear-gradient(180deg, #ffffff10, #fafafa00);
    box-shadow:
      inset 0 2px 4px 0 #00000040,
      inset 0 -4px 4px 0 hsla(0, 0%, 0%, 0.1),
      inset 0 -4px 16px 0 #00000060,
      inset 0 4px 10px 0 hsla(0, 0%, 13%, 0.07),
      0 4px 14px -10px rgba(112, 112, 167, 0.4),
      0 11px 28px -10px rgba(53, 53, 79, 0.1);
    border-radius: var(--liquid-glass3-border-radius);
  }

  .liquid-glass3-cover {
    -webkit-backdrop-filter: blur(0px);
    backdrop-filter: blur(0px);
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: var(--liquid-glass3-border-radius);
    background: rgba(0, 0, 0, 0.02);
  }

  .liquid-glass3-sharp {
    position: absolute;
    inset: 0;
    z-index: 3;
    box-shadow:
      inset 1px 1px 0px 0px rgba(255, 255, 255, 0.2),
      inset -1px -1px 0px 0px rgba(255, 255, 255, 0.3);
    border-radius: var(--liquid-glass3-border-radius);
  }

  .liquid-glass3-reflect {
    position: absolute;
    inset: 1px;
    z-index: 2;
    border-radius: var(--liquid-glass3-border-radius);
  }
}
`;

const filterMarkup = `<svg aria-hidden="true" focusable="false" width="0" height="0" style="position:absolute;pointer-events:none">
  <defs>
    <filter x="0%" y="0%" width="100%" height="100%" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feImage x="0" y="0" preserveAspectRatio="none" result="glass-displacement"></feImage>
      <feDisplacementMap in="SourceGraphic" in2="glass-displacement" scale="24" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
    </filter>
  </defs>
</svg>`;

const instances = new WeakMap<HTMLElement, LiquidGlassInstance>();
let nextId = 0;

/** Attach the original glass layers. Destroy removes only the generated nodes. */
export function createLiquidGlass(
  host: HTMLElement,
  options: LiquidGlassOptions = {},
): LiquidGlassInstance {
  const edgeWidth = options.edgeWidth ?? 3;
  const edgeFeather = options.edgeFeather ?? 2;
  const refraction = options.refraction ?? 12;
  if (
    ![edgeWidth, edgeFeather, refraction].every((value) => Number.isFinite(value) && value >= 0)
  ) {
    throw new RangeError(
      'Glass edge width, feather and refraction must be finite, non-negative numbers.',
    );
  }
  instances.get(host)?.destroy();
  const document = host.ownerDocument;
  let filterId: string;
  do {
    filterId = `liquid-glass3-filter-${++nextId}`;
  } while (document.getElementById(filterId));

  const element = document.createElement('div');
  element.className = 'liquid-glass3-wrapper';
  element.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--liquid-glass3-filter', `url(#${filterId})`);
  // Static markup only; the per-instance ID is assigned through the DOM API.
  const filterContainer = document.createElement('div');
  filterContainer.innerHTML = filterMarkup;
  const svg = filterContainer.firstElementChild!;
  svg.querySelector('filter')!.id = filterId;
  const displacementImage = svg.querySelector('feImage')!;
  const displacement = svg.querySelector('feDisplacementMap')!;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Liquid glass requires a 2D canvas context.');
  const style = document.createElement('style');
  style.textContent = styles;
  element.append(style);
  for (const layer of ['outer', 'cover', 'sharp', 'reflect']) {
    const child = document.createElement('div');
    child.className = `liquid-glass3-${layer}`;
    element.append(child);
  }
  // Keep the filter outside the clipped wrapper, as in the original component.
  host.append(svg, element);

  // Blur the mask, not the backdrop: the refracted layer fades into the clear center.
  const updateMask = () => {
    const width = element.clientWidth;
    const height = element.clientHeight;
    if (!width || !height) return;
    const view = document.defaultView!;
    const radiusValue = view.getComputedStyle(element).borderTopLeftRadius;
    const radius = Math.min(parseFloat(radiusValue) || 0, width / 2, height / 2);
    // The signed distance gradient points outward from a rounded rectangle.
    // Sample inward instead, so the rim never pulls transparent pixels across its edge.
    canvas.width = width;
    canvas.height = height;
    const pixels = context.createImageData(width, height);
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const band = Math.max(
      1,
      Math.min(edgeWidth + edgeFeather * 3, radius || 8, halfWidth, halfHeight),
    );
    const strength = Math.min(refraction, halfWidth / 2, halfHeight / 2);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px = x + 0.5 - halfWidth;
        const py = y + 0.5 - halfHeight;
        const qx = Math.abs(px) - (halfWidth - radius);
        const qy = Math.abs(py) - (halfHeight - radius);
        const ox = Math.max(qx, 0);
        const oy = Math.max(qy, 0);
        const cornerDistance = Math.hypot(ox, oy);
        const distance = cornerDistance + Math.min(Math.max(qx, qy), 0) - radius;
        let nx = 0;
        let ny = 0;
        if (cornerDistance > 0) {
          nx = (ox / cornerDistance) * Math.sign(px);
          ny = (oy / cornerDistance) * Math.sign(py);
        } else if (qx > qy) nx = Math.sign(px);
        else ny = Math.sign(py);
        const t = Math.max(0, Math.min(1, -distance / band));
        const fade = 1 - t * t * (3 - 2 * t);
        const index = (y * width + x) * 4;
        pixels.data[index] = Math.round((0.5 - nx * fade * 0.5) * 255);
        pixels.data[index + 1] = Math.round((0.5 - ny * fade * 0.5) * 255);
        pixels.data[index + 2] = 128;
        pixels.data[index + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    displacementImage.setAttribute('width', String(width));
    displacementImage.setAttribute('height', String(height));
    displacementImage.setAttribute('href', canvas.toDataURL());
    displacement.setAttribute('scale', String(strength * 2));

    const inset = Math.min(edgeWidth, width / 2, height / 2);
    const innerWidth = Math.max(0, width - inset * 2);
    const innerHeight = Math.max(0, height - inset * 2);
    const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <filter id="feather" x="-100%" y="-100%" width="300%" height="300%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${edgeFeather}"/></filter>
        <mask id="edge" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:luminance">
          <rect width="${width}" height="${height}" fill="white"/>
          <rect x="${inset}" y="${inset}" width="${innerWidth}" height="${innerHeight}" rx="${Math.max(0, radius - inset)}" fill="black" filter="url(#feather)"/>
        </mask>
      </defs>
      <rect width="${width}" height="${height}" fill="white" mask="url(#edge)"/>
    </svg>`;
    element.style.setProperty(
      '--liquid-glass3-edge-mask',
      `url("data:image/svg+xml,${encodeURIComponent(mask)}")`,
    );
  };
  const observer = new document.defaultView!.ResizeObserver(updateMask);
  observer.observe(element);
  updateMask();

  let destroyed = false;
  const instance: LiquidGlassInstance = {
    element,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      observer.disconnect();
      element.remove();
      svg.remove();
      instances.delete(host);
    },
  };
  instances.set(host, instance);
  return instance;
}

export default createLiquidGlass;
