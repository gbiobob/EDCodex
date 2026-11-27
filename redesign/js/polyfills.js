/**
 * Progressive enhancement & feature-detected polyfills per Modern Web Guidance.
 * Conditional imports load ONLY when native platform APIs are absent.
 */

export function loadPlatformPolyfills() {
  if (!('commandForElement' in HTMLButtonElement.prototype)) {
    import('https://esm.run/invokers-polyfill').catch(() => {});
  }

  if (!Object.hasOwn(HTMLElement.prototype, 'popover')) {
    import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js').catch(() => {});
  }

  if (!('interestForElement' in HTMLButtonElement.prototype)) {
    import('https://unpkg.com/interestfor@latest').catch(() => {});
  }
}

export function initDialogClosedByFallback() {
  if ('closedBy' in HTMLDialogElement.prototype) return;

  const isOutside = (event, dialog) => {
    const rect = dialog.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };

  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (e) => {
      pressedOutside = isOutside(e, dialog);
    });
    dialog.addEventListener('pointerup', (e) => {
      if (pressedOutside && isOutside(e, dialog)) {
        dialog.close();
      }
    });
  }
}

export function initHintPopoverFallback() {
  const probe = document.createElement('div');
  probe.popover = 'hint';
  if (probe.popover === 'hint') return;

  document.addEventListener(
    'beforetoggle',
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const isToggletip =
        target.getAttribute('popover') === 'hint' &&
        target.id &&
        document.querySelector(`[popovertarget="${CSS.escape(target.id)}"]`);
      if (event.newState === 'open' && isToggletip) {
        target.setAttribute('popover', 'auto');
      }
    },
    true
  );
}

export function initAnchorPositionFallback() {
  if (CSS.supports('position-area: bottom')) return;

  document.addEventListener(
    'beforetoggle',
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement) || event.newState !== 'open') return;
      if (!target.classList.contains('anchored-overlay') && target.getAttribute('popover') !== 'hint') {
        return;
      }
      const id = target.id;
      if (!id) return;
      const trigger =
        document.querySelector(`[popovertarget="${CSS.escape(id)}"]`) ||
        document.querySelector(`[interestfor="${CSS.escape(id)}"]`);
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      target.style.position = 'fixed';
      target.style.inset = 'auto';
      target.style.margin = '0';
      target.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - 120)}px`;
      target.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - 240))}px`;
    },
    true
  );
}

export function initScrollHeaderFallback() {
  if (CSS.supports('container-type', 'scroll-state')) return;
  const bar = document.querySelector('.top-bar');
  if (!bar) return;

  let lastY = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const y = Math.max(0, Math.min(window.scrollY, maxY));
      if (y === lastY) return;
      bar.classList.toggle('is-hidden', y > lastY && y > bar.offsetHeight);
      lastY = y;
    },
    { passive: true }
  );
}

/**
 * Upfront ARIA wiring for [interestfor] + popover="hint" per interest-triggered-tooltips guide.
 */
const ownedInterestTriggers = new Set();
let toggleSyncBound = false;

export function wireHintPopovers(root = document) {
  for (const trigger of root.querySelectorAll('[interestfor]')) {
    const targetId = trigger.getAttribute('interestfor');
    if (!targetId) continue;
    const hint = document.getElementById(targetId);
    if (!hint || hint.getAttribute('popover') !== 'hint') continue;

    const hintText = hint.textContent.replace(/\s+/g, ' ').trim();
    const triggerLabel = (
      trigger.getAttribute('aria-label') ||
      trigger.textContent ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim();

    if (hintText && hintText === triggerLabel) {
      continue;
    }

    if (!hint.hasAttribute('role')) {
      hint.setAttribute('role', 'tooltip');
    }

    if (!triggerLabel && !trigger.hasAttribute('aria-labelledby')) {
      trigger.setAttribute('aria-labelledby', targetId);
    } else if (
      trigger.getAttribute('popovertarget') === targetId ||
      trigger.getAttribute('commandfor') === targetId
    ) {
      if (!trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', String(hint.matches(':popover-open')));
        ownedInterestTriggers.add(trigger);
      }
    } else if (!trigger.hasAttribute('aria-describedby')) {
      trigger.setAttribute('aria-describedby', targetId);
    }
  }

  if (!toggleSyncBound) {
    toggleSyncBound = true;
    document.addEventListener(
      'toggle',
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement) || target.getAttribute('popover') !== 'hint' || !target.id) {
          return;
        }
        const isOpen = event.newState === 'open';
        for (const trigger of document.querySelectorAll(`[interestfor="${CSS.escape(target.id)}"]`)) {
          if (ownedInterestTriggers.has(trigger)) {
            trigger.setAttribute('aria-expanded', String(isOpen));
          }
        }
      },
      true
    );
  }
}
