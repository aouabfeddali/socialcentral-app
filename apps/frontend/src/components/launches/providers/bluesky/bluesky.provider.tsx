import { withProvider } from '@gitroom/frontend/components/launches/providers/high.order.provider';

export default withProvider(null, undefined, undefined, async (posts) => {
  if (posts.some((p) => p.length > 4)) {
    return 'Er kunnen maximaal 4 afbeeldingen in een bericht zitten.';
  }

  return true;
}, 300);
