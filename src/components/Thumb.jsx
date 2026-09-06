const BG = "#1A1230";

const SHAPES = {
  heat: (id) => (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#FFD79A" />
          <stop offset="34%" stopColor="#E8913C" />
          <stop offset="64%" stopColor="#B4306E" />
          <stop offset="100%" stopColor={BG} />
        </radialGradient>
      </defs>
      <ellipse cx="22" cy="20" rx="15" ry="12" fill={`url(#${id})`} opacity=".92" />
      <ellipse cx="22" cy="20" rx="6" ry="4.6" fill="none" stroke="#FFE2B8" strokeWidth="1" />
    </>
  ),
  bars: () => (
    <>
      <g fill="none" stroke="#E8913C" strokeWidth="2">
        <path d="M10 30h6V20h-6zM19 30h6V13h-6zM28 30h6V24h-6z" />
      </g>
      <path d="M8 35h28" stroke="#B4306E" strokeWidth="1.6" />
    </>
  ),
  house: () => (
    <>
      <path d="M11 23l11-10 11 10v11H11z" fill="none" stroke="#E8913C" strokeWidth="2" />
      <rect x="19" y="26" width="6" height="8" fill="#B4306E" />
    </>
  ),
  cards: () => (
    <>
      <rect x="9" y="12" width="20" height="15" rx="2.5" fill="none" stroke="#B4306E" strokeWidth="1.8" />
      <rect x="15" y="18" width="20" height="15" rx="2.5" fill="none" stroke="#E8913C" strokeWidth="2" />
    </>
  ),
  scatter: () => (
    <>
      <circle cx="15" cy="26" r="3.2" fill="#E8913C" />
      <circle cx="23" cy="18" r="3.2" fill="#B4306E" />
      <circle cx="31" cy="23" r="3.2" fill="#FFD79A" />
      <path d="M8 34h28" stroke="#5C4A8A" strokeWidth="1.6" />
    </>
  ),
  stack: () => (
    <>
      <path d="M12 15h20M12 22h20M12 29h12" stroke="#E8913C" strokeWidth="2.2" />
      <circle cx="32" cy="29" r="3.2" fill="#B4306E" />
    </>
  ),
  cart: () => (
    <>
      <rect x="11" y="14" width="22" height="16" rx="2" fill="none" stroke="#E8913C" strokeWidth="2" />
      <path d="M11 20h22" stroke="#B4306E" strokeWidth="1.8" />
      <circle cx="17" cy="35" r="2" fill="#FFD79A" />
      <circle cx="27" cy="35" r="2" fill="#FFD79A" />
    </>
  ),
};

export default function Thumb({ name, id }) {
  const shape = SHAPES[name] || SHAPES.stack;
  return (
    <svg className="thumb" viewBox="0 0 44 44" aria-hidden="true" focusable="false">
      <rect width="44" height="44" fill={BG} />
      {shape(`g-${id}`)}
    </svg>
  );
}
