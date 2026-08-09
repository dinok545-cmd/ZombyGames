import {describe,expect,it} from 'vitest';
import {clothes,past,pronouns} from './data';

describe('educational content',()=>{
  it('contains at least 20 questions per question game',()=>{
    expect(past.length).toBeGreaterThanOrEqual(20);
    expect(pronouns.length).toBeGreaterThanOrEqual(20);
  });
  it('contains a valid answer in every option set',()=>{
    for(const question of [...past,...pronouns]) expect(question.options).toContain(question.answer);
  });
  it('contains 20 unique clothing words',()=>{
    expect(clothes).toHaveLength(20);
    expect(new Set(clothes.map(item=>item.word)).size).toBe(20);
  });
});
