'use client';

import { resetAllWalkthroughs } from '@/lib/walkthrough';

export default function WalkthroughReplayButton() {
  function replay() {
    resetAllWalkthroughs();
    alert('Tours reset. Visit Home, Personal, People, or Portal — tap the ? button or accept the tour prompt.');
  }

  return (
    <button
      type="button"
      onClick={replay}
      style={{
        marginTop: 14,
        background: 'none',
        border: 'none',
        color: '#c57b57',
        fontSize: '0.88rem',
        fontWeight: 600,
        cursor: 'pointer',
        padding: 0,
        textAlign: 'left',
      }}
    >
      Show me the app tour again →
    </button>
  );
}
