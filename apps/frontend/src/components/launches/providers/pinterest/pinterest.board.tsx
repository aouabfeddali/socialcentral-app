import { FC, useEffect, useState } from 'react';
import { useCustomProviderFunction } from '@gitroom/frontend/components/launches/helpers/use.custom.provider.function';
import { Select } from '@gitroom/react/form/select';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';

export const PinterestBoard: FC<{
  name: string;
  onChange: (event: { target: { value: string; name: string } }) => void;
}> = (props) => {
  const { onChange, name } = props;
  const customFunc = useCustomProviderFunction();
  const [orgs, setOrgs] = useState<undefined|any[]>();
  const { getValues } = useSettings();
  const [currentMedia, setCurrentMedia] = useState<string|undefined>();

  const onChangeInner = (event: { target: { value: string, name: string } }) => {
    setCurrentMedia(event.target.value);
    onChange(event);
  };

  useEffect(() => {
    customFunc.get('boards').then((data) => setOrgs(data));
    const settings = getValues()[props.name];
    if (settings) {
      setCurrentMedia(settings);
    }
  }, []);

  if (!orgs) {
    return null;
  }

  if (!orgs.length) {
    return 'Geen boards gevonden, je moet eerst een board maken';
  }

  return (
    <Select name={name} label="Selecteer board" onChange={onChangeInner} value={currentMedia}>
      <option value="">--Selecteer--</option>
      {orgs.map((org: any) => (
        <option key={org.id} value={org.id}>
          {org.name}
        </option>
      ))}
    </Select>
  );
};
