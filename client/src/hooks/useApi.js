import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * useApi — authenticated GET fetcher with loading / error states.
 *
 * @param {string|null} url  - API path (e.g. "/api/admin/stats").
 *                             Pass null to skip the initial fetch.
 * @returns {{ data, loading, error, refetch }}
 */
export function useApi(url) {
  const { authFetch } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res  = await authFetch(url);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json.data ?? json.stats ?? json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, authFetch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * apiPost — fire-and-forget POST/PUT/DELETE helper.
 */
export async function apiPost(authFetch, method = "POST", url, body) {
  const res  = await authFetch(url, { method, body: JSON.stringify(body) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json;
}
