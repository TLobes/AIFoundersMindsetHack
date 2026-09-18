export function Icon({ name }: { name: 'replay' | 'volume' | 'mute' | 'mic' | 'send' | 'play' | 'review' | 'book' }) {
  const paths = {
    replay: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
    volume: 'M11 4 6 8H2v8h4l5 4V4ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14',
    mute: 'M11 4 6 8H2v8h4l5 4V4ZM16 9l6 6m0-6-6 6',
    mic: 'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5ZM5 11v1a7 7 0 0 0 14 0v-1M12 19v3m-4 0h8',
    send: 'm22 2-7 20-4-9-9-4L22 2ZM22 2 11 13',
    play: 'm8 4 13 8-13 8V4Z',
    review: 'M9 3H5v18h14V3h-4M9 2h6v4H9V2Zm-1 12 3 3 5-6',
    book: 'M12 5C8 2 4 2 2 3v16c4-1 7 0 10 2m0-16c4-3 8-3 10-2v16c-4-1-7 0-10 2V5Z',
  };
  return <svg className="button-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
