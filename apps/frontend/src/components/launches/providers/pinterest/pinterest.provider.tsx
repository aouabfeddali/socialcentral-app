import { FC } from 'react';
import { withProvider } from '@gitroom/frontend/components/launches/providers/high.order.provider';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { PinterestBoard } from '@gitroom/frontend/components/launches/providers/pinterest/pinterest.board';
import { PinterestSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/pinterest.dto';
import { Input } from '@gitroom/react/form/input';
import { ColorPicker } from '@gitroom/react/form/color.picker';

const PinterestSettings: FC = () => {
  const { register, control } = useSettings();
  return (
    <div className="flex flex-col">
      <Input label={'Titel'} {...register('title')} />
      <PinterestBoard {...register('board')} />
      <ColorPicker
        label="Selecteer kleur van Pin"
        name="dominant_color"
        enabled={false}
        canBeCancelled={true}
      />
    </div>
  );
};

export default withProvider(
  PinterestSettings,
  undefined,
  PinterestSettingsDto,
  async ([firstItem, ...otherItems]) => {
    const isMp4 = firstItem?.find((item) => item.path.indexOf('mp4') > -1);
    const isPicture = firstItem?.find(
      (item) => item.path.indexOf('mp4') === -1
    );

    if (firstItem.length === 0) {
      return 'Pinterest vereist minstens één mediabestand';
    }

    if (isMp4 && firstItem.length !== 2 && !isPicture) {
      return 'Als je een video naar Pinterest plaatst, moet je ook een omslagfoto toevoegen als tweede mediabestand';
    }

    if (isMp4 && firstItem.length > 2) {
      return 'Als je een video naar Pinterest plaatst, kun je maximaal twee mediabestanden hebben';
    }

    if (otherItems.length) {
      return 'Pinterest kan slechts één bericht bevatten';
    }

    if (
      firstItem.length > 1 &&
      firstItem.every((p) => p.path.indexOf('mp4') == -1)
    ) {
      const loadAll: Array<{ width: number; height: number }> =
        (await Promise.all(
          firstItem.map((p) => {
            return new Promise((resolve, reject) => {
              const url = new Image();
              url.onload = function () {
                // @ts-ignore
                resolve({ width: this.width, height: this.height });
              };
              url.src = p.path;
            });
          })
        )) as any;

      const checkAllTheSameWidthHeight = loadAll.every((p, i, arr) => {
        return p.width === arr[0].width && p.height === arr[0].height;
      });

      if (!checkAllTheSameWidthHeight) {
        return 'Pinterest vereist dat alle afbeeldingen dezelfde breedte en hoogte hebben';
      }
    }

    return true;
  },
  500
);
