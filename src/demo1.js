import { sayHello as sayHello2 } from './demo2.js'

export const sayHello = () => {
  alert('Hello Demo1');
  sayHello2();
}