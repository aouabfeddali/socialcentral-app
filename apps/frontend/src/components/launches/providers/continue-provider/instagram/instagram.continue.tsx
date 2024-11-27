import { FC, useCallback, useMemo, useState } from 'react';
import { useCustomProviderFunction } from '@gitroom/frontend/components/launches/helpers/use.custom.provider.function';
import useSWR from 'swr';
import clsx from 'clsx';
import { Button } from '@gitroom/react/form/button';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import { useIntegration } from '@gitroom/frontend/components/launches/helpers/use.integration';

export const InstagramContinue: FC<{
  closeModal: () => void;
  existingId: string[];
}> = (props) => {
  const { closeModal, existingId } = props;
  const call = useCustomProviderFunction();
  const { integration } = useIntegration();
  const [page, setSelectedPage] = useState<null | {
    id: string;
    pageId: string;
  }>(null);
  const fetch = useFetch();

  const loadPages = useCallback(async () => {
    try {
      const pages = await call.get('pages');
      return pages;
    } catch (e) {
      closeModal();
    }
  }, []);

  const setPage = useCallback(
    (param: { id: string; pageId: string }) => () => {
      setSelectedPage(param);
    },
    []
  );

  const { data, isLoading } = useSWR('load-pages', loadPages, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const saveInstagram = useCallback(async () => {
    await fetch(`/integrations/instagram/${integration?.id}`, {
      method: 'POST',
      body: JSON.stringify(page),
    });

    closeModal();
  }, [integration, page]);

  const filteredData = useMemo(() => {
    return (
      data?.filter((p: { id: string }) => !existingId.includes(p.id)) || []
    );
  }, [data]);

  if (!isLoading && !data?.length) {
    return (
      <div className="text-center flex justify-center items-center text-[18px] leading-[50px] h-[300px]">
       We konden geen bedrijf vinden dat is gekoppeld aan de geselecteerde pagina's.
        <br />
        We raden je aan om alle pagina's en bedrijven te koppelen.
        <br />
        Sluit dit venster, verwijder je integratie en voeg opnieuw een kanaal toe.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <div>Selecteer Instagram-account:</div>
      <div className="grid grid-cols-3 justify-items-center select-none cursor-pointer">
        {filteredData?.map(
          (p: {
            id: string;
            pageId: string;
            username: string;
            name: string;
            picture: { data: { url: string } };
          }) => (
            <div
              key={p.id}
              className={clsx(
                'flex flex-col w-full text-center gap-[10px] border border-input p-[10px] hover:bg-seventh',
                page?.id === p.id && 'bg-seventh'
              )}
              onClick={setPage(p)}
            >
              <div>
                <img
                  className="w-full"
                  src={p.picture.data.url}
                  alt="profile"
                />
              </div>
              <div>{p.name}</div>
            </div>
          )
        )}
      </div>
      <div>
        <Button disabled={!page} onClick={saveInstagram}>
        Opslaan
        </Button>
      </div>
    </div>
  );
};
