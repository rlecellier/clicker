export type JobId = 'clothes-seller';

// Hours the job requires, on some days of the week.
export type Shift = {
  id: string;
  title: string;
  // days of the week, 0 = Monday
  days: number[];
  // hours since the start of the day
  start: number;
  end: number;
};

// What the player uses to look for a job: for now only their phone.
export type JobSource = 'phone';

export type Job = {
  id: JobId;
  title: string;
  // what the player searches with
  source: JobSource;
  // gold coins earned for each hour worked
  hourlyCoins: number;
  // the hours the player must work
  shifts: Shift[];
};

// The job the player holds, and when they got it.
export type Employment = {
  id: JobId;
  // game hours since the start of the game
  since: number;
};
