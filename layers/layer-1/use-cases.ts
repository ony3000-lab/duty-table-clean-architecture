import type { Doctor, Day, Slot } from 'layer-0/entities';
import {
  weightedValueOf,
  isWeekend,
  totalWeightedValueOf,
  areAllSlotsAssignedDoctor,
} from 'layer-0/helpers';
import { BUFFER_DAYS } from 'shared-kernel';

import type {
  UniqueIDService,
  DoctorStorageService,
  DayStorageService,
  SlotStorageService,
  UtilityService,
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

/**
 * 시간표 계산
 *
 * 주어진 데이터를 바탕으로 시스템 요구사항에 맞는 당직 시간표를 계산한다.
 *
 * 시간표 계산은 세 라운드로 나누어 진행되며, 중간에 모든 Slot이 배정되
 * 면 이후 라운드는 진행하지 않고 종료될 수 있다.
 *
 * 각 라운드에서 계산되는 항목은 다음과 같다.
 * - 첫 번째 라운드: 모든 Doctor의 첫 번째 Slot은 무작위로 배정한다.
 * - 두 번째 라운드: 모든 Doctor의 두 번째 Slot은 첫 번째 Slot과
 * 반대로 무작위 배정한다.
 *   - 첫 번째 Slot이 평일(월-목)이면 두 번째 Slot은 주말(금-일)
 *   - 첫 번째 Slot이 주말(금-일)이면 두 번째 Slot은 평일(월-목)
 * - 마지막 라운드: Doctor가 배정되지 않은 나머지 Slot에 Doctor를
 * 배정한다.
 *
 * 처음 두 라운드에서 Slot을 무작위로 배정하기 때문에, 마지막 라운드에서
 * 빈 Slot이 있는데도 Doctor 배정이 불가능할 수 있다.
 * 이 경우 계산에 실패한 것으로 간주한다.
 */
export async function calculateTimetable(deps: {
  doctorStorageService: DoctorStorageService;
  dayStorageService: DayStorageService;
  slotStorageService: SlotStorageService;
  utilityService: UtilityService;
}): Promise<Required<Slot>[]> {
  const doctorList = deps.doctorStorageService
    .getItems()
    .slice();
  const slotList = deps.slotStorageService
    .getItems()
    .map<Slot>((slot) => ({
      ...slot,
      doctor: undefined,
    }));

  (function firstRound() {
    const shuffledDoctorList =
      deps.utilityService.shuffle(doctorList);
    const shuffledSlotList =
      deps.utilityService.shuffle(slotList);
    const minLength = Math.min(
      doctorList.length,
      slotList.length,
    );

    for (let index = 0; index < minLength; index += 1) {
      shuffledSlotList[index].doctor =
        shuffledDoctorList[index];
    }
  })();

  if (areAllSlotsAssignedDoctor(slotList)) {
    return slotList.slice();
  }

  (function secondRound() {
    const doctorAssignedSlotList = slotList.filter(
      (slot) => slot.doctor !== undefined,
    ) as Required<Slot>[];
    const shuffledWeekdaySlotList =
      deps.utilityService.shuffle(
        slotList.filter((slot) => !isWeekend(slot.day)),
      );
    const shuffledWeekendSlotList =
      deps.utilityService.shuffle(
        slotList.filter((slot) => isWeekend(slot.day)),
      );

    doctorAssignedSlotList.forEach((doctorAssignedSlot) => {
      const availableSlotList = (
        isWeekend(doctorAssignedSlot.day)
          ? shuffledWeekdaySlotList
          : shuffledWeekendSlotList
      ).filter((slot) => {
        const indexOfDayOfSlot =
          deps.dayStorageService.indexOf(slot.day);
        const indexOfDayOfDoctorAssignedSlot =
          deps.dayStorageService.indexOf(
            doctorAssignedSlot.day,
          );

        return (
          slot.doctor === undefined &&
          (indexOfDayOfSlot <
            indexOfDayOfDoctorAssignedSlot - BUFFER_DAYS ||
            indexOfDayOfSlot >
              indexOfDayOfDoctorAssignedSlot + BUFFER_DAYS)
        );
      });
      const firstAvailableSlotOrNot =
        availableSlotList.at(0);

      if (firstAvailableSlotOrNot) {
        firstAvailableSlotOrNot.doctor =
          doctorAssignedSlot.doctor;
      }
    });
  })();

  if (areAllSlotsAssignedDoctor(slotList)) {
    return slotList.slice();
  }

  (function finalRound() {
    while (!areAllSlotsAssignedDoctor(slotList)) {
      const doctorUnassignedSlotList = slotList.filter(
        (slot) => slot.doctor === undefined,
      );
      const orderedDoctorList = doctorList
        .slice()
        .sort((formerDoctor, latterDoctor) => {
          const assignedSlotListOfFormer = slotList.filter(
            (slot) => slot.doctor?.id === formerDoctor.id,
          ) as Required<Slot>[];
          const assignedSlotListOfLatter = slotList.filter(
            (slot) => slot.doctor?.id === latterDoctor.id,
          ) as Required<Slot>[];

          const availableSlotListOfFormerDoctor =
            doctorUnassignedSlotList.filter((slot) => {
              const indexOfDayOfSlot =
                deps.dayStorageService.indexOf(slot.day);
              const indexGroupOfDayOfSlot = Math.floor(
                indexOfDayOfSlot / 3.5,
              );

              return assignedSlotListOfFormer.every(
                (doctorAssignedSlot) => {
                  const indexOfDayOfDoctorAssignedSlot =
                    deps.dayStorageService.indexOf(
                      doctorAssignedSlot.day,
                    );
                  const indexGroupOfDayOfDoctorAssignedSlot =
                    Math.floor(
                      indexOfDayOfDoctorAssignedSlot / 3.5,
                    );

                  return (
                    indexGroupOfDayOfSlot !==
                      indexGroupOfDayOfDoctorAssignedSlot &&
                    (indexOfDayOfSlot <
                      indexOfDayOfDoctorAssignedSlot -
                        BUFFER_DAYS ||
                      indexOfDayOfSlot >
                        indexOfDayOfDoctorAssignedSlot +
                          BUFFER_DAYS)
                  );
                },
              );
            });
          const availableSlotListOfLatterDoctor =
            doctorUnassignedSlotList.filter((slot) => {
              const indexOfDayOfSlot =
                deps.dayStorageService.indexOf(slot.day);
              const indexGroupOfDayOfSlot = Math.floor(
                indexOfDayOfSlot / 3.5,
              );

              return assignedSlotListOfLatter.every(
                (doctorAssignedSlot) => {
                  const indexOfDayOfDoctorAssignedSlot =
                    deps.dayStorageService.indexOf(
                      doctorAssignedSlot.day,
                    );
                  const indexGroupOfDayOfDoctorAssignedSlot =
                    Math.floor(
                      indexOfDayOfDoctorAssignedSlot / 3.5,
                    );

                  return (
                    indexGroupOfDayOfSlot !==
                      indexGroupOfDayOfDoctorAssignedSlot &&
                    (indexOfDayOfSlot <
                      indexOfDayOfDoctorAssignedSlot -
                        BUFFER_DAYS ||
                      indexOfDayOfSlot >
                        indexOfDayOfDoctorAssignedSlot +
                          BUFFER_DAYS)
                  );
                },
              );
            });

          if (
            availableSlotListOfFormerDoctor.length === 0
          ) {
            return 1;
          }
          if (
            availableSlotListOfLatterDoctor.length === 0
          ) {
            return -1;
          }

          return (
            assignedSlotListOfFormer.length -
              assignedSlotListOfLatter.length ||
            totalWeightedValueOf(
              slotList.filter(
                (slot) =>
                  slot.doctor?.id === formerDoctor.id,
              ),
            ) -
              totalWeightedValueOf(
                slotList.filter(
                  (slot) =>
                    slot.doctor?.id === latterDoctor.id,
                ),
              ) ||
            availableSlotListOfFormerDoctor.length -
              availableSlotListOfLatterDoctor.length
          );
        });
      const doctorWithLeastWeightedValueOrNot =
        orderedDoctorList.at(0);

      if (!doctorWithLeastWeightedValueOrNot) {
        throw new Error(
          '배정할 수 있는 Doctor가 없습니다.',
        );
      }

      const doctorAssignedSlotList = slotList.filter(
        (slot) =>
          slot.doctor?.id ===
          doctorWithLeastWeightedValueOrNot.id,
      ) as Required<Slot>[];
      const orderedAvailableSlotList = slotList
        .filter((slot) => {
          const indexOfDayOfSlot =
            deps.dayStorageService.indexOf(slot.day);
          const indexGroupOfDayOfSlot = Math.floor(
            indexOfDayOfSlot / 3.5,
          );

          return (
            slot.doctor === undefined &&
            doctorAssignedSlotList.every(
              (doctorAssignedSlot) => {
                const indexOfDayOfDoctorAssignedSlot =
                  deps.dayStorageService.indexOf(
                    doctorAssignedSlot.day,
                  );
                const indexGroupOfDayOfDoctorAssignedSlot =
                  Math.floor(
                    indexOfDayOfDoctorAssignedSlot / 3.5,
                  );

                return (
                  indexGroupOfDayOfSlot !==
                    indexGroupOfDayOfDoctorAssignedSlot &&
                  (indexOfDayOfSlot <
                    indexOfDayOfDoctorAssignedSlot -
                      BUFFER_DAYS ||
                    indexOfDayOfSlot >
                      indexOfDayOfDoctorAssignedSlot +
                        BUFFER_DAYS)
                );
              },
            )
          );
        })
        .sort((formerSlot, latterSlot) => {
          const indexOfDayOfFormerSlot =
            deps.dayStorageService.indexOf(formerSlot.day);
          const indexGroupOfDayOfFormerSlot = Math.floor(
            indexOfDayOfFormerSlot / 3.5,
          );
          const adjacentSlotListOfFormerSlot =
            slotList.filter((slot) => {
              const indexOfDayOfSlot =
                deps.dayStorageService.indexOf(slot.day);
              const indexGroupOfDayOfSlot = Math.floor(
                indexOfDayOfSlot / 3.5,
              );

              return (
                indexGroupOfDayOfSlot ===
                  indexGroupOfDayOfFormerSlot ||
                (indexOfDayOfSlot >=
                  indexOfDayOfFormerSlot - BUFFER_DAYS &&
                  indexOfDayOfSlot <=
                    indexOfDayOfFormerSlot + BUFFER_DAYS)
              );
            });
          const availableDoctorListOfFormerSlot =
            doctorList.filter((doctor) =>
              adjacentSlotListOfFormerSlot.every(
                (slot) => slot.doctor?.id !== doctor.id,
              ),
            );

          const indexOfDayOfLatterSlot =
            deps.dayStorageService.indexOf(latterSlot.day);
          const indexGroupOfDayOfLatterSlot = Math.floor(
            indexOfDayOfLatterSlot / 3.5,
          );
          const adjacentSlotListOfLatterSlot =
            slotList.filter((slot) => {
              const indexOfDayOfSlot =
                deps.dayStorageService.indexOf(slot.day);
              const indexGroupOfDayOfSlot = Math.floor(
                indexOfDayOfSlot / 3.5,
              );

              return (
                indexGroupOfDayOfSlot ===
                  indexGroupOfDayOfLatterSlot ||
                (indexOfDayOfSlot >=
                  indexOfDayOfLatterSlot - BUFFER_DAYS &&
                  indexOfDayOfSlot <=
                    indexOfDayOfLatterSlot + BUFFER_DAYS)
              );
            });
          const availableDoctorListOfLatterSlot =
            doctorList.filter((doctor) =>
              adjacentSlotListOfLatterSlot.every(
                (slot) => slot.doctor?.id !== doctor.id,
              ),
            );

          return (
            weightedValueOf(latterSlot.day) -
              weightedValueOf(formerSlot.day) ||
            availableDoctorListOfFormerSlot.length -
              availableDoctorListOfLatterSlot.length
          );
        });
      const slotWithMostWeightedValueOrNot =
        orderedAvailableSlotList.at(0);

      if (!slotWithMostWeightedValueOrNot) {
        throw new Error('배정할 수 있는 Slot이 없습니다.');
      }

      slotWithMostWeightedValueOrNot.doctor =
        doctorWithLeastWeightedValueOrNot;
    }
  })();

  if (areAllSlotsAssignedDoctor(slotList)) {
    return slotList.slice();
  }

  throw new Error('계산에 실패했습니다.');
}
