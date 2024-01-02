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
        onClick={clickHandler}
      >
        시간표 계산
      </button>
    </div>
  );
}
