import { useState } from 'react';
import type { Dataset, DatasetId } from '../algorithms/types';
import { DATASET_LABEL } from '../algorithms/sortInput';
import { CustomInput } from './CustomInput';

/** 整列するデータ（標準・最良・最悪・任意）を選ぶ */
export function DataPicker({
  datasets,
  current,
  input,
  custom,
  onSelect,
  onCustom,
}: {
  datasets: Dataset[];
  current: DatasetId;
  input: number[];
  custom?: number[];
  onSelect: (d: DatasetId) => void;
  onCustom: (values: number[]) => void;
}) {
  // 「任意」を押しただけでは入力欄を開くだけ。データを確定したら custom になる
  const [editing, setEditing] = useState(false);
  const showForm = current === 'custom' || editing;
  const ids: DatasetId[] = [...datasets.map((d) => d.id), 'custom'];
  return (
    <div className="data-picker">
      <span className="data-picker-label">データ</span>
      <div className="speed" role="radiogroup" aria-label="整列するデータ">
        {ids.map((id) => {
          const on = id === 'custom' ? showForm : id === current && !editing;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={on}
              className={on ? 'on' : ''}
              onClick={() => {
                if (id === 'custom') {
                  if (custom) onSelect('custom');
                  else setEditing(true);
                } else {
                  setEditing(false);
                  onSelect(id);
                }
              }}
            >
              {DATASET_LABEL[id]}
            </button>
          );
        })}
      </div>
      {!showForm && <code className="data-picker-values">{'{' + input.join(', ') + '}'}</code>}
      {showForm && (
        <CustomInput
          initial={custom ?? input}
          onApply={(v) => {
            setEditing(false);
            onCustom(v);
          }}
        />
      )}
    </div>
  );
}
