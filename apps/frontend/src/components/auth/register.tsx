'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import Link from 'next/link';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { GithubProvider } from '@gitroom/frontend/components/auth/providers/github.provider';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingComponent } from '@gitroom/frontend/components/layout/loading';
import interClass from '@gitroom/react/helpers/inter.font';
import clsx from 'clsx';
import { GoogleProvider } from '@gitroom/frontend/components/auth/providers/google.provider';
import { useFireEvents } from '@gitroom/helpers/utils/use.fire.events';
import { useVariables } from '@gitroom/react/helpers/variable.context';

type Inputs = {
  email: string;
  password: string;
  company: string;
  providerToken: string;
  provider: string;
};

export function Register() {
  const getQuery = useSearchParams();
  const fetch = useFetch();
  const [provider] = useState(getQuery?.get('provider')?.toUpperCase());
  const [code, setCode] = useState(getQuery?.get('code') || '');
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (provider && code) {
      load();
    }
  }, []);

  const load = useCallback(async () => {
    const { token } = await (
      await fetch(`/auth/oauth/${provider?.toUpperCase() || 'LOCAL'}/exists`, {
        method: 'POST',
        body: JSON.stringify({ code }),
      })
    ).json();

    if (token) {
      setCode(token);
      setShow(true);
    }
  }, [provider, code]);

  if (!code && !provider) {
    return <RegisterAfter token="" provider="LOCAL" />;
  }

  if (!show) {
    return <LoadingComponent />;
  }

  return (
    <RegisterAfter token={code} provider={provider?.toUpperCase() || 'LOCAL'} />
  );
}

function getHelpfulReasonForRegistrationFailure(httpCode: number) {
  switch (httpCode) {
    case 400:
      return 'E-mail bestaat al';
    case 404:
      return 'Je browser kreeg een 404 bij het proberen contact op te nemen met de API. Mogelijke oorzaken zijn een onjuiste instelling van NEXT_PUBLIC_BACKEND_URL of dat de backend niet draait.';
  }

  return 'Onverwerkte fout: ' + httpCode;
}

export function RegisterAfter({
  token,
  provider,
}: {
  token: string;
  provider: string;
}) {
  const {isGeneral} = useVariables();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fireEvents = useFireEvents();

  const isAfterProvider = useMemo(() => {
    return !!token && !!provider;
  }, [token, provider]);

  const resolver = useMemo(() => {
    return classValidatorResolver(CreateOrgUserDto);
  }, []);

  const form = useForm<Inputs>({
    resolver,
    defaultValues: {
      providerToken: token,
      provider: provider,
    },
  });

  const fetchData = useFetch();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    await fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data }),
    }).then((response) => {
      setLoading(false);

      if (response.status === 200) {
        fireEvents('register')

        if (response.headers.get('activate') === "true") {
          router.push('/auth/activate');
        } else {
          router.push('/auth/login');
        }
      } else {
        form.setError('email', {
          message: getHelpfulReasonForRegistrationFailure(response.status),
        });
      }
    }).catch(e => {
      form.setError("email", {
        message: 'Algemene fout: ' + e.toString() + '. Controleer je browserconsole.',
      });
    })
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <h1 className="text-3xl font-bold text-left mb-4 cursor-pointer">
          Registreer
          </h1>
        </div>
        {!isAfterProvider && (!isGeneral ? <GithubProvider /> : <GoogleProvider />)}
        {!isAfterProvider && (
          <div className="h-[20px] mb-[24px] mt-[24px] relative">
            <div className="absolute w-full h-[1px] bg-fifth top-[50%] -translate-y-[50%]" />
            <div
              className={`absolute z-[1] ${interClass} justify-center items-center w-full left-0 top-0 flex`}
            >
              <div className="bg-customColor15 px-[16px]">OF</div>
            </div>
          </div>
        )}
        <div className="text-textColor">
          {!isAfterProvider && (
            <>
              <Input
                label="E-mail"
                {...form.register('email')}
                type="email"
                placeholder="E-mailadres"
              />
              <Input
                label="Wachtwoord"
                {...form.register('password')}
                autoComplete="off"
                type="password"
                placeholder="Wachtwoord"
              />
            </>
          )}
          <Input
            label="Bedrijf"
            {...form.register('company')}
            autoComplete="off"
            type="text"
            placeholder="Bedrijf"
          />
        </div>
        <div className={clsx('text-[12px]', interClass)}>
        Door je te registreren ga je akkoord met onze{' '}
          <a
            href={`https://postiz.com/terms`}
            className="underline hover:font-bold"
          >
            Algemene Voorwaarden
          </a>{' '}
          en{' '}
          <a
            href={`https://postiz.com/privacy`}
            className="underline hover:font-bold"
          >
            Privacybeleid
          </a>
        </div>
        <div className="text-center mt-6">
          <div className="w-full flex">
            <Button type="submit" className="flex-1 rounded-[4px]" loading={loading}>
            Account aanmaken
            </Button>
          </div>
          <p className="mt-4 text-sm">
          Heb je al een account?{' '}
            <Link href="/auth/login" className="underline  cursor-pointer">
              {' '}
              Inloggen
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
