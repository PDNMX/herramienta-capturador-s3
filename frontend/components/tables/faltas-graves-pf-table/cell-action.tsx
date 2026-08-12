// @ts-nocheck
"use client";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const CellAction = ({ data }: any) => {
  return (
    <div className="flex justify-end">
      <Link
        href={`/inicio/faltas-graves-pf/${data.id}`}
        title="Editar registro"
        className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
};
