import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProgressContext } from './progressContext.js';
import courses from '../data/courses.json';
import useAuth from '../hooks/useAuth.js';
import {
  DAILY_GOAL,
  certificateNumber,
  countStreak,
  dayKey,
  lessonsOf,
} from '../utils/progress.js';
import {
  GUEST,
  moveSharedData,
  ownerOf,
  readSaved,
  removeSaved,
  writeSaved,
} from '../utils/storage.js';

const EMPTY = { enrolments: {}, activity: {} };

function clean(saved) {
  if (!saved || typeof saved !== 'object') return EMPTY;
  return {
    enrolments: saved.enrolments ?? {},
    activity: saved.activity ?? {},
  };
}

// a guest can not buy a course. The guest slot only ever holds older data. the next account to sign in takes it over
function load(owner) {
  if (owner === GUEST) return EMPTY;

  const own = clean(readSaved('progress', owner, null));
  const left = clean(readSaved('progress', GUEST, null));
  const activity = { ...own.activity };

  Object.entries(left.activity).forEach(([day, count]) => {
    activity[day] = (activity[day] ?? 0) + count;
  });

  return { enrolments: { ...left.enrolments, ...own.enrolments }, activity };
}

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const owner = ownerOf(user);

  const [state, setState] = useState(() => {
    moveSharedData('progress');
    return { owner, ...load(owner) };
  });

  // logging out shows nothing and logging in shows that account courses
  if (state.owner !== owner) {
    setState({ owner, ...load(owner) });
  }

  useEffect(() => {
    if (state.owner === GUEST){
       return;
    }

    writeSaved('progress', state.owner, { enrolments: state.enrolments, activity: state.activity });
    removeSaved('progress', GUEST);
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
        ...state,
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

  const certificateFor = useCallback(
    (courseId) => {
      const entry = state.enrolments[courseId];
      if (!entry?.completedAt){
        return null;
      }

      return {
        number: certificateNumber(state.owner, courseId, entry.completedAt),
        completedAt: entry.completedAt,
      };
    },
    [state.enrolments, state.owner],
  );

  const reviewFor = useCallback(
    (courseId) => state.enrolments[courseId]?.review ?? null,
    [state.enrolments],
  );

  const saveReview = useCallback((courseId, { rating, comment }) => {
    setState((current) => {
      const entry = current.enrolments[courseId];
      if (!entry){
        return current;
      }

      return {
        ...current,
        enrolments: {
          ...current.enrolments,
          [courseId]: {
            ...entry,
            review: { rating, comment: comment.trim(), savedAt: new Date().toISOString() },
          },
        },
      };
    });
  }, []);

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
      certificateFor,
      reviewFor,
      saveReview,
    };
  }, [
    state,
    enrol,
    isEnrolled,
    isDone,
    toggleLesson,
    progressFor,
    certificateFor,
    reviewFor,
    saveReview,
  ]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}