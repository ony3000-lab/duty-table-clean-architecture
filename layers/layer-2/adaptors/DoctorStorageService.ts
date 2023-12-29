import type { Doctor, DoctorStorageService } from 'layer-1/ports';
import { atom } from 'nanostores';

export const $doctorList = atom<Doctor[]>([]);

export const doctorStorageService: DoctorStorageService = {
  addItem(doctor) {
    $doctorList.set([...$doctorList.get(), doctor]);
  },
  removeItem(doctor) {
    $doctorList.set([
      ...$doctorList.get().filter((item) => item.id !== doctor.id),
    ]);
  },
  getItems() {
    return $doctorList.get();
  },
};
