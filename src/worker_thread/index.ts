/* eslint-disable @typescript-eslint/no-explicit-any */
import { cpus } from 'os';
import { Worker } from 'worker_threads';
import { resolve } from 'path';

const CPUs = cpus().length || 1;
const WORKER_PATH = resolve(__dirname, 'thread.worker.js');

export function heavyOperation(input: string[]): Promise<any[]> {
  return new Promise((done) => {
    if (!Array.isArray(input) || !input.length) {
      return done([]);
    }

    const bunches = [];

    // Chunk
    for (let i = CPUs; i > 0; i--) {
      const bunch = input.splice(0, Math.ceil(input.length / i));

      if (bunch.length) {
        bunches.push(bunch);
      }
    }

    if (!bunches.length) {
      console.error('[Fetch] failed to split requests on threads.');
      return done([]);
    }

    let completed = 0;
    const results: any[] = [];

    // Start Worker
    bunches.forEach((bunch) => {
      const worker = new Worker(WORKER_PATH, {
        workerData: {
          requests: bunch
        }
      });

      worker.once('message', (response) => {
        if (Array.isArray(response) && response.length) {
          response.forEach((res) => results.push(res));
        }
      });

      worker.once('exit', () => {
        worker.unref();
        completed++;

        if (completed === bunches.length) {
          done(results);
        }
      });
    });
  });
}
