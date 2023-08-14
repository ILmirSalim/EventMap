export default function averageRating(array: number[]) {
  if (array.length === 0) return null;
  const avg = array.reduce((acc, current) => acc + current, 0) / array.length;
  return avg.toFixed(1);
};