import { useTable } from "@tanstack/react-table";

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
  DataGridTable,
} from "@qr-manager/ui";

interface CodeRow {
  name: string;
  type: string;
  destination: string;
  scans: number;
  created: string;
}

const rows: CodeRow[] = [
  {
    name: "Spring launch flyer",
    type: "URL",
    destination: "/r/spring-25",
    scans: 1284,
    created: "Mar 2, 2026",
  },
  {
    name: "Reception Wi-Fi",
    type: "Wi-Fi",
    destination: "GuestNet (WPA2)",
    scans: 412,
    created: "Feb 18, 2026",
  },
  {
    name: "Conference badge",
    type: "vCard",
    destination: "Ada Okonkwo",
    scans: 96,
    created: "Feb 4, 2026",
  },
  {
    name: "Warehouse door",
    type: "URL",
    destination: "/r/wh-door",
    scans: 3520,
    created: "Jan 9, 2026",
  },
];

const columns = [
  { id: "name", accessorKey: "name", header: "Code" },
  { id: "type", accessorKey: "type", header: "Type" },
  { id: "destination", accessorKey: "destination", header: "Destination" },
  {
    id: "scans",
    accessorKey: "scans",
    header: "Scans",
    cell: ({ row }: { row: { original: CodeRow } }) =>
      row.original.scans.toLocaleString(),
  },
  { id: "created", accessorKey: "created", header: "Created" },
];

function useCodesTable() {
  return useTable({
    features: dataGridFeatures,
    columns,
    data: rows,
    getRowId: (row: CodeRow) => row.name,
  });
}

export function Basic() {
  const table = useCodesTable();
  return (
    <DataGrid table={table} recordCount={rows.length}>
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}

export function Dense() {
  const table = useCodesTable();
  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      tableLayout={{ dense: true, stripped: true, headerBackground: true }}
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}

export function Empty() {
  const table = useTable({
    features: dataGridFeatures,
    columns,
    data: [] as CodeRow[],
  });
  return (
    <DataGrid
      table={table}
      recordCount={0}
      emptyMessage="No QR codes match these filters."
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}

export function Loading() {
  const table = useCodesTable();
  return (
    <DataGrid
      table={table}
      recordCount={rows.length}
      isLoading
      loadingMode="skeleton"
    >
      <DataGridContainer>
        <DataGridTable />
      </DataGridContainer>
    </DataGrid>
  );
}
