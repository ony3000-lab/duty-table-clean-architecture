import type { Doctor } from 'layer-1/ports';
import {
  createDoctor,
  deleteDoctor,
} from 'layer-1/use-cases';

import { uniqueIDService } from '../adaptors/UniqueIDService';
import { useDoctorStorageService } from '../adaptors/useDoctorStorageService';

export function useDoctor() {
  const doctorStorageService = useDoctorStorageService();

  return {
    doctorList: doctorStorageService.getItems(),
    createDoctor(name: string) {
      createDoctor(name, {
        uniqueIDService,
        doctorStorageService,
      });
    },
    deleteDoctor(doctor: Doctor) {
      deleteDoctor(doctor, { doctorStorageService });
    },
  };
}
