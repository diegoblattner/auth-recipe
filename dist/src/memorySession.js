export class MemorySession extends Map {
    get(key) {
        const value = super.get(key);
        // checks expiration condition
        if (value && value.expiresAt !== 0 && value.expiresAt <= Date.now()) {
            super.delete(key);
            return undefined;
        }
        return value;
    }
}
