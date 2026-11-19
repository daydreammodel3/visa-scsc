import type { Algorithm } from '../types';
import { Recorder } from '../recorder';
import pseudo from './code/main.pseudo?raw';
import python from './code/main.py?raw';
import js from './code/main.js?raw';
import cpp from './code/main.cpp?raw';
import rust from './code/main.rs?raw';
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

const N = 4;

export function traceFactorial(n0: number) {
  const r = new Recorder([]);
  r.frames = [];
  const CALLS = '呼び出し回数';
  const DEPTH = '最大の深さ';
  r.stats[CALLS] = 0;
  r.stats[DEPTH] = 0;

  const fact = (n: number): number => {
    r.call(() => `factorial(${n})`, n);
    r.count(CALLS);
    r.stats[DEPTH] = Math.max(r.stats[DEPTH], r.frames!.length);
    const vars = (ret: number | null = null) => [
      { name: 'n', value: n },
      { name: '戻り値', value: ret },
    ];
    const depth = r.frames!.length;
    r.push({
      point: 'call',
      vars: vars(),
      text: () =>
        depth === 1
          ? `factorial(${n}) を呼び出します。コールスタックに 1 段目が積まれます。`
          : `factorial(${n}) が呼び出され、コールスタックに新しい段が積まれました（${depth} 段目）。n はこの段だけの変数です。`,
    });
    const base = n <= 1;
    r.push({
      point: 'base',
      vars: vars(),
      text: () => (base ? `n = ${n} ≦ 1。ここが「終わりの条件（基底）」です。` : `n = ${n} は 1 より大きいので、もう 1 段もぐります。`),
    });
    if (base) {
      r.setTop({ ret: 1, state: 'returning' });
      r.push({
        point: 'ret1',
        vars: vars(1),
        text: () => `1 を返します。ここから、待っていた段へ順に戻っていきます。`,
      });
      r.ret();
      return 1;
    }
    r.setTop({ note: () => `${n} × factorial(${n - 1}) の結果を待っています` });
    r.push({
      point: 'rec',
      vars: vars(),
      text: () => `${n} × factorial(${n - 1}) を計算するには、まず factorial(${n - 1}) の結果が必要です。この段は途中のまま待ちます。`,
    });
    const v = fact(n - 1);
    const result = n * v;
    r.setTop({ ret: result, state: 'returning', note: () => `${n} × ${v} = ${result}` });
    r.push({
      point: 'ret',
      vars: vars(result),
      text: () => `factorial(${n - 1}) から ${v} が返ってきました。${n} × ${v} = ${result} を返します。`,
    });
    r.ret();
    return result;
  };

  const ans = fact(n0);
  const calls = r.stats[CALLS];
  r.push({
    point: null,
    vars: [{ name: '結果', value: ans }],
    text: () => `factorial(${n0}) = ${ans}。関数は ${calls} 回呼び出され、すべての段が片付きました。`,
  });
  return r.steps;
}

export const recursion: Algorithm = {
  id: 'recursion',
  name: '再帰（階乗）',
  en: 'Recursion',
  category: '再帰',
  level: 2,
  tagline: '関数が自分自身を呼び出して、小さな問題に分けて解く',
  intro: [
    'n の階乗 n! = n × (n-1) × … × 1 は、「n × (n-1)!」と、ひとまわり小さな階乗を使って表せます。',
    'そこで factorial(n) の中で factorial(n-1) を呼び出します。呼び出すたびにコールスタックに段が積まれ、n ≦ 1 になったら積むのをやめて、上の段から順に答えを返していきます。',
  ],
  examPoints: [
    '終わりの条件（基底）がないと、呼び出しが止まらない',
    '呼び出された段ごとに、引数やローカル変数は別々に存在する',
    'トレース問題では「どの順に呼ばれ、どの順に返るか」を表に書くと確実',
    'factorial(n) の呼び出し回数は n 回、コールスタックの深さも最大 n 段',
  ],
  complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', note: '呼び出しの深さに比例して、メモリ（コールスタック）も O(n) 使う' },
  input: [N],
  view: { indices: false },
  trace: () => traceFactorial(N),
  expectedOutput: '24',
  code: { pseudo, python, js, cpp, rust, ruby, perl },
};
