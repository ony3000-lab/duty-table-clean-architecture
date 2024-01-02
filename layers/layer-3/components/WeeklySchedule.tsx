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
    <div>
      <div>
        {dayListContainingSlotList.map((extendedDay) => (
          <div key={extendedDay.id}>
            <div>{dayOfTheWeekStringList[extendedDay.dayOfTheWeek]}</div>
            <hr />
            <div>
              <div>
                <span>공휴일</span>
                <button
                  type="button"
                  onClick={() => togglePublicHoliday(extendedDay)}
                >
                  {extendedDay.isPublicHoliday ? 'O' : 'X'}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => deleteSlot(extendedDay.slotList[0])}
                >
                  -
                </button>
                <span>인원</span>
                <button
                  type="button"
                  onClick={() => createSlot(extendedDay)}
                >
                  +
                </button>
              </div>
            </div>
            <hr />
            <ul>
              {extendedDay.slotList.map((slot) => (
                <li key={slot.id}>
                  <span>{slot.doctor?.name ?? '&nbsp;'}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
