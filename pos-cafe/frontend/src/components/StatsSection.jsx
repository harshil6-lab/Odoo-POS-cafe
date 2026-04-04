import { useAppState } from '../context/AppStateContext';

const stats = [
  { name: 'Tables', key: 'tables' },
  { name: 'Realtime Kitchen', value: 'Live' },
  { name: 'Role Permissions', value: '4 Roles' },
  { name: 'Instant Billing', value: 'Enabled' },
];

export default function StatsSection() {
  const { tables } = useAppState();
  const statValues = {
    tables: tables.length,
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="text-center">
              <p className="text-4xl font-bold text-white sm:text-5xl">
                {stat.value || statValues[stat.key]}
              </p>
              <p className="mt-2 text-lg text-text-secondary">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}