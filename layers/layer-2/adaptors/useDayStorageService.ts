import { logger } from '@nanostores/logger';
import { useStore } from '@nanostores/react';
import type { Day, DayStorageService } from 'layer-1/ports';
import { atom } from 'nanostores';

import { uniqueIDService } from './UniqueIDService';

const $dayList = atom<Day[]>(
  [...Array(14)].map((_, index) => ({
    id: uniqueIDService.createID(),
    dayOfTheWeek: ((1 + index) % 7) as DayOfTheWeek,
    isPublicHoliday: false,
  })),
);

export function useDayStorageService(): DayStorageService {
  useStore($dayList);

  return {
    updateItem(day) {
      $dayList.set([
        ...$dayList
          .get()
          .map((item) => (item.id === day.id ? { ...item, ...day } : item)),
      ]);
    },
    indexOf(day) {
      return $dayList.get().findIndex((item) => item.id === day.id);
    },
    getItems() {
      return $dayList.get();
    },
  };
}

logger(
  {
    $dayList,
  },
  {
    messages: {
      mount: false,
      unmount: false,
    },
  },
);
