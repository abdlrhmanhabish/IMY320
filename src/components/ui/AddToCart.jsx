import { useEffect, useRef, useState } from 'react';
import Button from './Button.jsx';
import useCart from '../../hooks/useCart.js';
import useProgress from '../../hooks/useProgress.js';
import useToast from '../../hooks/useToast.js';

// one button and three states. the confirmation that follows carries a tick and the course name and nothing else
// In a list of courses it is a secondary button and that way the accent stays on the one main action of the page
export default function AddToCart({ course, size = 'md', fullWidth = false, variant = 'primary' }) {
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
    <Button variant={variant} size={size} fullWidth={fullWidth} onClick={handleAdd} iconLeft={<CartIcon />}>
      Add to cart
    </Button>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M3 4h2.2l2.1 10.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L20.5 8H6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
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