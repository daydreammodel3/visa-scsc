import { useId, useState } from 'react';
import { CUSTOM_MAX_COUNT, CUSTOM_MAX_VALUE, CUSTOM_MIN_COUNT, CUSTOM_MIN_VALUE, parseCustom } from '../lib/customData';

interface Props {
  initial: number[];
  onApply: (values: number[]) => void;
}

/** 任意データの入力欄（カンマ区切り） */
export function CustomInput({ initial, onApply }: Props) {
  const [text, setText] = useState(initial.join(', '));
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  const apply = () => {
    const r = parseCustom(text);
    if (r.ok) {
      setError(null);
      setText(r.values.join(', '));
      onApply(r.values);
    } else setError(r.error);
  };
  return (
    <form
      className="custom-input"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <label htmlFor={id}>
        {CUSTOM_MIN_VALUE}〜{CUSTOM_MAX_VALUE} の整数を {CUSTOM_MIN_COUNT}〜{CUSTOM_MAX_COUNT} 個、カンマ区切りで
      </label>
      <div className="custom-input-row">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-invalid={error !== null}
          aria-describedby={error ? `${id}-err` : undefined}
          placeholder="例: 9, 4, 7, 1"
        />
        <button type="submit">このデータで整列</button>
      </div>
      {error && (
        <p className="custom-error" id={`${id}-err`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
