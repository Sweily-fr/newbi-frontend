import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { 
  CREATE_STRIPE_CONNECT_ACCOUNT, 
  GENERATE_STRIPE_ONBOARDING_LINK,
  CHECK_STRIPE_CONNECT_ACCOUNT_STATUS
} from '../graphql/stripe-connect-mutations';
import { logger } from '../../../utils/logger';

export interface StripeConnectStatus {
  isOnboarded: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  accountId: string | null;
}

export const useStripeConnect = () => {
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const [stripeAccountStatus, setStripeAccountStatus] = useState<{
    isOnboarded: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mutation pour créer un compte Stripe Connect
  const [createStripeConnectAccount, { loading: creatingAccount }] = useMutation(CREATE_STRIPE_CONNECT_ACCOUNT, {
    onCompleted: (data) => {
      if (data.createStripeConnectAccount.success) {
        setStripeAccountId(data.createStripeConnectAccount.accountId);
        return data.createStripeConnectAccount.accountId;
      } else {
        const errorMessage = data.createStripeConnectAccount.message || 'Une erreur est survenue lors de la création du compte Stripe Connect';
        setError(errorMessage);
        logger.error(errorMessage);
        return null;
      }
    },
    onError: (error) => {
      const errorMessage = 'Une erreur est survenue lors de la création du compte Stripe Connect';
      setError(errorMessage);
      logger.error('Erreur lors de la création du compte Stripe Connect:', error);
      return null;
    }
  });

  // Mutation pour générer un lien d'onboarding Stripe
  const [generateOnboardingLink, { loading: generatingLink }] = useMutation(GENERATE_STRIPE_ONBOARDING_LINK, {
    onCompleted: (data) => {
      if (data.generateStripeOnboardingLink.success && data.generateStripeOnboardingLink.url) {
        return data.generateStripeOnboardingLink.url;
      } else {
        const errorMessage = data.generateStripeOnboardingLink.message || 'Une erreur est survenue lors de la génération du lien d\'onboarding';
        setError(errorMessage);
        logger.error(errorMessage);
        return null;
      }
    },
    onError: (error) => {
      const errorMessage = 'Une erreur est survenue lors de la génération du lien d\'onboarding';
      setError(errorMessage);
      logger.error('Erreur lors de la génération du lien d\'onboarding:', error);
      return null;
    }
  });

  // Mutation pour vérifier le statut du compte Stripe Connect
  const [checkStripeConnectStatus, { loading: checkingStatus }] = useMutation(CHECK_STRIPE_CONNECT_ACCOUNT_STATUS, {
    onCompleted: (data) => {
      if (data.checkStripeConnectAccountStatus.success) {
        const status = {
          isOnboarded: data.checkStripeConnectAccountStatus.isOnboarded,
          payoutsEnabled: data.checkStripeConnectAccountStatus.payoutsEnabled,
          chargesEnabled: data.checkStripeConnectAccountStatus.chargesEnabled
        };
        setStripeAccountStatus(status);
        return status;
      } else {
        const errorMessage = data.checkStripeConnectAccountStatus.message || 'Une erreur est survenue lors de la vérification du statut du compte Stripe';
        setError(errorMessage);
        logger.error(errorMessage);
        return null;
      }
    },
    onError: (error) => {
      const errorMessage = 'Une erreur est survenue lors de la vérification du statut du compte Stripe';
      setError(errorMessage);
      logger.error('Erreur lors de la vérification du statut du compte Stripe:', error);
      return null;
    }
  });

  const createAccount = async () => {
    setError(null);
    try {
      const result = await createStripeConnectAccount();
      return result?.data?.createStripeConnectAccount?.accountId || null;
    } catch (err) {
      logger.error('Erreur lors de la création du compte Stripe Connect:', err);
      setError('Une erreur est survenue lors de la création du compte Stripe Connect');
      return null;
    }
  };

  const getOnboardingLink = async (accountId: string, returnUrl: string) => {
    setError(null);
    try {
      const result = await generateOnboardingLink({
        variables: {
          accountId,
          returnUrl
        }
      });
      return result?.data?.generateStripeOnboardingLink?.url || null;
    } catch (err) {
      logger.error('Erreur lors de la génération du lien d\'onboarding:', err);
      setError('Une erreur est survenue lors de la génération du lien d\'onboarding');
      return null;
    }
  };

  const checkAccountStatus = async (accountId: string) => {
    setError(null);
    try {
      const result = await checkStripeConnectStatus({
        variables: {
          accountId
        }
      });
      
      if (result?.data?.checkStripeConnectAccountStatus?.success) {
        const status = {
          isOnboarded: result.data.checkStripeConnectAccountStatus.isOnboarded,
          payoutsEnabled: result.data.checkStripeConnectAccountStatus.payoutsEnabled,
          chargesEnabled: result.data.checkStripeConnectAccountStatus.chargesEnabled
        };
        setStripeAccountStatus(status);
        return status;
      }
      return null;
    } catch (err) {
      logger.error('Erreur lors de la vérification du statut du compte Stripe:', err);
      setError('Une erreur est survenue lors de la vérification du statut du compte Stripe');
      return null;
    }
  };

  const startOnboardingFlow = async (returnUrl: string = `${window.location.origin}/file-transfer`) => {
    let accountId = stripeAccountId;
    
    // Si nous n'avons pas encore d'ID de compte, en créer un
    if (!accountId) {
      accountId = await createAccount();
      if (!accountId) return null;
    }
    
    // Générer le lien d'onboarding
    const onboardingUrl = await getOnboardingLink(accountId, returnUrl);
    if (onboardingUrl) {
      // Rediriger l'utilisateur vers le lien d'onboarding Stripe
      window.location.href = onboardingUrl;
      return true;
    }
    
    return false;
  };

  return {
    stripeAccountId,
    stripeAccountStatus,
    error,
    loading: creatingAccount || generatingLink || checkingStatus,
    createAccount,
    getOnboardingLink,
    checkAccountStatus,
    startOnboardingFlow,
    setStripeAccountId
  };
};
