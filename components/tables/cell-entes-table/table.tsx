// @ts-nocheck
"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export const EntesTable = ({ data, columnsShow }: object) => {
  return <DataTable searchKey="nombre" columns={columns} data={data} columnsShow={columnsShow} />;
};
