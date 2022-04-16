export default function sumWithLimits(base: number, increment: number, min: number, max: number) {
  const result = base + increment;

  return (result < min || result > max) ? base : result;
}