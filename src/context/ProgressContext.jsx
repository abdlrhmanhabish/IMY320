import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProgressContext } from './progressContext.js';
import courses from '../data/courses.json';
import { DAILY_GOAL, countStreak, dayKey, lessonsOf } from '../utils/progress.js';

const PROGRESS_KEY = 'skillup:progress';
const EMPTY = { enrolments: {}, activity: {} };

function readProgress() {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object') return EMPTY;
    return {
      enrolments: parsed.enrolments ?? {},
      activity: parsed.activity ?? {},
    };
  } catch {
    return EMPTY;
  }
}

export function ProgressProvider({ children }) {
  const [state, setState] = useState(readProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
    } catch {
      
    }
  }, [state]);

  const enrol = useCallback((list) => {
    const now = new Date().toISOString();

    setState((current) => {
      const enrolments = { ...current.enrolments };

      list.forEach((course) => {
        if (enrolments[course.id]) return;
        enrolments[course.id] = { enrolledAt: now, done: [], completedAt: null };
      });

      return { ...current, enrolments };
    });
  }, []);

  const isEnrolled = useCallback((id) => Boolean(state.enrolments[id]), [state.enrolments]);

  const isDone = useCallback(
    (courseId, key) => Boolean(state.enrolments[courseId]?.done.includes(key)),
    [state.enrolments],
  );

  const toggleLesson = useCallback(
    (courseId, key) => {
      const entry = state.enrolments[courseId];
      if (!entry) return { done: false, courseComplete: false };

      const total = lessonsOf(courses.find((item) => item.id === courseId)).length;
      const alreadyDone = entry.done.includes(key);
      const done = alreadyDone
        ? entry.done.filter((item) => item !== key)
        : [...entry.done, key];

      const courseComplete = total > 0 && done.length === total;

      const today = dayKey();
      const counted = state.activity[today] ?? 0;
      const activity = { ...state.activity };

      if (alreadyDone) {
        if (counted <= 1) delete activity[today];
        else activity[today] = counted - 1;
      } else {
        activity[today] = counted + 1;
      }

      setState({
        enrolments: {
          ...state.enrolments,
          [courseId]: {
            ...entry,
            done,
            completedAt: courseComplete ? (entry.completedAt ?? new Date().toISOString()) : null,
          },
        },
        activity,
      });

      return { done: !alreadyDone, courseComplete: courseComplete && !alreadyDone };
    },
    [state],
  );

  const progressFor = useCallback(
    (courseId) => {
      const course = courses.find((item) => item.id === courseId);
      const total = lessonsOf(course).length;
      const entry = state.enrolments[courseId];
      const done = entry ? entry.done.length : 0;

      return {
        done,
        total,
        percent: total === 0 ? 0 : Math.round((done / total) * 100),
        complete: total > 0 && done === total,
        started: done > 0,
      };
    },
    [state.enrolments],
  );

  const reset = useCallback(() => setState(EMPTY), []);

  const value = useMemo(() => {
    const enrolled = Object.keys(state.enrolments)
      .map((id) => courses.find((course) => course.id === Number(id)))
      .filter(Boolean);

    const todayCount = state.activity[dayKey()] ?? 0;

    return {
      enrolled,
      enrolments: state.enrolments,
      todayCount,
      goalMet: todayCount >= DAILY_GOAL,
      streak: countStreak(state.activity),
      enrol,
      isEnrolled,
      isDone,
      toggleLesson,
      progressFor,
      reset,
    };
  }, [state, enrol, isEnrolled, isDone, toggleLesson, progressFor, reset]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}