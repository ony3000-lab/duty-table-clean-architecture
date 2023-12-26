const SUN = 0;
const MON = 1;
const TUE = 2;
const WED = 3;
const THU = 4;
const FRI = 5;
const SAT = 6;

type DayOfTheWeek =
  | typeof SUN
  | typeof MON
  | typeof TUE
  | typeof WED
  | typeof THU
  | typeof FRI
  | typeof SAT;

const BUFFER_DAYS = 2;
