import { Glob } from 'bun';
import { Card } from '../structures/Card';

const glob = new Glob('*.ts');
const imports = await Promise.all(
  [...glob.scanSync('./src/framework/cards')].map((f) => import(`../cards/${f}`)),
);

export default imports.map((i) => i.default).filter((c) => c instanceof Card);
