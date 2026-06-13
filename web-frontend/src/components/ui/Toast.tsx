import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string) => {
      toast.success(message, {
        duration: 4000,
      });
    },
    error: (message: string) => {
      toast.error(message, {
        duration: 4000,
      });
    },
    info: (message: string) => {
      toast(message, {
        duration: 4000,
        icon: 'ℹ️',
      });
    },
  };
};
