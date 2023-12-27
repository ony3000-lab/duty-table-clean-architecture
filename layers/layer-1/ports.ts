import type { Doctor, Day, Slot } from 'layer-0/entities';

export interface UniqueIDService {
  createID(): string;
}

export interface DoctorStorageService {
  addItem(doctor: Doctor): void;
  removeItem(doctor: Doctor): void;
}

export interface DayStorageService {
  updateItem(day: Day): void;
}

export interface SlotStorageService {
  addItem(slot: Slot): void;
  removeItem(slot: Slot): void;
}
