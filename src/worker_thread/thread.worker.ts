import { workerData, parentPort } from 'worker_threads';

console.log('workerData', workerData);

if (parentPort) {
  parentPort.postMessage({ success: true });
}
