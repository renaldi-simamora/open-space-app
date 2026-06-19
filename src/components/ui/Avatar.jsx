function Avatar({ src, name, size = 'md' }) {
  const initials = name
    ? name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '?';

  if (src) {
    return <img className={`avatar avatar--${size}`} src={src} alt={name} />;
  }

  return (
    <div className={`avatar avatar--${size} avatar--initials`}>
      {initials}
    </div>
  );
}

export default Avatar;
