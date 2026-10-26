import { getDifficultyLabel } from '../../utils/recipes';

const DIFFICULTY_TONES = { Easy: 'success', Medium: 'warning', Hard: 'danger' };

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`badge badge--${DIFFICULTY_TONES[difficulty] ?? 'neutral'}`}>
      <span className="badge__dot" aria-hidden="true" />
      {getDifficultyLabel(difficulty)}
    </span>
  );
}
