import React from 'react'

const DataTable = ({ columns, data, styleConfig = {} }) => {
    const {
        table = '',
        header = '',
        row = '',
        cell = '',
      } = styleConfig

    return (
        <div className="overflow-x-auto">
          <table className={`min-w-full table-auto border border-gray-300 text-center ${table}`}>
            <thead className={`${header}`}>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-4 py-2 border-b sticky top-0 bg-white z-10${cell}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={idx} className={`${row}`}>
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-4 py-2 border-b ${cell}`}>
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={`px-4 py-2 text-center text-gray-500 ${cell}`}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )
}

export default DataTable