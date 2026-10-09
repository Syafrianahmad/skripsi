// localStorage can throw (private mode, blocked site data) or be missing; never let it break the page.
export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore: the choice just won't persist
  }
}
