import type { Day, Slot } from 'layer-1/ports';
import { togglePublicHoliday, createSlot, deleteSlot } from 'layer-1/use-cases';

import { uniqueIDService } from '../adaptors/UniqueIDService';
import { useDayStorageService } from '../adaptors/useDayStorageService';
import { useSlotStorageService } from '../adaptors/useSlotStorageService';

export function useDay() {
  const dayStorageService = useDayStorageService();
  const slotStorageService = useSlotStorageService();

  return {
    dayListContainingSlotList: dayStorageService.getItems().map((day) => {
      return {
        ...day,
        slotList: slotStorageService
          .getItems()
          .filter((slot) => slot.day.id === day.id),
      };
    }),
    togglePublicHoliday<T extends Day>(extendedDay: T) {
      const day = dayStorageService
        .getItems()
        .find((item) => item.id === extendedDay.id);

      if (day) {
        togglePublicHoliday(day, { dayStorageService });
      }
    },
    createSlot<T extends Day>(extendedDay: T) {
      const day = dayStorageService
        .getItems()
        .find((item) => item.id === extendedDay.id);

      if (day) {
        createSlot(day, { uniqueIDService, slotStorageService });
      }
    },
    deleteSlot(slot: Slot) {
      deleteSlot(slot, { slotStorageService });
    },
  };
}
