'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  dropdown?: { label: string; href: string }[];
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  logoBackground?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const isExternalLink = (href: string) =>
  href.startsWith('http://') ||
  href.startsWith('https://') ||
  href.startsWith('//') ||
  href.startsWith('mailto:') ||
  href.startsWith('tel:') ||
  href.startsWith('#');

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  logoBackground,
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const dropdownCloseTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const chevronRefs = useRef<Array<SVGSVGElement | null>>([]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;
        if (items[index]?.dropdown) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {});

    const menu = mobileMenuRef.current;
    if (menu) gsap.set(menu, { visibility: 'hidden', opacity: 0 });

    if (initialLoadAnimation) {
      if (logoRef.current) {
        gsap.set(logoRef.current, { scale: 0 });
        gsap.to(logoRef.current, { scale: 1, duration: 0.6, ease });
      }
      if (navItemsRef.current) {
        gsap.set(navItemsRef.current, { width: 0, overflow: 'hidden' });
        gsap.to(navItemsRef.current, {
          width: 'auto',
          duration: 0.6,
          ease,
          onComplete: () => { gsap.set(navItemsRef.current, { overflow: 'visible' }); },
        });
      }
    }

    return () => window.removeEventListener('resize', layout);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    if (items[i]?.dropdown) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  };

  const handleLeave = (i: number) => {
    if (items[i]?.dropdown) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  };

  const handleDropdownEnter = (i: number) => {
    clearTimeout(dropdownCloseTimers.current[i]);
    setOpenDropdownIndex(i);
    const chevron = chevronRefs.current[i];
    if (chevron) gsap.to(chevron, { rotate: 180, duration: 0.2, ease });
  };

  const handleDropdownLeave = (i: number) => {
    dropdownCloseTimers.current[i] = setTimeout(() => {
      setOpenDropdownIndex(null);
      const chevron = chevronRefs.current[i];
      if (chevron) gsap.to(chevron, { rotate: 0, duration: 0.2, ease });
    }, 80);
  };

  const handleLogoEnter = () => {
    logoTweenRef.current?.kill();
    gsap.set(logoImgRef.current, { rotate: 0 });
    logoTweenRef.current = gsap.to(logoImgRef.current, { rotate: 360, duration: 0.2, ease, overwrite: 'auto' });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(menu, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease });
      } else {
        gsap.to(menu, {
          opacity: 0, y: 10, duration: 0.2, ease,
          onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); },
        });
      }
    }

    onMobileMenuClick?.();
  };

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px',
  } as React.CSSProperties;

  const basePillClasses =
    'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[14px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer';

  const pillStyle: React.CSSProperties = {
    background: 'var(--pill-bg, #fff)',
    color: 'var(--pill-text, var(--base, #000))',
    paddingLeft: 'var(--pill-pad-x)',
    paddingRight: 'var(--pill-pad-x)',
  };

  const ctaPillStyle: React.CSSProperties = {
    background: 'transparent',
    color: pillColor,
    border: `1.5px solid ${pillColor}`,
    paddingLeft: 'var(--pill-pad-x)',
    paddingRight: 'var(--pill-pad-x)',
  };

  return (
    <div className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}>
      <nav aria-label="Primary" style={cssVars} className="flex items-center gap-2">

        {/* Logo */}
        <a
          href="/"
          aria-label="Home"
          onMouseEnter={handleLogoEnter}
          ref={logoRef}
          className="rounded-full inline-flex items-center justify-center overflow-hidden shrink-0"
          style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: logoBackground ?? 'var(--base, #000)', border: '3px solid #000000' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-contain block" />
        </a>

        {/* Desktop pill items — overflow visible so dropdown escapes the bar */}
        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-1"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)',
            overflow: 'visible',
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)', overflow: 'visible' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;
              const hasDropdown = !!item.dropdown?.length;

              /* ── CTA / DROPDOWN ITEM ── */
              if (hasDropdown) {
                return (
                  <li
                    key={item.href + i}
                    role="none"
                    className="flex h-full relative"
                    style={{ overflow: 'visible' }}
                    onMouseEnter={() => handleDropdownEnter(i)}
                    onMouseLeave={() => handleDropdownLeave(i)}
                  >
                    <button
                      role="menuitem"
                      aria-haspopup="true"
                      className={`${basePillClasses} gap-1.5`}
                      style={ctaPillStyle}
                    >
                      <span className="font-semibold">{item.label}</span>
                      <svg
                        ref={el => { chevronRefs.current[i] = el; }}
                        className="w-3 h-3 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Mini dropdown — CSS transition, no GSAP */}
                    <div
                      className="absolute top-[calc(100%+10px)] right-0 min-w-[190px] rounded-2xl z-[999]"
                      style={{
                        background: baseColor,
                        border: `1px solid ${pillColor}22`,
                        boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
                        opacity: openDropdownIndex === i ? 1 : 0,
                        transform: openDropdownIndex === i ? 'translateY(0)' : 'translateY(-6px)',
                        pointerEvents: openDropdownIndex === i ? 'auto' : 'none',
                        transition: 'opacity 0.15s ease, transform 0.15s ease',
                      }}
                    >
                      <ul className="p-1.5 flex flex-col gap-0.5 list-none m-0">
                        {item.dropdown!.map((sub) => (
                          <li key={sub.href}>
                            {isExternalLink(sub.href) ? (
                              <a
                                href={sub.href}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group"
                                style={{ color: pillColor }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${pillColor}15`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                              >
                                {sub.label}
                                <svg className="w-3 h-3 opacity-30 group-hover:opacity-80 transition-opacity" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ) : (
                              <Link
                                href={sub.href}
                                className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                                style={{ color: pillColor }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${pillColor}15`; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                              >
                                {sub.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              /* ── REGULAR PILL ITEM ── */
              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{ background: 'var(--base, #000)', willChange: 'transform' }}
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: 'transform' }}>
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{ color: 'var(--hover-text, #fff)', willChange: 'transform, opacity' }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              return (
                <li key={item.href + i} role="none" className="flex h-full">
                  {isExternalLink(item.href) ? (
                    <a
                      role="menuitem"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  ) : (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Hamburger — mobile */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0"
          style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--base, #000)' }}
        >
          <span className="hamburger-line w-4 h-0.5 rounded origin-center" style={{ background: pillColor }} />
          <span className="hamburger-line w-4 h-0.5 rounded origin-center" style={{ background: pillColor }} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-[4rem] left-3 right-3 rounded-[20px] z-[998] origin-top"
        style={{
          ...cssVars,
          background: baseColor,
          border: `1px solid ${pillColor}20`,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
        }}
      >
        <ul className="list-none m-0 p-2 flex flex-col gap-1">
          {items.map((item) => {
            const linkClasses = 'block py-3 px-4 text-[14px] font-medium rounded-[14px] transition-colors duration-150';
            const defaultStyle: React.CSSProperties = { color: pillColor };

            if (item.dropdown?.length) {
              return (
                <li key={item.href + 'mob'}>
                  <p className="px-4 pt-3 pb-1 text-[11px] uppercase tracking-widest font-semibold" style={{ color: `${pillColor}55` }}>
                    {item.label}
                  </p>
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.href}
                      href={sub.href}
                      target={isExternalLink(sub.href) ? '_blank' : undefined}
                      rel={isExternalLink(sub.href) ? 'noreferrer' : undefined}
                      className={linkClasses}
                      style={defaultStyle}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${pillColor}15`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {sub.label}
                    </a>
                  ))}
                </li>
              );
            }

            return (
              <li key={item.href + 'mob'}>
                {isExternalLink(item.href) ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${pillColor}15`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${pillColor}15`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
