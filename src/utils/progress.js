// three items a day is a target most people clear in one sitting. a goal nobody reaches stops being a reward
export const DAILY_GOAL = 3;

export function dayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function lessonKey(moduleIndex, lessonIndex) {
  return `${moduleIndex}:${lessonIndex}`;
}

export function lessonsOf(course) {
  if (!course) return [];

  return course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((title, lessonIndex) => ({
      key: lessonKey(moduleIndex, lessonIndex),
      title,
      moduleIndex,
      lessonIndex,
      moduleTitle: module.title,
    })),
  );
}

export function countStreak(activity) {
  const date = new Date();

  // a day that has only just started should not break yesterday's run
  if (!activity[dayKey(date)]) {
    date.setDate(date.getDate() - 1);
    if (!activity[dayKey(date)]) return 0;
  }

  let streak = 0;
  while (activity[dayKey(date)]) {
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}