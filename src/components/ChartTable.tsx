type ChartTableRow = { label: string; cells: readonly string[] }

type Props = {
  caption: string
  /** Column headers. The first one labels the row-header column. */
  headers: readonly string[]
  rows: readonly ChartTableRow[]
}

/** Data table behind a chart, shown in a details element next to the SVG. */
export function ChartTable({ caption, headers, rows }: Props) {
  return (
    <table>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} scope="col">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            {row.cells.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
