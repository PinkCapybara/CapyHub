import { useState, useCallback } from 'react';

export const useApiMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mutationFn(params);
      setLoading(false);
      return response;
    } catch (err) {
      const message = err?.response?.data?.msg || err.message || 'Something went wrong.';
      setError(message);
      setLoading(false);
      throw err;
    }
  }, [mutationFn]);

  return { mutate, loading, error };
};
