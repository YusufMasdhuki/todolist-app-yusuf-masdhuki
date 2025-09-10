// utils/toastHelper.ts
import { toast } from 'sonner';

export const successToast = (message: string) => {
  toast(message, {
    unstyled: true,
    icon: null,
    className:
      'bg-accent-green text-white text-sm flex justify-between items-center shadow-lg rounded-md px-3 py-2 gap-3 min-h-10 w-full md:min-w-66.5',
    action: {
      label: '✕',
      onClick: () => toast.dismiss(),
    },
    actionButtonStyle: {
      background: 'transparent',
      color: 'white',
      fontSize: '16px',
    },
  });
};

export const errorToast = (message: string) => {
  toast(message, {
    unstyled: true,
    icon: null,
    className:
      'bg-accent-red text-white text-sm flex justify-between items-center shadow-lg rounded-md px-3 py-2 min-h-10 md:min-w-66.5 w-full',
    action: {
      label: '✕',
      onClick: () => toast.dismiss(),
    },
    actionButtonStyle: {
      background: 'transparent',
      color: 'white',
      fontSize: '16px',
    },
  });
};
