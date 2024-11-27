'use client';

import { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import interClass from '@gitroom/react/helpers/inter.font';
import { useVariables } from '@gitroom/react/helpers/variable.context';

const useFaqList = () => {
  const {isGeneral} = useVariables();
  return [
    {
      title: `Kan ik ${isGeneral ? 'Smart Create' : 'Gitroom'} vertrouwen?`,
      description: `${isGeneral ? 'Smart Create' : 'Gitroom'} is trots onderdeel van Mestanza Group! ${isGeneral ? 'Smart Create' : 'Gitroom'} is bestaan uit de behoefte om zakelijke behoeftes zoals social media management simpel te stroomlijnen. Deze software is ontwikkeld uit een open-source bron, en zal hierdoor altijd vrij zijn van gevaar voor de eindgebruiker.`,
    },
    {
      title: 'Wat zijn kanalen?',
      description: `${
        isGeneral ? 'Smart Create' : 'Gitroom'
      } stelt je in staat om je berichten in te plannen tussen verschillende kanalen.
Een kanaal is een publicatieplatform waarop je berichten kunt plannen.
Bijvoorbeeld, je kunt berichten plannen op X, Facebook, Instagram, TikTok, YouTube, Reddit, LinkedIn, Dribbble, Threads en Pinterest.`,
    },
    {
      title: 'Wat zijn teamleden?',
      description: `Als je een team hebt met meerdere leden, kun je ze uitnodigen om samen te werken in je werkruimte en hun persoonlijke kanalen toe te voegen.`,
    },
    {
      title: 'Wat is AI-autocomplete?',
      description: `We gebruiken OpenAI-API om je te helpen met het schrijven van sociale berichten en artikelen.`,
    },
  ];
}

export const FAQSection: FC<{ title: string; description: string }> = (
  props
) => {
  const { title, description } = props;
  const [show, setShow] = useState(false);

  const changeShow = useCallback(() => {
    setShow(!show);
  }, [show]);

  return (
    <div
      className="bg-sixth p-[24px] border border-tableBorder rounded-[4px] flex flex-col"
      onClick={changeShow}
    >
      <div
        className={`text-[20px] ${interClass} cursor-pointer flex justify-center`}
      >
        <div className="flex-1">{title}</div>
        <div className="flex items-center justify-center w-[32px]">
          {!show ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 12.75H6C5.59 12.75 5.25 12.41 5.25 12C5.25 11.59 5.59 11.25 6 11.25H18C18.41 11.25 18.75 11.59 18.75 12C18.75 12.41 18.41 12.75 18 12.75Z"
                fill="white"
              />
              <path
                d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V6C11.25 5.59 11.59 5.25 12 5.25C12.41 5.25 12.75 5.59 12.75 6V18C12.75 18.41 12.41 18.75 12 18.75Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M24 17H8C7.45333 17 7 16.5467 7 16C7 15.4533 7.45333 15 8 15H24C24.5467 15 25 15.4533 25 16C25 16.5467 24.5467 17 24 17Z"
                fill="#ECECEC"
              />
            </svg>
          )}
        </div>
      </div>
      <div
        className={clsx(
          'transition-all duration-500 overflow-hidden',
          !show ? 'max-h-[0]' : 'max-h-[500px]'
        )}
      >
        <pre
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`mt-[16px] w-full text-wrap ${interClass} font-[400] text-[16px] text-customColor17 select-text`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
};

export const FAQComponent: FC = () => {
  const list = useFaqList();
  return (
    <div>
      <h3 className="text-[24px] text-center mt-[81px] mb-[40px]">
      Veelgestelde Vragen
      </h3>
      <div className="gap-[24px] flex-col flex select-none">
        {list.map((item, index) => (
          <FAQSection key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
