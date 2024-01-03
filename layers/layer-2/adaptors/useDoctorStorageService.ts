import { logger } from '@nanostores/logger';
import { useStore } from '@nanostores/react';
import type {
  Doctor,
  DoctorStorageService,
} from 'layer-1/ports';
import { atom } from 'nanostores';

const $doctorList = atom<Doctor[]>([]);

export function useDoctorStorageService(): DoctorStorageService {
  useStore($doctorList);

  return {
    addItem(doctor) {
      $doctorList.set([...$doctorList.get(), doctor]);
    },
    removeItem(doctor) {
      $doctorList.set([
        ...$doctorList
          .get()
          .filter((item) => item.id !== doctor.id),
      ]);
    },
    getItems() {
      return $doctorList.get();
    },
  };
}

logger(
  {
    $doctorList,
  },
  {
    messages: {
      mount: false,
      unmount: false,
    },
  },
);
