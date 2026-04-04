import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

export default function TableEntry() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { tables, setSelectedTableId } = useAppState();

  useEffect(() => {
    const matchedTable = tables.find((table) => table.id === tableId);

    if (matchedTable) {
      setSelectedTableId(matchedTable.id);
    }

    navigate('/menu', { replace: true });
  }, [navigate, setSelectedTableId, tableId, tables]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 text-center shadow-sm">
        <p className="text-2xl font-semibold text-[#F9FAFB]">Opening your table menu</p>
        <p className="mt-3 text-sm leading-7 text-slate-400">We are preparing the ordering view for table {tableId}.</p>
      </div>
    </div>
  );
}