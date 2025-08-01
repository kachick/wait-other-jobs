import * as z from 'zod';
import { WaitList } from './schema.ts';

console.dir(z.toJSONSchema(WaitList), { depth: null });
