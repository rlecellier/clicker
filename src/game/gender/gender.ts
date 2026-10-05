// Who the player is: for now, only used to address them in the story.
export type Gender = 'boy' | 'girl';

// What the parents hope the player will be.
export const selfMadeOf = (gender: Gender) =>
  gender === 'girl' ? 'self-made girl' : 'self-made boy';
