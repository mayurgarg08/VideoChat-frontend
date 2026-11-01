export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const AVATAR_BASE_URL = "https://api.dicebear.com/9.x/avataaars/svg";

export const generateAvatarUrl = (seed) =>
  `${AVATAR_BASE_URL}?seed=${encodeURIComponent(seed)}`;

export const generateRandomAvatarUrl = () =>
  generateAvatarUrl(Math.floor(Math.random() * 100000));

// Old accounts store avatar.iran.liara.run URLs, which no longer work.
// Map those (and missing pics) to a stable DiceBear avatar.
export const getAvatarUrl = (profilePic, fallbackSeed = "user") => {
  if (!profilePic) return generateAvatarUrl(fallbackSeed);

  const legacy = profilePic.match(/avatar\.iran\.liara\.run\/public\/(\d+)/);
  if (legacy) return generateAvatarUrl(legacy[1]);
  if (profilePic.includes("avatar.iran.liara.run"))
    return generateAvatarUrl(fallbackSeed);

  return profilePic;
};

// onError handler for <img> avatars: swap in a generated avatar if the URL fails
export const handleAvatarError = (e, fallbackSeed = "user") => {
  const fallback = generateAvatarUrl(fallbackSeed);
  if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
};
