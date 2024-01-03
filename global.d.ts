// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SUN, MON, TUE, WED, THU, FRI, SAT } from 'shared-kernel';

declare global {
  type DayOfTheWeek =
    | typeof SUN
    | typeof MON
    | typeof TUE
    | typeof WED
    | typeof THU
    | typeof FRI
    | typeof SAT;
}
