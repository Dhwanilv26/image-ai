import { useSubscriptionModal } from '../store/use-subscription-modal';

export const usePayawall = () => {
  const subscripionModal = useSubscriptionModal();

  const shouldBlock = true;

  return {
    isLoading: false, // todo :fetch from react query
    shouldBlock,
    triggerPaywall: () => {
      subscripionModal.onOpen();
    },
  };
};
