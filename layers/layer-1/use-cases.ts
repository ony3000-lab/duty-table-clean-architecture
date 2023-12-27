import type { Doctor, Day, Slot } from 'layer-0/entities';

import type {
  UniqueIDService,
  DoctorStorageService,
  DayStorageService,
  SlotStorageService,
} from './ports';

export function createDoctor(
  name: string,
  deps: {
    uniqueIDService: UniqueIDService;
    doctorStorageService: DoctorStorageService;
  },
): Doctor {
  const doctor: Doctor = {
    id: deps.uniqueIDService.createID(),
    name,
  };

  deps.doctorStorageService.addItem(doctor);

  return doctor;
}

export function deleteDoctor(
  doctor: Doctor,
  deps: {
    doctorStorageService: DoctorStorageService;
  },
): void {
  deps.doctorStorageService.removeItem(doctor);
}

export function togglePublicHoliday(
  day: Day,
  deps: {
    dayStorageService: DayStorageService;
  },
): Day {
  const updatedDay = {
    ...day,
    isPublicHoliday: !day.isPublicHoliday,
  };

  deps.dayStorageService.updateItem(updatedDay);

  return updatedDay;
}

export function createSlot(
  day: Day,
  deps: {
    uniqueIDService: UniqueIDService;
    slotStorageService: SlotStorageService;
  },
): Slot {
  const slot: Slot = {
    id: deps.uniqueIDService.createID(),
    day,
  };

  deps.slotStorageService.addItem(slot);

  return slot;
}

export function deleteSlot(
  slot: Slot,
  deps: {
    slotStorageService: SlotStorageService;
  },
): void {
  deps.slotStorageService.removeItem(slot);
}
