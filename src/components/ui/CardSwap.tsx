"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  ReactNode,
  HTMLAttributes,
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, className = "", children, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`card-swap-item ${customClass ?? ""} ${className}`.trim()}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement | null, slot: ReturnType<typeof makeSlot>, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  duration?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic" | "snappy";
  children: ReactNode;
}

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 460,
  height = 340,
  cardDistance = 45,
  verticalDistance = 35,
  delay = 2500,
  duration = 0.65,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 3,
  easing = "elastic",
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "back.out(1.2)",
          durDrop: duration * 0.9,
          durMove: duration,
          durReturn: duration * 0.95,
          promoteOverlap: 0.75,
          returnDelay: 0.04,
          stagger: 0.05,
        }
      : easing === "snappy"
      ? {
          ease: "power3.out",
          durDrop: duration * 0.8,
          durMove: duration * 0.9,
          durReturn: duration * 0.85,
          promoteOverlap: 0.7,
          returnDelay: 0.03,
          stagger: 0.04,
        }
      : {
          ease: "power2.inOut",
          durDrop: duration * 0.85,
          durMove: duration * 0.85,
          durReturn: duration * 0.85,
          promoteOverlap: 0.5,
          returnDelay: 0.1,
          stagger: 0.06,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | NodeJS.Timeout | undefined>(undefined);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) =>
      placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    );

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: "+=420",
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * config.stagger}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return"
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return"
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const intervalId = window.setInterval(swap, delay);
    intervalRef.current = intervalId;

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<any>, {
          key: i,
          ref: refs[i],
          style: { width, height, ...((child.props as any).style ?? {}) },
          onClick: (e: React.MouseEvent) => {
            (child.props as any).onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
