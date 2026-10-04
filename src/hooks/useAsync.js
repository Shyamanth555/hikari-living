import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async fetcher and tracks { data, loading, error }.
 * Re-runs whenever any value in `deps` changes.
 *
 * @param {() => Promise<any>} fetcher
 * @param {any[]} deps
 */
export function useAsync(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: error?.response?.data?.message || error.message || 'Something went wrong',
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, refetch: run };
}
