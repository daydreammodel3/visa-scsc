/** localStorage が使えない環境（プライベートモードなど）でも落ちないようにする */
export function load(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function save(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* 保存できなくても動作には影響しない */
  }
}
