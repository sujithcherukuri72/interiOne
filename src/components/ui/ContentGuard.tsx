"use client";

import { useEffect } from "react";

/**
 * Makes the imagery awkward to lift.
 *
 * Be clear about what this is: a deterrent, not protection. Anything the
 * browser has drawn can be captured — devtools, the network tab, a phone
 * pointed at the monitor, or the operating system's own screenshot key, none of
 * which a web page can intercept. What this stops is the casual route: the
 * right-click "Save image as", the drag onto the desktop, the long-press menu.
 *
 * Deliberately scoped to images. Blocking the context menu across the whole
 * page would also take away "open link in a new tab", which is a real thing
 * visitors do on a site with a studio address and a phone number on it.
 */
export default function ContentGuard() {
  useEffect(() => {
    const isImagery = (target: EventTarget | null) =>
      target instanceof Element &&
      Boolean(target.closest("img, picture, svg, canvas, [data-protect]"));

    const onContextMenu = (event: MouseEvent) => {
      if (isImagery(event.target)) event.preventDefault();
    };

    // Belt and braces alongside the CSS `-webkit-user-drag: none` — Firefox
    // ignores that property and drags the image anyway.
    const onDragStart = (event: DragEvent) => {
      if (isImagery(event.target)) event.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
