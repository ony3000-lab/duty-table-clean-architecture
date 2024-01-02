import { useDoctor } from 'layers/layer-2/hooks/useDoctor';
import type { SyntheticEvent } from 'react';
import { useCallback } from 'react';

export function DoctorLineup() {
  const { doctorList, createDoctor, deleteDoctor } = useDoctor();

  const submitHandler = useCallback((e: SyntheticEvent) => {
    e.preventDefault();

    const { currentTarget } = e;

    if (currentTarget instanceof HTMLFormElement) {
      const element = currentTarget.username as HTMLInputElement;

      createDoctor(element.value.trim());
      element.value = '';
    }
  }, []);

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="username"
          placeholder="홍길동"
        />
      </form>
      {doctorList.length > 0 && (
        <div>
          <ul>
            {doctorList.map((doctor) => (
              <li key={doctor.id}>
                <span>{doctor.name}</span>
                <button
                  type="button"
                  onClick={() => deleteDoctor(doctor)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
