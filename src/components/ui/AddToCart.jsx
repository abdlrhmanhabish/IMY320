import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import useCart from '../../hooks/useCart.js';
import useProgress from '../../hooks/useProgress.js';
import useToast from '../../hooks/useToast.js';

// one button and three states. the confirmation that follows carries a tick and the course name and nothing else
export default function AddToCart({ course, size = 'md', fullWidth = false }) {
  const { has, add } = useCart();
  const { isEnrolled } = useProgress();
  const { notify } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (justAdded) {
    return (
      <Button variant="success" size={size} fullWidth={fullWidth} iconLeft={<TickIcon />}>
        Added
      </Button>
    );
  }

  if (isEnrolled(course.id)) {
    return (
      <Button to={`/learn/${course.id}`} variant="secondary" size={size} fullWidth={fullWidth}>
        Go to course
      </Button>
    );
  }

  if (has(course.id)) {
    return (
      <Button to="/cart" variant="secondary" size={size} fullWidth={fullWidth}>
        View in cart
      </Button>
    );
  }

  const handleAdd = () => {
    add(course);
    setJustAdded(true);

    notify({
      tone: 'success',
      title: 'Added to cart',
      body: course.title,
      action: { label: 'Go to cart', to: '/cart' },
    });

    timer.current = setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <Button variant="primary" size={size} fullWidth={fullWidth} onClick={handleAdd}>
      Add to cart
    </Button>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}