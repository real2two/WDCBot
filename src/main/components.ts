import { Component } from '@httpi/client';
import { Glob } from 'bun';

const glob = new Glob('*.ts');
const imports = await Promise.all(
  [...glob.scanSync('./src/components')].map((f) => import(`../components/${f}`)),
);

export default imports.map((i) => i.default).filter((c) => c instanceof Component);
