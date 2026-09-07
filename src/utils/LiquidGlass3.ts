/** Decorative liquid glass, with no framework or runtime dependencies.
 * Refraction adapted from https://codepen.io/daftplug/pen/QwbaYGO
 * The host supplies dimensions and border-radius; put content above the effect.
 * A `.dark` ancestor selects the dark appearance.
 */
export interface LiquidGlassOptions {
  /** Displacement in pixels. Defaults to 24; 0 disables refraction. */
  refraction?: number;
}

export interface LiquidGlassInstance {
  readonly element: HTMLDivElement;
  setRefraction(value: number): void;
  destroy(): void;
}

const styles = `
  .liquid-glass-effect-filter {
    position: absolute;
    pointer-events: none;
  }

  /* Separate the refracted backdrop from the crisp rim and the readable post text. */
  .liquid-glass-effect {
    position: relative;
    pointer-events: none;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    overflow: hidden;
    background: rgb(125 135 150 / 5%);
    box-shadow: 0 3px 12px -6px rgb(20 30 45 / 18%);
  }

  .liquid-glass-effect::before,
  .liquid-glass-effect::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
  }

  .liquid-glass-effect::before {
    -webkit-backdrop-filter: blur(2px) saturate(1.15);
    backdrop-filter: blur(2px) saturate(1.15);
    filter: var(--glass-filter);
  }

  .liquid-glass-effect::after {
    background: linear-gradient(145deg, rgb(255 255 255 / 12%), transparent 55%);
    box-shadow:
      inset 2px 2px 0 -2px rgb(255 255 255 / 70%),
      inset 0 0 3px 1px rgb(255 255 255 / 70%),
      inset 0 -1px 1px rgb(35 45 60 / 12%);
  }

  .dark .liquid-glass-effect {
    background: rgb(255 255 255 / 5%);
    box-shadow: 0 3px 12px -6px rgb(0 0 0 / 35%);
  }

  .dark .liquid-glass-effect::after {
    box-shadow:
      inset 2px 2px 0 -2px rgb(255 255 255 / 45%),
      inset 0 0 3px 1px rgb(255 255 255 / 22%),
      inset 0 -1px 1px rgb(255 255 255 / 10%);
  }
`;
const filterMarkup = `<svg class="liquid-glass-effect-filter" aria-hidden="true" focusable="false" width="0" height="0">
  <defs>
    <filter  x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.008 0.008"
        numOctaves="2"
        seed="92"
        result="noise"></feTurbulence>
      <feGaussianBlur in="noise" stdDeviation="0.02" result="refraction"></feGaussianBlur>
      <feDisplacementMap
        in="SourceGraphic"
        in2="refraction"
        scale="24"
        xChannelSelector="R"
        yChannelSelector="G"></feDisplacementMap>
    </filter>
  </defs>
</svg>`;
let nextId = 0;

function validateRefraction(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('LiquidGlass refraction must be a finite, non-negative number.');
  }
  return value;
}

/** Call in the browser after mounting the host. Importing this module is SSR-safe. */
export function createLiquidGlass(
  host: HTMLElement,
  options: LiquidGlassOptions = {},
): LiquidGlassInstance {
  const refraction = validateRefraction(options.refraction ?? 24);
  const document = host.ownerDocument;
  let filterId: string;
  do {
    filterId = `liquid-glass-filter-${++nextId}`;
  } while (document.getElementById(filterId));

  const element = document.createElement('div');
  element.className = 'liquid-glass-effect';
  element.setAttribute('aria-hidden', 'true');
  element.style.setProperty('--glass-filter', `url(#${filterId})`);
  // Only static markup is parsed; caller-provided values use DOM attributes.
  element.innerHTML = filterMarkup;
  element.querySelector('filter')!.id = filterId;
  const displacement = element.querySelector('feDisplacementMap')!;
  displacement.setAttribute('scale', String(refraction));
  const style = document.createElement('style');
  style.textContent = styles;
  element.append(style);
  host.append(element);

  return {
    element,
    setRefraction(value) {
      displacement.setAttribute('scale', String(validateRefraction(value)));
    },
    destroy() {
      element.remove();
    },
  };
}
