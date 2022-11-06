import { Compiler } from './lib/Compiler';
import path from 'path';

const compiler = new Compiler({
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
});

compiler.run();