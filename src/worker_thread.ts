import { performance } from 'perf_hooks';
import { heavyOperation } from './worker_thread/index';

const req = [];

for (let post = 1; post <= 100; post++) {
  req.push(`https://jsonplaceholder.typicode.com/posts/${post}`);
}

(async () => {
  const start = performance.now();
  const res = await heavyOperation(req);
  const end = performance.now();

  console.log(end - start, 'ms', res.length, 'requests');
})();
