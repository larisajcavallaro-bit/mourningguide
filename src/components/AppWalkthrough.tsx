'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  type WalkthroughStep,
  type WalkthroughTourId,
  isWalkthroughDone,
  markWalkthroughDone,
} from '@/lib/walkthrough';

type Props = {
  tourId: WalkthroughTourId;
  steps: WalkthroughStep[];
  /** Offer tour automatically on first visit */
  autoOffer?: boolean;
};

export default function AppWalkthrough({ tourId, steps, autoOffer = true }: Props) {
  const [offered, setOffered] = useState(false);
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;

  const updateRect = useCallback(() => {
    if (!step) return;
    if (step.placement === 'center' || step.target === 'walkthrough-center') {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-walkthrough="${step.target}"]`);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!autoOffer || typeof window === 'undefined') return;
    if (isWalkthroughDone(tourId)) return;
    const t = window.setTimeout(() => setOffered(true), 800);
    return () => window.clearTimeout(t);
  }, [autoOffer, tourId]);

  useEffect(() => {
    if (!active) return;
    const frame = window.requestAnimationFrame(updateRect);
    const onResize = () => updateRect();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [active, stepIndex, updateRect, step]);

  function start() {
    setOffered(false);
    setStepIndex(0);
    setActive(true);
  }

  function close(markDone: boolean) {
    setActive(false);
    setOffered(false);
    if (markDone) markWalkthroughDone(tourId);
  }

  function next() {
    if (isLast) close(true);
    else setStepIndex(i => i + 1);
  }

  if (!steps.length) return null;

  const bubbleStyle: React.CSSProperties = rect
    ? {
        position: 'fixed',
        zIndex: 10001,
        maxWidth: 340,
        left: Math.min(Math.max(16, rect.left + rect.width / 2 - 170), window.innerWidth - 356),
        top: step?.placement === 'top'
          ? Math.max(16, rect.top - 12)
          : rect.bottom + 12,
        transform: step?.placement === 'top' ? 'translateY(-100%)' : undefined,
      }
    : {
        position: 'fixed',
        zIndex: 10001,
        maxWidth: 380,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      };

  return (
    <>
      {/* Floating help button — always available */}
      <button
        type="button"
        onClick={start}
        aria-label="Show help tour for this page"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9990,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '2px solid rgba(197,123,87,0.45)',
          background: 'linear-gradient(180deg,#fffaf4,#f5eadf)',
          color: '#c57b57',
          fontFamily: 'var(--serif)',
          fontSize: '1.35rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(67,46,33,0.18)',
        }}
      >
        ?
      </button>

      {offered && !active && (
        <div
          role="dialog"
          aria-labelledby="walkthrough-offer-title"
          style={{
            position: 'fixed',
            bottom: 84,
            right: 20,
            zIndex: 9995,
            maxWidth: 300,
            padding: '18px 20px',
            borderRadius: 16,
            border: '1px solid rgba(197,123,87,0.35)',
            background: '#fffaf4',
            boxShadow: '0 16px 40px rgba(67,46,33,0.16)',
          }}
        >
          <p id="walkthrough-offer-title" style={{ margin: '0 0 8px', fontFamily: 'var(--serif)', fontSize: '1.05rem', fontWeight: 500, color: '#2f241f' }}>
            Would you like a quick tour?
          </p>
          <p style={{ margin: '0 0 14px', fontSize: '0.9rem', lineHeight: 1.55, color: '#594b43' }}>
            We can walk you through this screen step by step. You can skip anytime.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={start} className="save-btn" style={{ minHeight: 42, padding: '0 16px', fontSize: '0.9rem' }}>
              Yes, show me
            </button>
            <button type="button" onClick={() => close(true)} style={{ background: 'none', border: 'none', color: '#7a5341', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: '8px 4px' }}>
              No thanks
            </button>
          </div>
        </div>
      )}

      {active && step && (
        <>
          {!rect && (
            <div
              aria-hidden
              onClick={() => close(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: 'rgba(47,36,31,0.45)',
              }}
            />
          )}
          {rect && (
            <div
              aria-hidden
              onClick={() => close(false)}
              style={{
                position: 'fixed',
                zIndex: 10000,
                left: rect.left - 6,
                top: rect.top - 6,
                width: rect.width + 12,
                height: rect.height + 12,
                borderRadius: 12,
                border: '3px solid #d88963',
                boxShadow: '0 0 0 9999px rgba(47,36,31,0.45)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            />
          )}
          <div
            role="dialog"
            aria-labelledby="walkthrough-step-title"
            style={{
              ...bubbleStyle,
              padding: '22px 22px 18px',
              borderRadius: 18,
              border: '1px solid rgba(197,123,87,0.35)',
              background: '#fffaf4',
              boxShadow: '0 20px 48px rgba(67,46,33,0.22)',
            }}
          >
            <p style={{ margin: '0 0 6px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c86d49' }}>
              Step {stepIndex + 1} of {steps.length}
            </p>
            <h2 id="walkthrough-step-title" style={{ margin: '0 0 10px', fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 500, color: '#2f241f', lineHeight: 1.25 }}>
              {step.title}
            </h2>
            <p style={{ margin: '0 0 18px', fontSize: '0.95rem', lineHeight: 1.65, color: '#594b43' }}>
              {step.body}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <button type="button" onClick={() => close(true)} style={{ background: 'none', border: 'none', color: '#7a5341', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                Skip tour
              </button>
              <button type="button" onClick={next} className="save-btn" style={{ minHeight: 44, padding: '0 18px', fontSize: '0.92rem' }}>
                {isLast ? 'Done' : 'Next →'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
