'use client';
import { SubscriptionModal } from '@/features/subscriptions/components/subscription-modal';
import { FailModal } from '@/features/subscriptions/components/fail-modal';
import { SuccessModal } from '@/features/subscriptions/components/success-modal';
import { useState, useEffect } from 'react';

export const Modals = () => {
  // integrating all modals with zustand can cause hydration errors .. so wrapping all of the modals under one fragment and then implementing them

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // useeffect only runs on the client side.. ssr is stopped and then hydration errors cant exist
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <FailModal />
      <SuccessModal />
      <SubscriptionModal />
    </>
  );
};
