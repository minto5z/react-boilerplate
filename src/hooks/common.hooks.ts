import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/helpers';

// Hook for managing local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}

// Hook for debounced values
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for managing boolean state (toggles, modals, etc.)
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse, setValue };
}

// Hook for managing async operations
export function useAsync<T, E = any>() {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<E | undefined>(undefined);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setLoading(true);
    setError(undefined);
    
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err as E);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Hook for handling click outside of element
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);

  return ref;
}

// Hook for pagination
export function usePagination(initialPage: number = 1, initialLimit: number = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage(p => p + 1), []);
  const prevPage = useCallback(() => setPage(p => Math.max(1, p - 1)), []);
  const goToPage = useCallback((newPage: number) => setPage(Math.max(1, newPage)), []);
  const reset = useCallback(() => setPage(initialPage), [initialPage]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    reset,
  };
}

// Hook for managing search functionality
export function useSearch(initialValue: string = '', delay: number = 300) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);

  const debouncedSetSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, delay),
    [delay]
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, []);

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    clearSearch,
  };
}

// Hook for managing form state
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const setError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouchedState(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  }, [initialValues]);

  const handleChange = useCallback((name: keyof T) => (value: any) => {
    setValue(name, value);
  }, [setValue]);

  const handleBlur = useCallback((name: keyof T) => () => {
    setTouched(name, true);
  }, [setTouched]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setTouched,
    reset,
    handleChange,
    handleBlur,
  };
}

// Hook for copying text to clipboard
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      
      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
      
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      setIsCopied(false);
      return false;
    }
  };

  return { copiedText, isCopied, copy };
}