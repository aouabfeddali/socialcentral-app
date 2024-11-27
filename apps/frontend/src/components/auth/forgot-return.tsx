'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import Link from 'next/link';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { useMemo, useState } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { ForgotReturnPasswordDto } from '@gitroom/nestjs-libraries/dtos/auth/forgot-return.password.dto';

type Inputs = {
  password: string;
  repeatPassword: string;
  token: string;
};

export function ForgotReturn({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(false);

  const resolver = useMemo(() => {
    return classValidatorResolver(ForgotReturnPasswordDto);
  }, []);

  const form = useForm<Inputs>({
    resolver,
    mode: 'onChange',
    defaultValues: {
      token,
    },
  });

  const fetchData = useFetch();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const {reset} = await (await fetchData('/auth/forgot-return', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
    })).json();

    setState(true);

    if (!reset) {
      form.setError('password', {
        type: 'manual',
        message: 'Je wachtwoordresetlink is verlopen. Probeer het opnieuw.',
      });

      return false;
    }
    setLoading(false);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h1 className="text-3xl font-bold text-left mb-4 cursor-pointer">
          Wachtwoord Vergeten
          </h1>
        </div>
        {!state ? (
          <>
            <div className="space-y-4 text-textColor">
              <Input
                label="Nieuw Wachtwoord"
                {...form.register('password')}
                type="password"
                placeholder="Wachtwoord"
              />
              <Input
                label="Herhaal Wachtwoord"
                {...form.register('repeatPassword')}
                type="password"
                placeholder="Herhaal Wachtwoord"
              />
            </div>
            <div className="text-center mt-6">
              <div className="w-full flex">
                <Button type="submit" className="flex-1" loading={loading}>
                Wijzig Wachtwoord
                </Button>
              </div>
              <p className="mt-4 text-sm">
                <Link href="/auth/login" className="underline cursor-pointer">
                  {' '}
                  Ga terug naar inloggen
                </Link>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-left mt-6">
            Je wachtwoord is succesvol gereset. Je kunt nu inloggen met je
            </div>
            <p className="mt-4 text-sm">
              <Link href="/auth/login" className="underline cursor-pointer">
                {' '}
                Ga terug naar inloggen
              </Link>
            </p>
          </>
        )}
      </form>
    </FormProvider>
  );
}
