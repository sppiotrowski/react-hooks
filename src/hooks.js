import React from "react";

/**
 * Utility hooks
 * @module hooks
 */

/*
 * Description for html DOM primitives
 * // current scroll from the top
 * window.pageYOffset
 *
 * // get width/height visible part of the content area (without scroll height)
 * document.documentElement.clientHeight // clientWidth
 *
 * // window height (including scroll height)
 * window.innerHeight
 *
 * // apply scrolling
 * window.scrollBy(x,y)
 * window.scrollTo(pageX,pageY)
 *
 * // scroll to show the DOM element
 * element.scrollIntoView(top)
 *
 * // forbid the scrolling
 * document.body.style.overflow = "hidden"
 *
 * // allow the scrolling
 * document.body.style.overflow = ""
 *
 * // calculate the max page Y offset
 * maxPageYOffset = wrapRect.height - clientHeight
 */

const scrollToTop = () => window.scrollTo(0, 0);

/**
 * useScrollPageY - wrapper around window.pageYOffset
 * @see {@link
 * https://www.w3schools.com/jsref/prop_win_pagexoffset.asp|pageYOffset}
 *
 * @example
 * const El = () => {
 *  const [ elRef, elOffsetFromTop, elOffsetFromBottom, elRect ] = useScrollPageY()
 *
 *  React.useEffect(() => {
 *    console.log("el.offset.top:", elOffsetFromTop);
 *    console.log("el.offset.bottom", elOffsetFromBottom);
 *    console.log("");
 *  }, [elOffsetFromTop, elOffsetFromBottom, elRect])
 *
 *  return (
 *   <div>
 *     <div ref={elRef} />
 *   </div>
 *  )
 * }
 *
 * @todo
 * add desc for returns
 */
export const useScrollPageY = () => {
  const [elementRef, elementRect] = useClientRect();
  const [pageYOffset, setPageYOffset] = React.useState(0);

  // TODO: check defaults
  const defaults = { top: 0, bottom: 0 };
  const [elementOffsetFromTop, setElementOffsetFromTop] = React.useState({
    ...defaults
  });
  const [elementOffsetFromBottom, setElementOffsetFromBottom] = React.useState({
    ...defaults
  });

  const onScroll = e => {
    setPageYOffset(window.pageYOffset);
  };

  React.useEffect(() => {
    const { top: elementTop, bottom: elementBottom } = elementRect;
    const clientHeight = document.documentElement.clientHeight;
    const bottomYOffset = pageYOffset + clientHeight;

    const elementOffsetFromTop = {
      top: -1 * (pageYOffset - elementTop),
      bottom: -1 * (pageYOffset - elementBottom)
    };
    const elementOffsetFromBottom = {
      top: bottomYOffset - elementTop,
      bottom: bottomYOffset - elementBottom
    };

    setElementOffsetFromTop(elementOffsetFromTop);
    setElementOffsetFromBottom(elementOffsetFromBottom);
  }, [elementRect, pageYOffset]);

  React.useLayoutEffect(() => {
    window.onbeforeunload = scrollToTop();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll");
  }, []);

  return [
    elementRef,
    elementOffsetFromTop,
    elementOffsetFromBottom,
    elementRect
  ];
};

/**
 * useClientRect - wrapper around getBoundingClientRect html dom method.
 * @see {@link https://www.w3schools.com/jsref/met_element_getboundingclientrect.asp|getBoundingClientRect}
 *
 * @example
 * const [elementRef, elementRect] = useClientRect()
 * const Example = () => <div ref={elementRef}>{elementRect.height}</div>
 *
 * @returns {elementRef} provide a way to access a DOM node
 * @returns {elementRect} DOMRect: {left, top, right, bottom, width, height}
 *
 * @todo
 * DOMRect is including border width (.i.e 20px + border top 1px + border bottom 1px = 22px)
 * how to deal with it?
 */
export const useClientRect = () => {
  const [rect, setRect] = React.useState({});
  const [node, setNode] = React.useState(null);

  const ref = React.useCallback(element => {
    setNode(element);
  }, []);

  React.useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setRect(node.getBoundingClientRect())
        );
      measure();
    }
  }, [node]);

  return [ref, rect];
};

export const RectInfo = ({ label, rect }) => (
  <span>{`${label} -> height: ${rect.height}, y: ${rect.y}`}</span>
);
