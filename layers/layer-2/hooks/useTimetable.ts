import { calculateTimetable } from 'layer-1/use-cases';

import { utilityService } from '../adaptors/UtilityService';
import { useDayStorageService } from '../adaptors/useDayStorageService';
import { useDoctorStorageService } from '../adaptors/useDoctorStorageService';
import { useSlotStorageService } from '../adaptors/useSlotStorageService';

export function useTimetable() {
  const doctorStorageService = useDoctorStorageService();
  const dayStorageService = useDayStorageService();
  const slotStorageService = useSlotStorageService();

  return {
    calculateTimetable() {
      return calculateTimetable({
        doctorStorageService,
        dayStorageService,
        slotStorageService,
        utilityService,
      });
    },
  };
}
