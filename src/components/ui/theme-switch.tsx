'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Switch } from '@/components/ui/switch';

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(theme === 'dark');

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      setIsDark(theme === 'dark');
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className='h-10 w-18 animate-pulse rounded-2xl bg-gray-200 md:h-12 md:w-22' />
    );
  }

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return (
    <div className='relative h-10 w-18 md:h-12 md:w-22'>
      {/* Track & Thumb */}
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        className='h-10 w-18 cursor-pointer rounded-2xl border border-[#DEDCDC] p-2 md:h-12 md:w-22 dark:border-neutral-900 dark:bg-neutral-950'
      />

      {/* Icon wrapper overlay */}
      <div className='pointer-events-none absolute inset-0 flex items-center justify-between p-2'>
        {/* Sun Icon */}
        <span className='flex size-6 items-center justify-center rounded-lg text-black md:size-8 dark:text-white'>
          <svg
            className='size-4 md:size-5'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clipPath='url(#clip0_29562_3668)'>
              <path
                d='M9.99935 1.66666V3.33333M9.99935 16.6667V18.3333M3.33268 10H1.66602M5.26111 5.26176L4.0826 4.08325M14.7376 5.26176L15.9161 4.08325M5.26111 14.7417L4.0826 15.9202M14.7376 14.7417L15.9161 15.9202M18.3327 10H16.666M14.166 10C14.166 12.3012 12.3005 14.1667 9.99935 14.1667C7.69816 14.1667 5.83268 12.3012 5.83268 10C5.83268 7.69881 7.69816 5.83333 9.99935 5.83333C12.3005 5.83333 14.166 7.69881 14.166 10Z'
                stroke='currentColor'
                strokeWidth='1.66667'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </g>
            <defs>
              <clipPath id='clip0_29562_3668'>
                <rect width='20' height='20' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </span>

        {/* Moon Icon */}
        <span className='bg-primary-100 flex size-6 items-center justify-center rounded-md text-white md:size-8 md:rounded-lg'>
          <svg
            className='size-4 md:size-5'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clipPath='url(#clip0_29562_3671)'>
              <path
                d='M18.2951 10.7972C17.1476 12.8099 14.982 14.1669 12.4993 14.1669C8.81745 14.1669 5.83268 11.1822 5.83268 7.50028C5.83268 5.01747 7.18991 2.85166 9.20291 1.70431C4.97414 2.10526 1.66602 5.66634 1.66602 10.0001C1.66602 14.6024 5.39698 18.3334 9.99935 18.3334C14.3329 18.3334 17.8938 15.0256 18.2951 10.7972Z'
                stroke='currentColor'
                strokeWidth='1.66667'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </g>
            <defs>
              <clipPath id='clip0_29562_3671'>
                <rect width='20' height='20' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </span>
      </div>
    </div>
  );
}
