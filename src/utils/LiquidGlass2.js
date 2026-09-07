// Vanilla JS Liquid Glass，折射算法源自 Shu Ding（https://github.com/shuding/liquid-glass）

// 插值函数，用于平滑位移动画
function smoothStep(a, b, t) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// 二维向量长度
function length(x, y) {
  return Math.sqrt(x * x + y * y);
}

// SDF（Signed Distance Function）计算圆角矩形形状
function roundedRectSDF(x, y, width, height, radius) {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}

// 构造纹理位移目标
function texture(x, y) {
  return { type: 't', x, y };
}

// 生成唯一 ID，用于 SVG Filter 命名
function generateId() {
  return 'liquid-glass-' + Math.random().toString(36).substr(2, 9);
}

// Shader 主类
class Shader {
  constructor(element, options = {}) {
    this.element = element;
    this.document = element.ownerDocument;
    this.window = this.document.defaultView;
    this.width = 0;
    this.height = 0;
    this.fragment =
      options.fragment ??
      ((uv) => {
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        const distanceToEdge = roundedRectSDF(ix, iy, 0.2, 0.3, 0);
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        return texture(ix * scaled + 0.5, iy * scaled + 0.5);
      });
    this.canvasDPI = 1;
    this.id = generateId();
    this.mouse = { x: 0, y: 0 };
    this.mouseUsed = false;
    this.destroyed = false;
    this.originalStyles = ['backdrop-filter', '-webkit-backdrop-filter', 'box-shadow'].map(
      (property) => [
        property,
        element.style.getPropertyValue(property),
        element.style.getPropertyPriority(property),
      ],
    );
    this.createElement();
    this.document.documentElement.append(this.svg);
    const backdrop = `url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`;
    element.style.setProperty('backdrop-filter', backdrop);
    element.style.setProperty('-webkit-backdrop-filter', backdrop);
    element.style.setProperty(
      'box-shadow',
      '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)',
    );
    this.onPointerMove = (event) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      this.mouse.x = (event.clientX - rect.left) / rect.width;
      this.mouse.y = (event.clientY - rect.top) / rect.height;
      if (this.mouseUsed) this.updateShader();
    };
    element.addEventListener('pointermove', this.onPointerMove);
    this.observer = new this.window.ResizeObserver(() => this.refresh());
    this.observer.observe(element, { box: 'border-box' });
    this.refresh();
  }

  createElement() {
    const document = this.document;
    // SVG 滤镜容器
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.setAttribute('aria-hidden', 'true');
    this.svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9998;
    `;

    // SVG filter
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', `${this.id}_filter`);

    // feImage：使用 canvas 的像素图作为位移源
    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feImage.setAttribute('result', `${this.id}_map`);
    this.feImage.setAttribute('width', this.width.toString());
    this.feImage.setAttribute('height', this.height.toString());

    // feDisplacementMap：SVG 的核心位移滤镜
    this.feDisplacementMap = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'feDisplacementMap',
    );
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

    filter.appendChild(this.feImage);
    filter.appendChild(this.feDisplacementMap);
    defs.appendChild(filter);
    this.svg.appendChild(defs);

    // 隐藏 canvas，用作 feImage 的位图输入
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width * this.canvasDPI;
    this.canvas.height = this.height * this.canvasDPI;
    this.canvas.style.display = 'none';

    this.context = this.canvas.getContext('2d');
  }

  // 使用布局尺寸，避免 CSS transform 改变纹理比例。
  refresh() {
    if (this.destroyed) return;
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    if (!width || !height || (width === this.width && height === this.height)) return;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.feImage.setAttribute('width', String(width));
    this.feImage.setAttribute('height', String(height));
    this.updateShader();
  }

  // 每次更新 shader（用于重新生成 displacement 图像）
  updateShader() {
    if (this.destroyed || !this.width || !this.height) return;
    const mouseProxy = new Proxy(this.mouse, {
      get: (target, prop) => {
        this.mouseUsed = true;
        return target[prop];
      },
    });

    this.mouseUsed = false;
    const w = this.width * this.canvasDPI;
    const h = this.height * this.canvasDPI;
    const data = new Uint8ClampedArray(w * h * 4);
    const rawValues = [];
    let maxScale = 0;

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment({ x: x / w, y: y / h }, mouseProxy);
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / (maxScale || 1) + 0.5;
      const g = rawValues[index++] / (maxScale || 1) + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    this.context.putImageData(new this.window.ImageData(data, w, h), 0, 0);
    this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
    this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.observer.disconnect();
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.svg.remove();
    for (const [property, value, priority] of this.originalStyles) {
      if (value) this.element.style.setProperty(property, value, priority);
      else this.element.style.removeProperty(property);
    }
    instances.delete(this.element);
  }
}

const instances = new WeakMap();

/**
 * 为已有元素附加液态玻璃效果；尺寸、圆角和定位由元素自身的 CSS 控制。
 * 在浏览器中挂载元素后调用，导入模块不会创建 DOM。
 * @param {HTMLElement} element
 * @param {{ fragment?: (uv: {x: number, y: number}, mouse: {x: number, y: number}) => {x: number, y: number} }} [options]
 * @returns {{ element: HTMLElement, refresh: () => void, destroy: () => void }}
 */
export function createLiquidGlass(element, options = {}) {
  const HTMLElement = element?.ownerDocument?.defaultView?.HTMLElement;
  if (!HTMLElement || !(element instanceof HTMLElement)) {
    throw new TypeError('createLiquidGlass requires an HTMLElement.');
  }
  instances.get(element)?.destroy();
  const instance = new Shader(element, options);
  instances.set(element, instance);
  return instance;
}

export default createLiquidGlass;
