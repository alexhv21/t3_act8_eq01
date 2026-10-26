import { useState } from 'react';

/** Foto de perfil con respaldo de iniciales si la imagen no carga. */
export default function Avatar({ src, name = '', size = 44 }) {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {src && !hasError ? (
        <img src={src} alt={`Foto de perfil de ${name}`} onError={() => setHasError(true)} />
      ) : (
        <span aria-label={name}>{initials || '?'}</span>
      )}
    </span>
  );
}
