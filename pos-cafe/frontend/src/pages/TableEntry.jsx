import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import { getTableByCode } from '../services/tableService';

export default function TableEntry() {
  const { table_code } = useParams();
  const navigate = useNavigate();
  const { setSelectedTableId } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidTable, setIsValidTable] = useState(true);

  useEffect(() => {
    let active = true;

    const resolveTable = async () => {
      try {
        const matchedTable = await getTableByCode(table_code);

        if (!active) {
          return;
        }

        if (matchedTable) {
          const resolvedTableCode = matchedTable.tableCode ?? matchedTable.table_code ?? table_code;
          window.sessionStorage.setItem('table_code', resolvedTableCode);
          setSelectedTableId(resolvedTableCode);
          navigate('/menu', { replace: true });
          return;
        }

        window.sessionStorage.removeItem('table_code');
        setIsValidTable(false);
      } catch {
        if (active) {
          window.sessionStorage.removeItem('table_code');
          setIsValidTable(false);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void resolveTable();

    return () => {
      active = false;
    };
  }, [navigate, setSelectedTableId, table_code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1220] px-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 text-center shadow-sm">
        <p className="text-2xl font-semibold text-[#F9FAFB]">
          {isLoading ? 'Opening your table menu' : isValidTable ? 'Redirecting to menu' : 'Invalid table QR code'}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          {isLoading
            ? `We are validating table ${table_code}.`
            : isValidTable
              ? `Table ${table_code} is valid. Sending you to the menu.`
              : 'Invalid table QR code'}
        </p>
      </div>
    </div>
  );
}