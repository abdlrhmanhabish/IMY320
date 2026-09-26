import heroPhoto from '../assets/photos/hero.jpg';
import heroPhotoSmall from '../assets/photos/hero-sm.jpg';
import aboutPhoto from '../assets/photos/about.jpg';
import aboutPhotoSmall from '../assets/photos/about-sm.jpg';
import course1 from '../assets/photos/course-1-lg.jpg';
import course1Small from '../assets/photos/course-1-sm.jpg';
import course2 from '../assets/photos/course-2-lg.jpg';
import course2Small from '../assets/photos/course-2-sm.jpg';
import course3 from '../assets/photos/course-3-lg.jpg';
import course3Small from '../assets/photos/course-3-sm.jpg';
import course4 from '../assets/photos/course-4-lg.jpg';
import course4Small from '../assets/photos/course-4-sm.jpg';
import course5 from '../assets/photos/course-5-lg.jpg';
import course5Small from '../assets/photos/course-5-sm.jpg';
import course6 from '../assets/photos/course-6-lg.jpg';
import course6Small from '../assets/photos/course-6-sm.jpg';
import course7 from '../assets/photos/course-7-lg.jpg';
import course7Small from '../assets/photos/course-7-sm.jpg';
import course8 from '../assets/photos/course-8-lg.jpg';
import course8Small from '../assets/photos/course-8-sm.jpg';
import course9 from '../assets/photos/course-9-lg.jpg';
import course9Small from '../assets/photos/course-9-sm.jpg';

export const hero = {
  src: heroPhoto,
  srcSet: `${heroPhotoSmall} 600w, ${heroPhoto} 960w`,
  width: 960,
  height: 1200,
  alt: 'A learner smiling at the camera while working through a lesson on her laptop',
};

export const about = {
  src: aboutPhoto,
  srcSet: `${aboutPhotoSmall} 900w, ${aboutPhoto} 1800w`,
  width: 1800,
  height: 771,
  alt: 'A room of learners around a long table during a workshop session',
};

const COURSE_PHOTOS = {
  1: {
    large: course1,
    small: course1Small,
    alt: 'An analyst checking a tablet beside the server racks in a data centre',
  },
  2: {
    large: course2,
    small: course2Small,
    alt: 'Someone signing off a printed document at a wooden desk',
  },
  3: {
    large: course3,
    small: course3Small,
    alt: 'A laptop on a sofa with front end code open in an editor',
  },
  4: {
    large: course4,
    small: course4Small,
    alt: 'A delivery lead talking a colleague through a plan at the whiteboard',
  },
  5: {
    large: course5,
    small: course5Small,
    alt: 'Printed charts and a tablet spread across a desk during a planning session',
  },
  6: {
    large: course6,
    small: course6Small,
    alt: 'HTML markup for a page layout open on a monitor',
  },
  7: {
    large: course7,
    small: course7Small,
    alt: 'A small team listening closely during a meeting around a long table',
  },
  8: {
    large: course8,
    small: course8Small,
    alt: 'A reader holding open the business section of a newspaper',
  },
  9: {
    large: course9,
    small: course9Small,
    alt: 'Three colleagues reviewing code together on one laptop',
  },
};

export function coursePhoto(id) {
  return COURSE_PHOTOS[id] ?? null;
}

const WOCINTECH = 'WOCinTech Chat';
const CC_BY_2 = { licence: 'CC BY 2.0', licenceUrl: 'https://creativecommons.org/licenses/by/2.0/' };
const CC0 = { licence: 'CC0', licenceUrl: 'https://creativecommons.org/publicdomain/zero/1.0/' };

export const photoCredits = [
  {
    usedFor: 'Landing page hero',
    author: WOCINTECH,
    source: 'https://commons.wikimedia.org/wiki/File:Wocintech_(microsoft)_-_107_(25392479303).jpg',
    ...CC_BY_2,
  },
  {
    usedFor: 'About page workshop',
    author: WOCINTECH,
    source: 'https://commons.wikimedia.org/wiki/File:Wocintech_(microsoft)_-_172_(25900872292).jpg',
    ...CC_BY_2,
  },
  {
    usedFor: 'SQL for people who write reports',
    author: WOCINTECH,
    source: 'https://commons.wikimedia.org/wiki/File:Wocintech_(microsoft)_-_219_(25392641583).jpg',
    ...CC_BY_2,
  },
  {
    usedFor: 'Spreadsheets that survive an audit',
    author: 'Olu Eletu',
    source: 'https://commons.wikimedia.org/wiki/File:Man_writing_on_paper_(Unsplash).jpg',
    ...CC0,
  },
  {
    usedFor: 'React for the first real project',
    author: 'Goran Ivos',
    source: 'https://commons.wikimedia.org/wiki/File:Coding_(Unsplash).jpg',
    ...CC0,
  },
  {
    usedFor: 'Running a delivery without chaos',
    author: WOCINTECH,
    source: 'https://commons.wikimedia.org/wiki/File:Wocintech_(microsoft)_-_125_(25900811202).jpg',
    ...CC_BY_2,
  },
  {
    usedFor: 'Forecasting that survives contact with reality',
    author: 'William Iven',
    source: 'https://commons.wikimedia.org/wiki/File:Crunching_the_numbers_(Unsplash).png',
    ...CC0,
  },
  {
    usedFor: 'HTML and CSS you can actually ship',
    author: 'Sai Kiran Anagani',
    source: 'https://commons.wikimedia.org/wiki/File:CSS_code_on_a_screen_(Unsplash).jpg',
    ...CC0,
  },
  {
    usedFor: 'Running a meeting people do not dread',
    author: WOCINTECH,
    source: 'https://commons.wikimedia.org/wiki/File:Wocintech_(microsoft)_-_169_(25721027700).jpg',
    ...CC_BY_2,
  },
  {
    usedFor: "Reading a company's numbers",
    author: 'Olu Eletu',
    source: 'https://commons.wikimedia.org/wiki/File:Business_newspaper_(Unsplash).jpg',
    ...CC0,
  },
  {
    usedFor: 'Testing and code review in a real team',
    author: WOCINTECH,
    source: 'https://commons.wikimedia.org/wiki/File:Wocintech_(microsoft)_-_136_(25388863844).jpg',
    ...CC_BY_2,
  },
];