/* eslint-disable import/no-relative-packages */
import {
  SUN,
  MON,
  TUE,
  WED,
  THU,
  FRI,
  SAT,
} from 'shared-kernel';

import type {
  DoctorStorageService,
  DayStorageService,
  SlotStorageService,
  UtilityService,
} from '../layers/layer-1/ports';
import { calculateTimetable } from '../layers/layer-1/use-cases';

const doctorListMock: { id: string; name: string }[] = [
  { id: 'doctor-1', name: '김훈' },
  { id: 'doctor-2', name: '이자경' },
  { id: 'doctor-3', name: '박한결' },
  { id: 'doctor-4', name: '최우람' },
  { id: 'doctor-5', name: '정윤진' },
  { id: 'doctor-6', name: '강유빈' },
  { id: 'doctor-7', name: '조신영' },
  { id: 'doctor-8', name: '윤태은' },
];
const dayListMock: {
  id: string;
  dayOfTheWeek: DayOfTheWeek;
  isPublicHoliday: boolean;
}[] = [
  {
    id: 'day-1',
    dayOfTheWeek: MON,
    isPublicHoliday: false,
  },
  {
    id: 'day-2',
    dayOfTheWeek: TUE,
    isPublicHoliday: false,
  },
  {
    id: 'day-3',
    dayOfTheWeek: WED,
    isPublicHoliday: false,
  },
  {
    id: 'day-4',
    dayOfTheWeek: THU,
    isPublicHoliday: false,
  },
  {
    id: 'day-5',
    dayOfTheWeek: FRI,
    isPublicHoliday: false,
  },
  {
    id: 'day-6',
    dayOfTheWeek: SAT,
    isPublicHoliday: false,
  },
  {
    id: 'day-7',
    dayOfTheWeek: SUN,
    isPublicHoliday: false,
  },
  {
    id: 'day-8',
    dayOfTheWeek: MON,
    isPublicHoliday: false,
  },
  {
    id: 'day-9',
    dayOfTheWeek: TUE,
    isPublicHoliday: false,
  },
  {
    id: 'day-10',
    dayOfTheWeek: WED,
    isPublicHoliday: false,
  },
  {
    id: 'day-11',
    dayOfTheWeek: THU,
    isPublicHoliday: false,
  },
  {
    id: 'day-12',
    dayOfTheWeek: FRI,
    isPublicHoliday: false,
  },
  {
    id: 'day-13',
    dayOfTheWeek: SAT,
    isPublicHoliday: false,
  },
  {
    id: 'day-14',
    dayOfTheWeek: SUN,
    isPublicHoliday: false,
  },
];

const doctorStorageMock: DoctorStorageService = {
  addItem() {},
  removeItem() {},
  getItems() {
    return doctorListMock;
  },
};
const dayStorageMock: DayStorageService = {
  updateItem() {},
  indexOf(givenDay) {
    return dayListMock.findIndex(
      (day) => day.id === givenDay.id,
    );
  },
  getItems() {
    return dayListMock;
  },
};
const slotStorageMock: SlotStorageService = {
  addItem() {},
  removeItem() {},
  getItems() {
    return [
      { id: 'slot-1-1', day: dayListMock[0] },
      { id: 'slot-2-1', day: dayListMock[1] },
      { id: 'slot-2-2', day: dayListMock[1] },
      { id: 'slot-3-1', day: dayListMock[2] },
      { id: 'slot-3-2', day: dayListMock[2] },
      { id: 'slot-4-1', day: dayListMock[3] },
      { id: 'slot-4-2', day: dayListMock[3] },
      { id: 'slot-5-1', day: dayListMock[4] },
      { id: 'slot-5-2', day: dayListMock[4] },
      { id: 'slot-6-1', day: dayListMock[5] },
      { id: 'slot-6-2', day: dayListMock[5] },
      { id: 'slot-7-1', day: dayListMock[6] },
      { id: 'slot-7-2', day: dayListMock[6] },
      { id: 'slot-8-1', day: dayListMock[7] },
      { id: 'slot-9-1', day: dayListMock[8] },
      { id: 'slot-9-2', day: dayListMock[8] },
      { id: 'slot-10-1', day: dayListMock[9] },
      { id: 'slot-10-2', day: dayListMock[9] },
      { id: 'slot-11-1', day: dayListMock[10] },
      { id: 'slot-11-2', day: dayListMock[10] },
      { id: 'slot-12-1', day: dayListMock[11] },
      { id: 'slot-12-2', day: dayListMock[11] },
      { id: 'slot-13-1', day: dayListMock[12] },
      { id: 'slot-13-2', day: dayListMock[12] },
      { id: 'slot-14-1', day: dayListMock[13] },
      { id: 'slot-14-2', day: dayListMock[13] },
    ];
  },
};

const utilityMock: UtilityService = {
  shuffle(list) {
    if (list.length <= 1) {
      return list;
    }

    const shuffledIndexes = [...Array(list.length)]
      .map((_, index) => ({ index, key: Math.random() }))
      .sort((former, latter) => former.key - latter.key)
      .map(({ index }) => index);

    return list.map(
      (_, index) => list[shuffledIndexes[index]],
    );
  },
};

describe('use-case test', () => {
  test('calculateTimetable (확률적으로 실패할 수 있음)', async () => {
    let isSuccess = true;

    try {
      const resultSlotList = await calculateTimetable({
        doctorStorageService: doctorStorageMock,
        dayStorageService: dayStorageMock,
        slotStorageService: slotStorageMock,
        utilityService: utilityMock,
      });

      console.log(resultSlotList);
    }
    catch (_) {
      isSuccess = false;
    }

    expect(isSuccess).toBe(true);
  });
});
