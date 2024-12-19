import { useSubscriptionModal } from '../store/use-subscription-modal';

import { useGetSubscription } from '../api/use-get-subscription';

export const usePayawall = () => {
  const { data: subscription, isLoading: isLoadingSubscription } =
    useGetSubscription();
  const subscripionModal = useSubscriptionModal();

  const shouldBlock = isLoadingSubscription || !subscription?.active;
  // blocking if no subscription exists or the subscription has expired

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    triggerPaywall: () => {
      subscripionModal.onOpen();
    },
  };
};
