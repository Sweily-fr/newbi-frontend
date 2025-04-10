import { useCallback } from 'react';
import { Notification } from '../components/feedback';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

export const useNotification = () => {
  const showNotification = useCallback((message: string, type: NotificationType = 'info', duration = 5000) => {
    switch (type) {
      case 'success':
        Notification.success(message, { duration, position: 'bottom-left' });
        break;
      case 'error':
        Notification.error(message, { duration, position: 'bottom-left' });
        break;
      case 'warning':
        Notification.warning(message, { duration, position: 'bottom-left' });
        break;
      case 'info':
      default:
        Notification.info(message, { duration, position: 'bottom-left' });
        break;
    }
  }, []);

  return { showNotification };
};

export default useNotification;
