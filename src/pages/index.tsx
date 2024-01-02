import { AppHeader } from 'layer-3/components/AppHeader';
import { DoctorLineup } from 'layer-3/components/DoctorLineup';
import { WeeklySchedule } from 'layer-3/components/WeeklySchedule';

export default function Home() {
  return (
    <div className="min-h-screen overflow-auto">
      <div className="mx-auto w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 py-8">
          <AppHeader />
          <div className="flex space-x-4">
            <DoctorLineup />
            <WeeklySchedule />
          </div>
        </div>
      </div>
    </div>
  );
}
