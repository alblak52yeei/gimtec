import { MetricsChart } from './ui/MetricsChart';
import { ERROR_MESSAGES } from '../constants';
import type { ModelMetrics } from '../types';

interface MetricsSectionProps {
  metrics: ModelMetrics | null;
  selectedForecastDate?: string;
}

export function MetricsSection({ metrics, selectedForecastDate }: MetricsSectionProps) {
  if (!metrics || !metrics.dates || metrics.dates.length === 0) {
    return (
      <div className="flex-shrink-0 mt-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 text-center">{ERROR_MESSAGES.NO_METRICS}</p>
      </div>
    );
  }

  const hasMetrics = metrics.mae.some(val => val !== null && val !== undefined && !isNaN(val)) ||
                    metrics.mape.some(val => val !== null && val !== undefined && !isNaN(val)) ||
                    metrics.rmse.some(val => val !== null && val !== undefined && !isNaN(val));

  if (!hasMetrics) {
    return (
      <div className="flex-shrink-0 mt-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-gray-500 text-center">{ERROR_MESSAGES.NO_METRICS}</p>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 h-64 mt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        <div className="bg-white rounded-lg shadow-sm p-2">
          <MetricsChart metrics={metrics} title="MAE" selectedDate={selectedForecastDate} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-2">
          <MetricsChart metrics={metrics} title="MAPE" selectedDate={selectedForecastDate} />
        </div>
        <div className="bg-white rounded-lg shadow-sm p-2">
          <MetricsChart metrics={metrics} title="RMSE" selectedDate={selectedForecastDate} />
        </div>
      </div>
    </div>
  );
} 