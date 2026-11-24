export const secureStorage = {
    setItem(key: string, value: any) {
      try {
        const jsonStr = JSON.stringify(value);
        const encoded = btoa(encodeURIComponent(jsonStr));
        localStorage.setItem(key, `enc_${encoded}`);
      } catch (e) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    getItem(key: string) {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        if (item.startsWith("enc_")) {
          const base64 = item.replace("enc_", "");
          const jsonStr = decodeURIComponent(atob(base64));
          return JSON.parse(jsonStr);
        }
        // Fallback for legacy plaintext items
        return JSON.parse(item);
      } catch (e) {
        // If parsing fails or unencrypted string
        try {
          return JSON.parse(localStorage.getItem(key) || "null");
        } catch (err) {
          return null;
        }
      }
    },
    removeItem(key: string) {
      localStorage.removeItem(key);
    }
  };