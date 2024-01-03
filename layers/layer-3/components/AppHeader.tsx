import { useTimetable } from 'layers/layer-2/hooks/useTimetable';
import type { SyntheticEvent } from 'react';
import { useCallback } from 'react';

export function AppHeader() {
  const { calculateTimetable } = useTimetable();

  const clickHandler = useCallback(async (e: SyntheticEvent) => {
    try {
      const result = await calculateTimetable();

      console.log('계산 성공!');
      console.log(result);
    }
    catch (err) {
      console.log('계산 실패!');
      console.log(err);
    }
  }, []);

  return (
    <div>
      <button
        type="button"
        className="inline-flex flex-shrink-0 items-center gap-x-1.5 rounded-md bg-gray-500 px-2.5
          py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-600"
        onClick={clickHandler}
      >
        시간표 계산
      </button>
    </div>
  );
}
