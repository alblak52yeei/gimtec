import { AlertCircle } from 'lucide-react';
import { ERROR_MESSAGES } from '../constants';

interface ErrorDisplayProps {
  error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="h-screen bg-gray-50 p-4">
      <div className="container mx-auto h-full">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">
          GIM Прогноз
        </h1>
        
        {/* Статус подключения */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-800">{ERROR_MESSAGES.CONNECTING}</span>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <p className="text-red-800 font-medium">{ERROR_MESSAGES.CONNECTION_ERROR}</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <p className="text-red-600 text-sm">
                {ERROR_MESSAGES.SERVER_CHECK}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 