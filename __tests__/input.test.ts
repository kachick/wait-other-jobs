import test from 'node:test';
import assert, { strictEqual, throws } from 'node:assert';
import { Durationable, Options, yamlPattern } from '../src/schema.ts';
import { durationEqual, optionsEqual } from './assert.ts';
import { z } from 'zod';
import { deepStrictEqual } from 'node:assert/strict';
import { parseTargetEvents } from '../src/input.ts';

test('event-list', async (t) => {
  await t.test('it accepts exact and prefix mode', (_t) => {
    strictEqual(parseTargetEvents('all'), 'all');

    strictEqual(parseTargetEvents('any'), 'all');
  });
});
