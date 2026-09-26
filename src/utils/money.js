// prices in courses.json are written the way they should read on the page. which means anything doing arithmetic has to pull the number back out first

export function toAmount(price) {
  const value = Number(String(price).replace(/[^\d.]/g, ''));
  return Number.isFinite(value) ? value : 0;
}

export function formatRand(amount) {
  const rounded = Math.abs(Math.round(amount));
  const grouped = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${amount < 0 ? '-' : ''}R ${grouped}`;
}

export function savingOn(course) {
  return Math.max(0, toAmount(course.listPrice) - toAmount(course.price));
}

export function isOnSale(course) {
  return savingOn(course) > 0;
}

export function discountPercent(course) {
  const listed = toAmount(course.listPrice);
  if (listed <= 0) return 0;
  return Math.round((savingOn(course) / listed) * 100);
}

export function sumPrices(courses) {
  return courses.reduce((total, course) => total + toAmount(course.price), 0);
}

export function sumListPrices(courses) {
  return courses.reduce((total, course) => total + toAmount(course.listPrice), 0);
}