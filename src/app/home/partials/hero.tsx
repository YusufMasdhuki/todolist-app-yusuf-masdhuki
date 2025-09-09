'use client';
import React from 'react';

import { ThemeSwitch } from '@/components/ui/theme-switch';

const Hero = () => {
  return (
    <div className='mb-4 flex w-full items-center justify-between md:mb-5'>
      <div className='flex flex-col gap-0.5 md:gap-2'>
        <h1 className='dark:text-neutral-25 md:text-display-sm text-xl font-bold text-neutral-950'>
          What’s on Your Plan Today?
        </h1>
        <p className='md:text-md text-sm text-neutral-500 dark:text-neutral-400'>
          Your productivity starts now.
        </p>
      </div>
      <div>
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Hero;
