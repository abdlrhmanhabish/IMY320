import { site } from '../../config/site.js';

const SANS = "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const INK = '#1c1b19';
const MUTED = '#5b5852';
const BRAND = '#4338ca';
const LINE = '#d9d3c5';

export default function Certificate({
  ref,
  name,
  course,
  completedAt,
  number,
  lessons,
  className = '',
}) {
  const date = new Date(completedAt).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const nameSize = name.length > 24 ? Math.max(38, 62 - (name.length - 24) * 2) : 62;
  const titleSize = course.title.length > 44 ? 32 : 36;

  return (
    <svg
      ref={ref}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 848"
      role="img"
      aria-label={`Certificate of completion for ${name}, ${course.title}, completed ${date}, number ${number}`}
    >
      <rect width="1200" height="848" fill="#fffdf8" />
      <rect x="24" y="24" width="1152" height="800" fill="none" stroke={LINE} strokeWidth="2" />
      <rect x="40" y="40" width="1120" height="768" fill="none" stroke={BRAND} strokeWidth="1.5" />

      <g transform="translate(88 82)">
        <rect x="0" y="22" width="11" height="18" rx="3" fill={BRAND} opacity="0.45" />
        <rect x="16" y="11" width="11" height="29" rx="3" fill={BRAND} opacity="0.7" />
        <rect x="32" y="0" width="11" height="40" rx="3" fill={BRAND} />
        <text x="58" y="34" fill={INK} fontFamily={SANS} fontSize="30" fontWeight="700">
          {site.name}
        </text>
      </g>

      <text x="1112" y="106" textAnchor="end" fill={MUTED} fontFamily={SANS} fontSize="18">
        Certificate {number}
      </text>

      <text
        x="600"
        y="250"
        textAnchor="middle"
        fill={BRAND}
        fontFamily={SANS}
        fontSize="22"
        fontWeight="700"
        letterSpacing="6"
      >
        CERTIFICATE OF COMPLETION
      </text>

      <text x="600" y="318" textAnchor="middle" fill={MUTED} fontFamily={SANS} fontSize="22">
        This certifies that
      </text>

      <text x="600" y="404" textAnchor="middle" fill={INK} fontFamily={SERIF} fontSize={nameSize} fontWeight="700">
        {name}
      </text>

      <line x1="330" y1="436" x2="870" y2="436" stroke={LINE} strokeWidth="2" />

      <text x="600" y="492" textAnchor="middle" fill={MUTED} fontFamily={SANS} fontSize="22">
        has completed the course
      </text>

      <text x="600" y="552" textAnchor="middle" fill={INK} fontFamily={SANS} fontSize={titleSize} fontWeight="700">
        {course.title}
      </text>

      <text x="600" y="600" textAnchor="middle" fill={MUTED} fontFamily={SANS} fontSize="20">
        {course.duration}, {course.modules.length} modules, {lessons} lessons, {course.level} level
      </text>

      <g transform="translate(160 700)">
        <text x="0" y="0" fill={INK} fontFamily={SANS} fontSize="24" fontWeight="600">
          {date}
        </text>
        <line x1="0" y1="18" x2="260" y2="18" stroke={LINE} strokeWidth="2" />
        <text x="0" y="48" fill={MUTED} fontFamily={SANS} fontSize="18">
          Date completed
        </text>
      </g>

      <g transform="translate(600 700)">
        <circle r="64" fill={BRAND} />
        <circle r="54" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <path
          d="M-22 2l14 14 30-32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g transform="translate(1040 700)">
        <text x="0" y="0" textAnchor="end" fill={INK} fontFamily={SERIF} fontSize="30" fontStyle="italic">
          {course.instructor}
        </text>
        <line x1="-300" y1="18" x2="0" y2="18" stroke={LINE} strokeWidth="2" />
        <text x="0" y="48" textAnchor="end" fill={MUTED} fontFamily={SANS} fontSize="18">
          Instructor, {course.role}
        </text>
      </g>
    </svg>
  );
}