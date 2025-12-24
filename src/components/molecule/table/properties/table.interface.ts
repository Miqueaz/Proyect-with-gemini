interface TableRow {
  id: string;
  value: string;
}

interface TableProps {
  data: TableRow[];
}

export type { TableProps, TableRow };
