import { sayHello as sayHello1 } from './demo1.js';
import { sayHello as sayHello2 } from './demo2.js';

setTimeout(() => {
  sayHello1();
}, 1000);

setTimeout(() => {
  sayHello2();
}, 2000);