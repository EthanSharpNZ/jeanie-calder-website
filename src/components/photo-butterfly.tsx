// Original geometric fee symbol. The client-supplied hero animation is separate.
export function ButterflyFeeSymbol() {
  return <svg className="butterfly-fee-symbol" viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
    <path d="M15 15C11 4 2 2 3 11c0 5 6 8 12 7C5 16 5 27 10 27c4 0 5-6 6-9" fill="#507b9b" />
    <path d="M17 15C21 4 30 2 29 11c0 5-6 8-12 7 10-2 10 9 5 9-4 0-5-6-6-9" fill="#769bb2" />
    <path d="M16 12v11m0-10-3-5m3 5 3-5" fill="none" stroke="#51425b" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
}
