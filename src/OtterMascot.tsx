/** Animated face details use the original artwork's 1280 × 1280 coordinates. */
export function OtterMascot({ speaking, reaction, label }: { speaking: boolean; reaction: string; label: string }) {
  return (
    <svg className={`otter-mascot ${speaking ? 'is-talking' : ''}`} viewBox="0 0 1280 1280" role="img" aria-label={label}>
      <g key={reaction} className="otter-reaction">
        <image href="/otter-coach.png" width="1280" height="1280" />
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
      </g>
    </svg>
  );
}
