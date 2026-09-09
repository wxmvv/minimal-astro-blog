import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// Ported from components/Motion.tsx and layouts/ListLayoutWithTags.tsx in the Next.js site.
const blurEase = CustomEase.create('page-blur', '0.25,0.3,0.5,1');
const tweenEase = CustomEase.create('page-tween', '0.42,0,0.58,1');
const listEase = CustomEase.create('page-list', '0.25,0.1,0.25,1');
const hidden = { opacity: 0, y: 16, filter: 'blur(8px)' };
const clearProps = 'opacity,transform,filter,willChange';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let animation: gsap.core.Timeline | undefined;
let upperAnimation: gsap.core.Timeline | undefined;
let indicatorAnimation: gsap.core.Tween | undefined;
const preparedUpper = new WeakSet<HTMLElement>();
let preparedRoot: HTMLElement | null = null;
let previousIndicator: { left: number; width: number } | undefined;
let pendingNavigation: URL | undefined;
let exitAnimation: { root: HTMLElement; finished: Promise<void> } | undefined;

// Capture clicks before ClientRouter can abort an in-flight navigation.
document.addEventListener(
  'click',
  (event) => {
    if (!(event.target instanceof Element)) return;
    const tab = event.target.closest<HTMLAnchorElement>('a[data-nav-tab]');
    if (!tab) return;
    if (tab.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (tab.target && tab.target !== '_self')
    )
      return;
    if (tab.href === pendingNavigation?.href) event.preventDefault();
  },
  true,
);

const getRoot = () => document.querySelector<HTMLElement>('#main-container');
const getItems = (root: HTMLElement) => [
  ...root.querySelectorAll<HTMLElement>('[data-motion-item]'),
];
const getContainer = (root: HTMLElement) =>
  root.dataset.motionScope === 'tab' ? (root.querySelector<HTMLElement>('main') ?? root) : root;

function restore(root: HTMLElement) {
  const container = getContainer(root);
  gsap.set([root, container, ...getItems(container)], { clearProps });
  document.documentElement.dataset.pageMotion = 'idle';
  document.dispatchEvent(new Event('site:motion-complete'));
}

function prepare() {
  exitAnimation = undefined;
  animation?.kill();
  preparedRoot = getRoot();
  if (!preparedRoot) return;
  if (preparedRoot.querySelector('[data-site-title]')) {
    preparedRoot.dataset.motionScope = 'tab';
    const upper = [...preparedRoot.querySelectorAll<HTMLElement>('[data-site-title], nav')];
    if (upper.some((item) => !preparedUpper.has(item))) {
      upperAnimation?.kill();
      upper.forEach((item) => preparedUpper.add(item));
      if (!reducedMotion.matches) {
        gsap.set(upper, hidden);
        upperAnimation = gsap.timeline({
          onComplete: () => gsap.set(upper, { clearProps }),
        });
        upper.forEach((item, index) => {
          upperAnimation!.to(
            item,
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: blurEase },
            0.1 + index * 0.18,
          );
        });
      }
    }
  }
  if (reducedMotion.matches) {
    restore(preparedRoot);
    return;
  }
  const container = getContainer(preparedRoot);
  gsap.set(container, { ...hidden, willChange: 'opacity,transform,filter' });
  if (preparedRoot.dataset.motionProfile !== 'list') {
    gsap.set(getItems(container), hidden);
  }
  document.documentElement.dataset.pageMotion = 'entering';
}

function enter() {
  const root = getRoot();
  if (!root) {
    pendingNavigation = undefined;
    return;
  }
  // The startup timeout already revealed this page. A late bundle must not hide it again.
  // Client-side navigations still animate: after-swap prepares their root before enter().
  if (root !== preparedRoot && document.documentElement.dataset.pageMotion === 'idle') {
    preparedRoot = root;
    root.querySelectorAll<HTMLElement>('[data-site-title], nav').forEach((item) => {
      preparedUpper.add(item);
    });
    restore(root);
    return;
  }
  if (root !== preparedRoot) prepare();
  if (reducedMotion.matches) {
    pendingNavigation = undefined;
    restore(root);
    previousIndicator = undefined;
    return;
  }
  animation?.kill();
  const container = getContainer(root);
  const timeline = gsap.timeline({
    onComplete: () => {
      restore(root);
    },
  });
  animation = timeline;
  if (root.dataset.motionProfile === 'list') {
    timeline.to(
      container,
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: listEase },
      0,
    );
  } else {
    timeline
      .to(container, { y: 0, duration: 0.4, ease: tweenEase }, 0)
      .to(container, { opacity: 1, duration: 0.7, ease: tweenEase }, 0)
      .to(container, { filter: 'blur(0px)', duration: 1, ease: blurEase }, 0);
    getItems(container).forEach((item, index) => {
      const start = 0.1 + index * 0.18;
      timeline
        .to(item, { y: 0, duration: 0.2, ease: tweenEase }, start)
        .to(item, { opacity: 1, duration: 0.4, ease: tweenEase }, start)
        .to(item, { filter: 'blur(0px)', duration: 0.4, ease: blurEase }, start);
    });
  }
}

function moveIndicator() {
  indicatorAnimation?.kill();
  const indicator = document.querySelector<HTMLElement>('[data-nav-indicator]');
  const previous = previousIndicator;
  previousIndicator = undefined;
  if (!indicator || !previous || reducedMotion.matches) return;
  const rect = indicator.getBoundingClientRect();
  // Position before the first paint of the new DOM, independently of content animation.
  gsap.set(indicator, {
    x: previous.left - rect.left,
    scaleX: previous.width / rect.width,
    transformOrigin: 'left center',
  });
  indicatorAnimation = gsap.to(indicator, {
    x: 0,
    scaleX: 1,
    duration: 0.4,
    ease: blurEase,
    onComplete: () => gsap.set(indicator, { clearProps: 'transform,transformOrigin' }),
  });
}

function exit(signal: AbortSignal): Promise<void> {
  const root = getRoot();
  if (!root || signal.aborted || reducedMotion.matches) return Promise.resolve();
  // A newer destination shares the outgoing animation, even if it has already finished.
  if (exitAnimation?.root === root) return exitAnimation.finished;
  animation?.kill();
  const container = getContainer(root);
  document.documentElement.dataset.pageMotion = 'exiting';
  document.dispatchEvent(new Event('site:motion-start'));

  const finished = new Promise<void>((resolve) => {
    const finish = () => resolve();
    const timeline = gsap.timeline({ onComplete: finish, onInterrupt: finish });
    animation = timeline;
    // The reference has no exit variant; reverse its item transition before the DOM swap.
    timeline
      .to(container, { y: 16, duration: 0.2, ease: tweenEase }, 0)
      .to(container, { opacity: 0, duration: 0.4, ease: tweenEase }, 0)
      .to(container, { filter: 'blur(8px)', duration: 0.4, ease: blurEase }, 0);
  });
  exitAnimation = { root, finished };
  return finished;
}

document.addEventListener('astro:before-preparation', (event) => {
  pendingNavigation = event.to;
  const clearPending = () => {
    if (pendingNavigation === event.to) pendingNavigation = undefined;
  };
  event.signal.addEventListener('abort', clearPending, { once: true });
  const load = event.loader;
  event.loader = async () => {
    // Keep the current page visible during network waits and failed/non-HTML navigations.
    try {
      await load();
    } catch (error) {
      clearPending();
      if (!event.signal.aborted) {
        exitAnimation = undefined;
        enter();
      }
      throw error;
    }
    if (event.defaultPrevented || event.signal.aborted) {
      clearPending();
      if (!event.signal.aborted) {
        exitAnimation = undefined;
        enter();
      }
      return;
    }
    const root = getRoot();
    const nextRoot = event.newDocument.querySelector<HTMLElement>('#main-container');
    if (root && nextRoot) {
      // Top-level tabs share a title and navigation. Only their main content transitions.
      const scope =
        root.querySelector('[data-site-title]') && nextRoot.querySelector('[data-site-title]')
          ? 'tab'
          : 'page';
      root.dataset.motionScope = nextRoot.dataset.motionScope = scope;
    }
    await exit(event.signal);
  };
});

document.addEventListener('astro:before-swap', (event) => {
  const rect = document.querySelector('[data-nav-indicator]')?.getBoundingClientRect();
  previousIndicator = rect ? { left: rect.left, width: rect.width } : undefined;
  indicatorAnimation?.kill();
  const root = getRoot();
  const nextRoot = event.newDocument.querySelector<HTMLElement>('#main-container');
  if (root?.querySelector('[data-site-title]') && nextRoot?.querySelector('[data-site-title]')) {
    // Keep the actual animated nodes alive while Astro replaces the page body.
    for (const selector of ['[data-site-title]', 'nav']) {
      const current = root.querySelector<HTMLElement>(selector);
      const next = nextRoot.querySelector<HTMLElement>(selector);
      if (!current || !next) continue;
      current.setAttribute('data-astro-transition-persist', selector);
      next.setAttribute('data-astro-transition-persist', selector);
      // The navigation shell persists, but its links must reflect the new current tab.
      if (selector === 'nav') current.replaceChildren(...next.childNodes);
    }
  }
  // Skipping our own native snapshot transition intentionally rejects its ready promise.
  void event.viewTransition.ready.catch(() => {});
  event.viewTransition.skipTransition();
});

document.addEventListener('astro:after-swap', () => {
  pendingNavigation = undefined;
  prepare();
  moveIndicator();
});
document.addEventListener('astro:page-load', enter);

reducedMotion.addEventListener('change', () => {
  if (!reducedMotion.matches) return;
  // Complete, rather than kill, so a pending navigation is never left waiting.
  animation?.progress(1);
  upperAnimation?.progress(1);
  indicatorAnimation?.progress(1);
  const root = getRoot();
  if (root) restore(root);
});

window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  pendingNavigation = undefined;
  animation?.kill();
  upperAnimation?.progress(1);
  indicatorAnimation?.progress(1);
  const root = getRoot();
  if (root) restore(root);
});
