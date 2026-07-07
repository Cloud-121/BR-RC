import { fetchGroupMedia } from '../lib/fetchGroupMedia';
import { extractVideoSourceUrl, resolveVideoSourceUrl } from '../lib/fetchVideoSource';

async function main() {
  const media = await fetchGroupMedia({ limit: 10 });
  const video = media.find((item) => item.type === 'video');
  if (!video) {
    console.log('No videos found');
    return;
  }

  console.log('Testing video:', video.id, video.postUrl);
  const sourceUrl = await resolveVideoSourceUrl(video.id, video.postUrl);
  console.log('Source URL found:', sourceUrl.slice(0, 120) + '...');
}

main().catch((error) => {
  console.error('Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
