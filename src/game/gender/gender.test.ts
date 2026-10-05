import { describe, expect, it } from 'vitest';

import { selfMadeOf } from './gender';

describe('selfMadeOf', () => {
  it('names what the parents expect of a boy and of a girl', () => {
    expect(selfMadeOf('boy')).toBe('self-made boy');
    expect(selfMadeOf('girl')).toBe('self-made girl');
  });
});
