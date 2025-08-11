type Expires = {
  expiresAt: number; // milliseconds
};

export class MemorySession<K, V extends Expires> extends Map<K, V> {
  get(key: K) {
    const value = super.get(key);
    
    // checks expiration condition
    if (value && value.expiresAt !== 0 && value.expiresAt <= Date.now()) {
      super.delete(key);
      return undefined;
    }

    return value;
  }
}
