export default function VegNonVegIcon({ isVeg }) {
  const color = isVeg ? 'border-green-500' : 'border-red-500';
  const dotColor = isVeg ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`w-5 h-5 flex items-center justify-center border ${color} p-0.5`}>
      <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
    </div>
  );
}