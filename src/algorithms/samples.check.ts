/**
 * 各言語のサンプルコードを実際に動かして、出力が期待どおりか確かめる。
 *   npm run test:samples
 * 処理系が入っていない言語は飛ばす。
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { algorithms } from '.';
import { stripMarkers } from '../lib/code';
import type { LangId } from './types';

const has = (cmd: string) => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0;

const RUNNERS: Record<Exclude<LangId, 'pseudo'>, { tool: string; file: string; run: (dir: string, f: string) => string }> = {
  python: { tool: 'python3', file: 'main.py', run: (_d, f) => execFileSync('python3', [f], { encoding: 'utf8' }) },
  js: { tool: 'node', file: 'main.js', run: (_d, f) => execFileSync('node', [f], { encoding: 'utf8' }) },
  ruby: { tool: 'ruby', file: 'main.rb', run: (_d, f) => execFileSync('ruby', [f], { encoding: 'utf8' }) },
  perl: { tool: 'perl', file: 'main.pl', run: (_d, f) => execFileSync('perl', [f], { encoding: 'utf8' }) },
  cpp: {
    tool: 'g++',
    file: 'main.cpp',
    run: (d, f) => {
      const exe = join(d, 'a.out');
      execFileSync('g++', ['-std=c++17', '-Wall', '-Werror', '-o', exe, f]);
      return execFileSync(exe, { encoding: 'utf8' });
    },
  },
  rust: {
    tool: 'rustc',
    file: 'main.rs',
    run: (d, f) => {
      const exe = join(d, 'main');
      execFileSync('rustc', ['-D', 'warnings', '-o', exe, f]);
      return execFileSync(exe, { encoding: 'utf8' });
    },
  },
};

describe.each(Object.entries(RUNNERS))('%s', (lang, r) => {
  const ok = has(r.tool);
  it.skipIf(!ok).each(algorithms.map((a) => [a.id, a] as const))('%s', (_id, algo) => {
    const dir = mkdtempSync(join(tmpdir(), `visa-${lang}-`));
    const file = join(dir, r.file);
    writeFileSync(file, stripMarkers(algo.code[lang as LangId]));
    expect(r.run(dir, file).trim()).toBe(algo.expectedOutput);
  });

  // 画面ではサンプルの配列を選んだデータ（最良・最悪）に置きかえて見せるので、置きかえたコードも動くか確かめる
  const variants = algorithms.flatMap((a) =>
    (a.datasets ?? []).filter((d) => d.id !== 'standard').map((d) => [`${a.id} (${d.id})`, a, d.input] as const),
  );
  it.skipIf(!ok).each(variants)('%s', (_name, algo, input) => {
    const dir = mkdtempSync(join(tmpdir(), `visa-${lang}-`));
    const file = join(dir, r.file);
    const src = stripMarkers(algo.code[lang as LangId]);
    expect(src).toContain(algo.input.join(', '));
    writeFileSync(file, src.split(algo.input.join(', ')).join(input.join(', ')));
    expect(r.run(dir, file).trim()).toBe([...input].sort((x, y) => x - y).join(' '));
  });
});
