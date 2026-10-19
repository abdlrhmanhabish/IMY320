// small words that would match almost every course
const SKIP = new Set(['a', 'an', 'and', 'the', 'for', 'to', 'of', 'in', 'on', 'at', 'with', 'how', 'who', 'what', 'my', 'i', 'me', 'your', 'course', 'courses', 'learn', 'learning', 'about']);

// reports + reporting + report all come down to "report" 
function stem(word) {
  if (word.length <= 4){ 
    return word;
  }
  return word.replace(/(ings|ing|ers|er|ies|es|ed|s)$/, '');
}

export function searchWords(query) {
  return query.toLowerCase().split(/[^a-z0-9#+]+/).filter((word) => word && !SKIP.has(word)).map(stem);
}

function wordsOf(course) {
  return [
    course.title,
    course.category,
    course.level,
    course.instructor,
    course.summary,
    course.tagline,
    ...course.modules.map((module) => module.title),
  ]
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9#+]+/)
    .filter(Boolean);
}

// a course is a match when every word of the search starts a word somewhere in it
export function matchCourses(courses, query) {
  const searchWords = searchWords(query);

  if (searchWords.length === 0) {
    return { searchWords, full: courses, partial: [] };
  }

  const full = [];
  const partial = [];

  courses.forEach((course) => {
    const text = wordsOf(course);
    const hits = searchWords.filter((word) => text.some((part) => part.startsWith(word))).length;
    if (hits === searchWords.length){ 
      full.push(course);
    }
    else if (hits > 0){ 
      partial.push({ course, hits });
    }
  });

  partial.sort((a, b) => b.hits - a.hits);
  return { searchWords, full, partial: partial.map((entry) => entry.course) };
}