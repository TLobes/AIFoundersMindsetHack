import { useId, useState } from 'react';
/** Animated face details use the original artwork's 1280 × 1280 coordinates. */
export function OtterMascot({ speaking, reaction, label }: { speaking: boolean; reaction: string; label: string }) {
  const id = useId().replace(/:/g, '');
  const [paw, setPaw] = useState({ left: 0, right: 0 });
  function wiggle(side: 'left' | 'right') { setPaw(p => ({ ...p, [side]: p[side] + 1 })); }
  return (
    <svg className={`otter-mascot ${speaking ? 'is-talking' : ''}`} viewBox="0 0 1280 1280" role="group" aria-label={label}>
      <defs>
        <clipPath id={`${id}-left-foot`}><path d="M293 975 C260 916 341 865 416 881 C504 891 563 950 583 1031 C616 1120 553 1168 458 1163 C361 1160 304 1100 293 975Z" /></clipPath>
        <clipPath id={`${id}-right-foot`}><path d="M788 954 C827 878 898 842 965 872 C1042 900 1100 963 1080 1040 C1065 1119 1004 1169 917 1164 C822 1170 752 1128 764 1050 C766 1010 776 977 788 954Z" /></clipPath>
      </defs>
      <g key={reaction} className="otter-reaction">
        <image href="/otter-coach.png" width="1280" height="1280" />
        <g key={`left-${paw.left}`} className={`otter-foot otter-foot-left ${paw.left ? 'paw-tapped' : ''}`} aria-hidden="true"><image href="/otter-coach.png" width="1280" height="1280" clipPath={`url(#${id}-left-foot)`} /></g>
        <g key={`right-${paw.right}`} className={`otter-foot otter-foot-right ${paw.right ? 'paw-tapped' : ''}`} aria-hidden="true"><image href="/otter-coach.png" width="1280" height="1280" clipPath={`url(#${id}-right-foot)`} /></g>
        <g className="otter-blink" aria-hidden="true">
          <ellipse cx="464" cy="375" rx="39" ry="48" fill="#d99a52" transform="rotate(12 464 375)" />
          <path d="M438 377 Q464 400 489 376" fill="none" stroke="#452511" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="762" cy="418" rx="39" ry="48" fill="#d99a52" transform="rotate(12 762 418)" />
          <path d="M736 420 Q762 443 787 419" fill="none" stroke="#452511" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g className="otter-eye-shine" fill="#fffbe6" aria-hidden="true">
          <path d="M478 339 L483 352 L496 357 L483 362 L478 375 L473 362 L460 357 L473 352Z" />
          <path d="M755 383 L759 395 L771 399 L759 403 L755 415 L751 403 L739 399 L751 395Z" />
        </g>
        <g className="otter-mouth" aria-hidden="true">
          <ellipse cx="592" cy="514" rx="33" ry="30" fill="#3a1b15" stroke="#452511" strokeWidth="6" />
          <ellipse cx="592" cy="531" rx="19" ry="9" fill="#ed9b96" />
        </g>
        {(['left', 'right'] as const).map(side => (
          <ellipse key={side} className="paw-target" cx={side === 'left' ? 438 : 925} cy="1020" rx="148" ry="145" fill="transparent" role="button" tabIndex={0}
            aria-label={side === 'left' ? 'Wiggle left paw' : 'Wiggle right paw'}
            onClick={() => wiggle(side)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); wiggle(side); } }} />
        ))}
      </g>
    </svg>
  );
}
