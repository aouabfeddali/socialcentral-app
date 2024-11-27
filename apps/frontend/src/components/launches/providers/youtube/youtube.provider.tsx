import { FC } from 'react';
import { withProvider } from '@gitroom/frontend/components/launches/providers/high.order.provider';
import { YoutubeSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/youtube.settings.dto';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { Input } from '@gitroom/react/form/input';
import { MediumTags } from '@gitroom/frontend/components/launches/providers/medium/medium.tags';
import { MediaComponent } from '@gitroom/frontend/components/media/media.component';
import { Select } from '@gitroom/react/form/select';

const type = [
  { label: 'Openbaar', value: 'public' },
  { label: 'Privé', value: 'private' },
  { label: 'Niet vermeld', value: 'unlisted' },
];

const YoutubeSettings: FC = () => {
  const { register, control } = useSettings();
  return (
    <div className="flex flex-col">
      <Input label="Titel" {...register('title')} />
      <Select label="Type" {...register('type', { value: 'public' })}>
        {type.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>
      <MediumTags label="Tags" {...register('tags')} />
      <div className="mt-[20px]">
        <MediaComponent
          type="image"
          width={1280}
          height={720}
          label="Miniatuur"
          description="Miniatuurafbeelding (optioneel)"
          {...register('thumbnail')}
        />
      </div>
    </div>
  );
};

export default withProvider(
  YoutubeSettings,
  undefined,
  YoutubeSettingsDto,
  async (items) => {
    const [firstItems] = items;

    if (items.length !== 1) {
      return 'YouTube-items moeten één zijn';
    }

    if (items[0].length !== 1) {
      return 'Je hebt één mediabestand nodig';
    }

    if (firstItems[0].path.indexOf('mp4') === -1) {
      return 'Het item moet een video zijn';
    }

    return true;
  },
  5000
);
