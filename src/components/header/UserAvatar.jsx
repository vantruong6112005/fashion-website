import { useState } from "react";
import { resolveImageUrl } from "../../utils/image";

export default function UserAvatar({
  user,
  fallback,
  className = "user-avatar",
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const rawAvatar = user?.anhDaiDien;
  const src = rawAvatar && !hasImageError ? resolveImageUrl(rawAvatar) : "";

  if (!src) {
    return (
      <span className={`${className} user-avatar--fallback`}>{fallback}</span>
    );
  }

  return (
    <img
      src={src}
      alt="avatar"
      className={className}
      onError={() => setHasImageError(true)}
    />
  );
}
