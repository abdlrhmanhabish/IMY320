import './LevelTag.css';

const BARS = { Beginner: 1, Intermediate: 2, Advanced: 3 };

// the bars give each level a shape
export default function LevelTag({ level, className = '' }) {
  const filled = BARS[level] ?? 1;

  return (
    <span className={['level-tag', className].filter(Boolean).join(' ')}>
      <span className="level-tag__bars" aria-hidden="true">
        {[1, 2, 3].map((bar) => (
          <span key={bar} className={bar <= filled ? 'is-on' : undefined} />
        ))}
      </span>
      {level}
    </span>
  );
}