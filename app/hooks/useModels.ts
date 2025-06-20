import { useState, useEffect } from 'react';
import { modelsApi } from '../services/api';
import { ERROR_MESSAGES } from '../constants';
import type { Model } from '../types';

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await modelsApi.getModels();
        
        if (!data || data.length === 0) {
          throw new Error(ERROR_MESSAGES.EMPTY_MODELS);
        }
        
        setModels(data);
        
        // Автоматически выбираем первую модель
        const firstModel = data[0];
        setSelectedModel(firstModel.code);
        
      } catch (err: any) {
        console.error('Ошибка загрузки моделей:', err);
        setError(err.message || 'Ошибка загрузки моделей');
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  return {
    models,
    selectedModel,
    setSelectedModel,
    loading,
    error
  };
} 