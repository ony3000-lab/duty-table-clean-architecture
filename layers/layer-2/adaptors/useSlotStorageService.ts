import { logger } from '@nanostores/logger';
import { useStore } from '@nanostores/react';
import type { Slot, SlotStorageService } from 'layer-1/ports';
import { atom } from 'nanostores';

const $slotList = atom<Slot[]>([]);

export function useSlotStorageService(): SlotStorageService {
  const slotList = useStore($slotList);

  return {
    addItem(slot) {
      $slotList.set([...slotList, slot]);
    },
    removeItem(slot) {
      $slotList.set([...slotList.filter((item) => item.id !== slot.id)]);
    },
    getItems() {
      return slotList;
    },
  };
}

logger(
  {
    $slotList,
  },
  {
    messages: {
      mount: false,
      unmount: false,
    },
  },
);
