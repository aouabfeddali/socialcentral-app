import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { InputGroup } from '@blueprintjs/core';
import { Clean } from '@blueprintjs/icons';

import { SectionTab } from 'polotno/side-panel';
import { getImageSize } from 'polotno/utils/image';

import { ImagesGrid } from 'polotno/side-panel/images-grid';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { Button } from '@gitroom/react/form/button';
import { useToaster } from '@gitroom/react/toaster/toaster';

const GenerateTab = observer(({ store }: any) => {
  const inputRef = React.useRef<any>(null);
  const [image, setImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const fetch = useFetch();
  const toast = useToaster();

  const loadCredits = useCallback(async () => {
    return (
      await fetch(`/copilot/credits`, {
        method: 'GET',
      })
    ).json();
  }, []);

  const {data, mutate} = useSWR('copilot-credits', loadCredits);

  const handleGenerate = async () => {
    if (data?.credits <= 0) {
      window.open('/billing', '_blank');
      return ;
    }

    if (!inputRef.current.value) {
      toast.show('Voer je prompt in', 'warning');
      return ;
    }
    setLoading(true);
    setImage(null);

    const req = await fetch(`/media/generate-image`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: inputRef.current.value,
      }),
    });

    setLoading(false);
    if (!req.ok) {
      alert('Something went wrong, please try again later...Er is iets misgegaan, probeer het later opnieuw...');
      return;
    }
    mutate();
    const newData = await req.json();
    setImage(newData.output);
  };

  return (
    <>
      <div style={{ height: '40px', paddingTop: '5px' }}>
      Genereer afbeelding met AI {data?.credits ? `(${data?.credits} left)` : ``}
      </div>
      <InputGroup
        placeholder="Typ hier je prompt voor beeldgeneratie..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGenerate();
          }
        }}
        style={{
          marginBottom: '20px',
        }}
        inputRef={inputRef}
      />
      <Button
        onClick={handleGenerate}
        loading={loading} innerClassName="invert"
        style={{ marginBottom: '40px' }}
      >
        {data?.credits <= 0 ? 'Klik om meer credits aan te schaffen' : 'Genereren'}
      </Button>
      {image && (
        <ImagesGrid
          shadowEnabled={false}
          images={image ? [image] : []}
          getPreview={(item) => item}
          isLoading={loading}
          onSelect={async (item, pos, element) => {
            const src = item;
            if (element && element.type === 'svg' && element.contentEditable) {
              element.set({ maskSrc: src });
              return;
            }

            if (
              element &&
              element.type === 'image' &&
              element.contentEditable
            ) {
              element.set({ src: src });
              return;
            }

            const { width, height } = await getImageSize(src);
            const x = (pos?.x || store.width / 2) - width / 2;
            const y = (pos?.y || store.height / 2) - height / 2;
            store.activePage?.addElement({
              type: 'image',
              src: src,
              width,
              height,
              x,
              y,
            });
          }}
          rowsNumber={1}
        />
      )}
    </>
  );
});

const PictureGeneratorPanel = observer(({ store }: any) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GenerateTab store={store} />
    </div>
  );
});

// define the new custom section
export const PictureGeneratorSection = {
  name: 'picture-generator-ai',
  Tab: (props: any) => (
    <SectionTab name="AI Afb" {...props}>
      <Clean />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: PictureGeneratorPanel,
};
