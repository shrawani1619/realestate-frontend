import toast from 'react-hot-toast';

const toastBase = {
  duration: 4000,
  style: {
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    maxWidth: '420px',
  },
};

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      ...toastBase,
      style: {
        ...toastBase.style,
        background: '#dcfce7',
        color: '#166534',
        border: '1px solid #bbf7d0',
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      ...toastBase,
      style: {
        ...toastBase.style,
        background: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #fecaca',
      },
    }),

  warning: (message: string) =>
    toast(message, {
      ...toastBase,
      icon: '⚠️',
      style: {
        ...toastBase.style,
        background: '#fef9c3',
        color: '#854d0e',
        border: '1px solid #fde68a',
      },
    }),

  info: (message: string) =>
    toast(message, {
      ...toastBase,
      icon: 'ℹ️',
      style: {
        ...toastBase.style,
        background: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #bfdbfe',
      },
    }),
};
