'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'pointer-events-none block size-6 rounded-xl bg-transparent ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%+8px)] data-[state=unchecked]:translate-x-0 md:size-8 dark:data-[state=checked]:bg-transparent dark:data-[state=unchecked]:bg-transparent'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
