// Pages read in an hour of free time, for a book of the lightest complexity.
export const PAGES_PER_HOUR = 20;
// Each complexity level above the first slows the reading down by this much.
export const COMPLEXITY_SLOWDOWN = 0.25;
// Page counts under which a book is of complexity 1, 2, 3 and 4. Beyond the
// last one, it is of complexity 5.
export const COMPLEXITY_PAGE_LIMITS = [200, 350, 500, 800];
// Reading fills the brain gauge, on top of the idle fill.
export const BRAIN_READING_FILL_PER_HOUR = 1.5;
