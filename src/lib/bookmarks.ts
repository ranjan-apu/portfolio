export interface SavedPost { href: string; title: string; description: string }
const KEY = 'apurba:saved-posts';

export function getSavedPosts(): SavedPost[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value.filter((item): item is SavedPost =>
      typeof item?.href === 'string' && item.href.startsWith('/') && !item.href.startsWith('//') &&
      typeof item.title === 'string' && typeof item.description === 'string') : [];
  } catch { return []; }
}

export function savePost(post: SavedPost): boolean {
  const existing = getSavedPosts();
  const saved = !existing.some(item => item.href === post.href);
  const next = saved ? [post, ...existing] : existing.filter(item => item.href !== post.href);
  localStorage.setItem(KEY, JSON.stringify(next));
  return saved;
}
