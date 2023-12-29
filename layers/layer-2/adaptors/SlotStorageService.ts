import type { Slot, SlotStorageService } from 'layer-1/ports';
import { atom } from 'nanostores';

export const $slotList = atom<Slot[]>([]);

export const slotStorageService: SlotStorageService = {
  addItem(slot) {
    $slotList.set([...$slotList.get(), slot]);
  },
  removeItem(slot) {
    $slotList.set([...$slotList.get().filter((item) => item.id !== slot.id)]);
  },
  getItems() {
    return $slotList.get();
  },
};
