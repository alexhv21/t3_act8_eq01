import Icon from './Icon';

export default function Logo({ subtitle = 'Panel de administración', variant = 'light' }) {
  return (
    <div className={`logo logo--${variant}`}>
      <span className="logo__mark">
        <Icon name="utensils" size={22} />
      </span>
      <span className="logo__text">
        <span className="logo__name">Sabores de Oaxaca</span>
        <span className="logo__subtitle">{subtitle}</span>
      </span>
    </div>
  );
}
