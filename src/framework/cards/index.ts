import { Glob } from 'bun';
import { Card } from '../structures';

const glob = new Glob('**/*.ts');
const imports = await Promise.all(
  [...glob.scanSync('./src/framework/cards')]
    .filter((f) => f !== 'index.ts')
    .map((f) => import(`./${f}`)),
);

export const cards = imports.map((i) => i.default).filter((c) => c instanceof Card);
