export type Doctor = {
  id: string;
  name: string;
};

export type Day = {
  id: string;
  dayOfTheWeek: DayOfTheWeek;
  isPublicHoliday: boolean;
};

export type Slot = {
  id: string;
  day: Day;
  doctor?: Doctor;
};
