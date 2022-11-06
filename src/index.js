import { sayHello as sayHello1 } from './demo1';
import { sayHello as sayHello2 } from './demo2';

setTimeout(() => {
  sayHello1();
}, 1000);

setTimeout(() => {
  sayHello2();
}, 2000);