import type { Doctor, Day, Slot } from 'layer-0/entities';

export type { Doctor, Day, Slot };

export interface UniqueIDService {
  createID(): string;
}

export interface DoctorStorageService {
  addItem(doctor: Doctor): void;
  removeItem(doctor: Doctor): void;
  getItems(): Doctor[];
}

export interface DayStorageService {
  updateItem(day: Day): void;
  indexOf(day: Day): number;
}

export interface SlotStorageService {
  addItem(slot: Slot): void;
  removeItem(slot: Slot): void;
  getItems(): Slot[];
}

export interface UtilityService {
  shuffle<T>(list: T[]): T[];
}
