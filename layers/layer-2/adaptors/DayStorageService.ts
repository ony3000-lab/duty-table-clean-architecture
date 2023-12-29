import type { Day, DayStorageService } from 'layer-1/ports';
import { atom } from 'nanostores';

export const $dayList = atom<Day[]>([]);

export const dayStorageService: DayStorageService = {
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
};
