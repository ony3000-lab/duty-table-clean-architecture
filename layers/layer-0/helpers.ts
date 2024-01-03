import { SUN, FRI, SAT } from 'shared-kernel';

import type { Day, Slot } from './entities';

export function weightedValueOf(day: Day) {
  if (
    day.isPublicHoliday ||
    [SAT, SUN].includes(day.dayOfTheWeek)
  ) {
    return 2;
  }

  if ([FRI].includes(day.dayOfTheWeek)) {
    return 1.5;
  }

  return 1;
}

export function isWeekend(day: Day) {
  return [FRI, SAT, SUN].includes(day.dayOfTheWeek);
}

export function totalWeightedValueOf(slotList: Slot[]) {
  return slotList.reduce(
    (total, slot) => total + weightedValueOf(slot.day),
    0,
  );
}

export function areAllSlotsAssignedDoctor(
  slotList: Slot[],
): slotList is Required<Slot>[] {
  return slotList.every(
    (slot) => slot.doctor !== undefined,
  );
}
