import { fetchGroupMedia } from '../lib/fetchGroupMedia';

async function main() {
  const media = await fetchGroupMedia({ limit: 10 });
  const videos = media.filter((m) => m.type === 'video');
  console.log(JSON.stringify(videos.slice(0, 2), null, 2));
}

main().catch(console.error);
