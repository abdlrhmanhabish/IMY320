import './SpotArt.css';

//these are small drawings for the moments a page has nothing to show yet

export function EmptyCartArt({ className = '' }) {
  return (
    <svg
      className={['spot-art', className].filter(Boolean).join(' ')}
      viewBox="0 0 320 220"
      role="img"
      aria-label="An empty cart with two course cards dropping into it"
      focusable="false"
    >
      <ellipse cx="160" cy="194" rx="118" ry="16" className="spot-art__blob" />
      <circle cx="238" cy="72" r="44" className="spot-art__blob" />

      <g className="spot-art__drop">
        <g transform="rotate(12 177 44)">
          <rect x="150" y="24" width="54" height="40" rx="8" className="spot-art__soft" />
          <path d="M160 38h30M160 48h20" className="spot-art__stroke" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g transform="rotate(-10 157 62)">
          <rect x="128" y="42" width="58" height="42" rx="8" className="spot-art__mid" />
          <path d="M138 56h36M138 66h24" className="spot-art__rule" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>

      <path d="M96 104h128l-18 54h-96z" className="spot-art__pale" />
      <path
        d="M62 88h30l18 70h96l18-54H96"
        className="spot-art__stroke"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M118 122h80M122 140h72" className="spot-art__track" strokeWidth="4" strokeLinecap="round" />
      <circle cx="126" cy="178" r="9" className="spot-art__deep" />
      <circle cx="194" cy="178" r="9" className="spot-art__deep" />

      <g className="spot-art__twinkle">
        <path d="M262 132v14M255 139h14" className="spot-art__stroke" strokeWidth="4" strokeLinecap="round" />
        <path d="M56 42v12M50 48h12" className="spot-art__stroke" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function FirstWinArt({ className = '' }) {
  return (
    <svg
      className={['spot-art', className].filter(Boolean).join(' ')}
      viewBox="0 0 320 220"
      role="img"
      aria-label="A learning path with its first stop already ticked off and a flag waiting at the end"
      focusable="false"
    >
      <ellipse cx="160" cy="198" rx="128" ry="14" className="spot-art__blob" />
      <circle cx="70" cy="70" r="40" className="spot-art__blob" />

      <path
        d="M48 168Q84 168 120 128Q156 92 196 96Q236 100 262 52"
        className="spot-art__track"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M48 168Q84 168 120 128"
        className="spot-art__path spot-art__draw"
        strokeWidth="6"
        strokeLinecap="round"
        pathLength="1"
      />

      <circle cx="196" cy="96" r="9" className="spot-art__paper spot-art__ring" />
      <line x1="262" y1="54" x2="262" y2="16" className="spot-art__stroke" strokeWidth="4" strokeLinecap="round" />
      <path d="M262 16l28 9-28 9z" className="spot-art__accent" />

      <circle cx="120" cy="128" r="18" className="spot-art__win-glow" />
      <g className="spot-art__pop">
        <circle cx="120" cy="128" r="14" className="spot-art__win" />
        <path
          d="M113 128.5l4.5 4.5 9-9.5"
          className="spot-art__tick"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <circle cx="48" cy="168" r="9" className="spot-art__mid" />

      <g className="spot-art__twinkle">
        <path d="M148 98v12M142 104h12" className="spot-art__stroke" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M96 100v8M92 104h8" className="spot-art__stroke" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function LostArt({ className = '' }) {
  return (
    <svg
      className={['spot-art', className].filter(Boolean).join(' ')}
      viewBox="0 0 320 220"
      role="img"
      aria-label="A signpost with its arms pointing in opposite directions"
      focusable="false"
    >
      <ellipse cx="160" cy="198" rx="112" ry="14" className="spot-art__blob" />
      <circle cx="84" cy="62" r="40" className="spot-art__blob" />

      <rect x="153" y="58" width="14" height="140" rx="5" className="spot-art__deep" />

      <g className="spot-art__sway">
        <path d="M167 70h84l18 17-18 17h-84z" className="spot-art__mid" />
        <path d="M180 82h50M180 92h34" className="spot-art__rule" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g className="spot-art__sway spot-art__sway--late">
        <path d="M153 116h-84l-18 17 18 17h84z" className="spot-art__soft" />
        <path d="M86 128h52M100 138h38" className="spot-art__stroke" strokeWidth="4" strokeLinecap="round" />
      </g>

      <circle cx="160" cy="52" r="10" className="spot-art__accent" />
    </svg>
  );
}