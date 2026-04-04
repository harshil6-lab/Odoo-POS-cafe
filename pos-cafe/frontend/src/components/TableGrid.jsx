import { getTableStatusTone } from '../utils/helpers';

const TABLE_DOT_STYLES = {
  available: 'bg-emerald-400',
  occupied: 'bg-amber-400',
  reserved: 'bg-violet-400',
  cleaning: 'bg-slate-400',
};

function groupTablesByFloor(tables) {
  return tables.reduce((groups, table) => {
    const floor = table.floor || 'Floor';
    if (!groups[floor]) {
      groups[floor] = [];
    }

    groups[floor].push(table);
    return groups;
  }, {});
}

function TableGrid({
  tables,
  selectedTableId = null,
  onSelect,
  actionLabel = 'Open table',
  emptyMessage = 'No tables are available yet.',
  compact = false,
}) {
  if (!tables.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#374151] bg-[#111827] p-6 text-sm text-[#9CA3AF]">
        {emptyMessage}
      </div>
    );
  }

  const groups = groupTablesByFloor(tables);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([floorName, floorTables]) => (
        <section key={floorName} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-medium text-[#F9FAFB]">{floorName}</h3>
            <p className="text-sm text-[#9CA3AF]">{floorTables.length} tables</p>
          </div>

          <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-4'}`}>
            {floorTables.map((table) => {
              const isSelected = selectedTableId === table.id;
              const tooltip = `Table ${table.tableCode || table.id} • ${table.seats} seats • Status ${table.status}`;

              return (
                <button
                  key={table.id}
                  type="button"
                  title={tooltip}
                  onClick={() => onSelect?.(table)}
                  className={`group relative rounded-xl border p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    isSelected ? 'border-[#F59E0B] bg-[#182235]' : 'border-[#374151] bg-[#111827]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${TABLE_DOT_STYLES[table.status] || 'bg-slate-400'}`} />
                        <p className="text-base font-semibold text-[#F9FAFB]">{table.tableCode || table.id}</p>
                      </div>
                      <p className="mt-2 text-sm text-[#9CA3AF]">{table.seats} seats</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm ${getTableStatusTone(table.status)}`}>
                      {table.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-[#9CA3AF]">{table.note}</p>
                  <p className="mt-4 text-sm font-medium text-[#F59E0B]">{isSelected ? 'Selected' : actionLabel}</p>

                  <div className="pointer-events-none absolute bottom-full left-4 z-10 hidden rounded-lg border border-[#374151] bg-[#0B1220] px-3 py-2 text-sm text-[#F9FAFB] shadow-lg group-hover:block">
                    <p>{`Table ${table.tableCode || table.id}`}</p>
                    <p className="mt-1 text-[#9CA3AF]">{table.seats} seats</p>
                    <p className="mt-1 text-[#9CA3AF]">Status {table.status}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default TableGrid;