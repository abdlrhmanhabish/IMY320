import { coursePhoto } from '../../config/photos.js';
import './CourseImage.css';

export default function CourseImage({
  course,
  sizes = '(max-width: 40rem) 100vw, 20rem',
  decorative = false,
  eager = false,
  className = '',
}) {
  const photo = coursePhoto(course.id);
  const classes = ['course-image', className].filter(Boolean).join(' ');

  if (!photo) {
    return (
      <span className={`${classes} course-image--empty`} data-category={course.category} aria-hidden="true">
        <span className="course-image__initial">{course.category.charAt(0)}</span>
      </span>
    );
  }

  return (
    <img
      className={classes}
      src={photo.small}
      srcSet={`${photo.small} 640w, ${photo.large} 1280w`}
      sizes={sizes}
      width={640}
      height={360}
      alt={decorative ? '' : photo.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}