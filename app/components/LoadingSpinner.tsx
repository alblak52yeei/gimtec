import { ERROR_MESSAGES } from '../constants';

export function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">{ERROR_MESSAGES.LOADING}</p>
      </div>
    </div>
  );
} 