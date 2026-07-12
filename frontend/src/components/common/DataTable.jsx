const DataTable = ({ columns, rows, renderRow, renderMobileCard, emptyMessage = 'No records found.' }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length > 0 ? (
              rows.map((row, index) => renderRow(row, index))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.slice(0, 5).map((column) => (
                <th key={column} className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length > 0 ? (
              rows.map((row, index) => renderRow(row, index, 'compact'))
            ) : (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="block space-y-3 p-3 md:hidden">
        {rows.length > 0 ? rows.map((row, index) => renderMobileCard(row, index)) : <p className="text-sm text-slate-500">{emptyMessage}</p>}
      </div>
    </div>
  );
};

export default DataTable;
