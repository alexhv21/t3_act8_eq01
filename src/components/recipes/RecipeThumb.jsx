import { useState } from 'react';
import Icon from '../ui/Icon';

/** Miniatura de la receta; si no hay imagen (o falla) muestra un recuadro con ícono. */
export default function RecipeThumb({ src, name, size = 44 }) {
  const [hasError, setHasError] = useState(false);
  return (
    <span className="recipe-thumb" style={{ width: size, height: size }}>
      {src && !hasError ? (
        <img src={src} alt={name} loading="lazy" onError={() => setHasError(true)} />
      ) : (
        <Icon name="camera" size={size * 0.4} />
      )}
    </span>
  );
}
