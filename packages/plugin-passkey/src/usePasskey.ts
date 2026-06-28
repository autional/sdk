export interface UsePasskeyReturn {
  isAvailable: boolean;
  isSupported: boolean;
}

export function usePasskey(): UsePasskeyReturn {
  const isSupported =
    typeof window !== 'undefined' && !!window.PublicKeyCredential;

  return {
    isAvailable: isSupported,
    isSupported,
  };
}
