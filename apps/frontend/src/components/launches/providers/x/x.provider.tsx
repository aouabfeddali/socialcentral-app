import { withProvider } from '@gitroom/frontend/components/launches/providers/high.order.provider';
export default withProvider(
  null,
  undefined,
  undefined,
  async (posts) => {
    if (posts.some((p) => p.length > 4)) {
      return 'Er kunnen maximaal 4 afbeeldingen in een post staan.';
    }

    if (
      posts.some(
        (p) => p.some((m) => m.path.indexOf('mp4') > -1) && p.length > 1
      )
    ) {
      return 'Er kan maximaal 1 video in een post staan.';
    }

    for (const load of posts.flatMap((p) => p.flatMap((a) => a.path))) {
      if (load.indexOf('mp4') > -1) {
        const isValid = await checkVideoDuration(load);
        if (!isValid) {
          return 'De videoduur moet minder dan of gelijk aan 140 seconden zijn.';
        }
      }
    }
    return true;
  },
  280
);

const checkVideoDuration = async (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      // Check if the duration is less than or equal to 140 seconds
      const duration = video.duration;
      if (duration <= 140) {
        resolve(true); // Video duration is acceptable
      } else {
        resolve(false); // Video duration exceeds 140 seconds
      }
    };

    video.onerror = () => {
      reject(new Error('Het laden van videometadata is mislukt.'));
    };
  });
};
