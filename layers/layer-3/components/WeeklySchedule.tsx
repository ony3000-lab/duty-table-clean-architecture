import {
  UserIcon,
  CheckCircleIcon as OutlineCheckCircleIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as SolidCheckCircleIcon } from '@heroicons/react/24/solid';
import { useDay } from 'layers/layer-2/hooks/useDay';

const dayOfTheWeekStringList = '일월화수목금토'.split('');

export function WeeklySchedule() {
  const {
    dayListContainingSlotList,
    togglePublicHoliday,
    createSlot,
    deleteSlot,
  } = useDay();

  return (
    <div className="flex-1 space-y-4">
      <div className="grid grid-cols-7 gap-x-2.5 gap-y-4">
        {dayListContainingSlotList.map((extendedDay) => (
          <div key={extendedDay.id}>
            <div className="w-32 overflow-hidden rounded-xl border border-gray-500">
              <div className="bg-gray-300 px-4 py-1 text-center">
                {dayOfTheWeekStringList[extendedDay.dayOfTheWeek]}
              </div>
              <hr />
              <div className="space-y-2 py-1">
                <div className="flex items-center justify-center space-x-4">
                  <span>공휴일</span>
                  <button
                    type="button"
                    className="h-5 w-5"
                    onClick={() => togglePublicHoliday(extendedDay)}
                  >
                    {extendedDay.isPublicHoliday ? (
                      <SolidCheckCircleIcon />
                    ) : (
                      <OutlineCheckCircleIcon />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    className="h-4 w-4"
                    onClick={() => deleteSlot(extendedDay.slotList[0])}
                  >
                    <MinusIcon />
                  </button>
                  <span>인원</span>
                  <button
                    type="button"
                    className="h-4 w-4"
                    onClick={() => createSlot(extendedDay)}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
              <hr />
              <ul className="space-y-1 p-2">
                {extendedDay.slotList.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center space-x-2 rounded-md bg-white px-2 py-1 text-sm text-gray-900
                      shadow-sm ring-1 ring-inset ring-gray-300"
                  >
                    <span className="inline-flex h-4 w-4 items-center text-[16px]">
                      <UserIcon />
                    </span>
                    <span>{slot.doctor?.name ?? <>&nbsp;</>}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
