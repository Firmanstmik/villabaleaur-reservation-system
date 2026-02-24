/**
 * Convert a YouTube or Vimeo URL into an embeddable iframe src.
 * Returns null for unrecognized formats.
 */
export function getEmbedUrl(url: string): string | null {
  if (!url || !url.trim()) return null;

  const trimmed = url.trim();

  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytPatterns = [
    /(?:youtube\.com\/watch\?.*v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];

  for (const pattern of ytPatterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0`;
    }
  }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoPatterns = [
    /(?:player\.vimeo\.com\/video\/)(\d+)/,
    /(?:vimeo\.com\/)(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return `https://player.vimeo.com/video/${match[1]}?dnt=1`;
    }
  }

  return null;
}
