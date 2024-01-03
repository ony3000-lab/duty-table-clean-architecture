import { XMarkIcon } from '@heroicons/react/24/outline';
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
    <div className="w-60 space-y-4 rounded-xl border-2 border-gray-500 p-4">
      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="username"
          placeholder="홍길동"
          className="form-input ps-9 relative block w-full rounded-md border-0 bg-white px-2.5 py-1.5
            text-sm text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset
            ring-gray-300"
        />
      </form>
      {doctorList.length > 0 && (
        <div>
          <ul className="space-y-1">
            {doctorList.map((doctor) => (
              <li
                key={doctor.id}
                className="relative flex items-center justify-between rounded-md border-0 bg-white px-2.5
                  py-1.5 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              >
                <span>{doctor.name}</span>
                <button
                  type="button"
                  className="h-4 w-4"
                  onClick={() => deleteDoctor(doctor)}
                >
                  <XMarkIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
