// @ts-nocheck
"use client";
import fs from "fs";
import path from "path";
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Download, Check, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";
import * as XLSX from "xlsx";
import { EntesTable } from "@/components/tables/cell-entes-table/table";
import { TabsColumnsSistemas } from "@/components/charts/tabs-columns-sistemas";

import { ArrowUpDown, BarChart2 } from "lucide-react";
import InfoAlert from "./info-alert"; // Importa el componente InfoAlert

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredColumnId, setHoveredColumnId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const Table = React.forwardRef<
    HTMLTableElement,
    React.HTMLAttributes<HTMLTableElement>
  >(({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  ));
  Table.displayName = "Table";

  const TableHeader = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("sticky top-0 bg-secondary [&_tr]:border-b", className)}
      {...props}
    />
  ));
  TableHeader.displayName = "TableHeader";

  const TableFooter = React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("sticky top-0 bg-secondary [&_tr]:border-b", className)}
      {...props}
    />
  ));
  TableFooter.displayName = "TableFooter";

  const table = useReactTable({
    data: data.sort((a, b) => a.entidad.localeCompare(b.entidad)),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    /* initialState: {
      sorting: [{ id: 'entidad', desc: false }]
    }, */
  });

  async function fetchDataCell(entidad: string | null, tipoColumna: string) {
    const filter = {
      ...(entidad && { entidad: { _eq: entidad } }), // Filtra por entidad si se proporciona
      ...(tipoColumna === "resultSujetosObligados" && {
        controlOIC: { _eq: false },
      }),
      ...(tipoColumna === "resultOIC" && {
        _or: [
          { controlOIC: { _eq: true } },
          { controlTribunal: { _eq: true } },
        ],
      }),
      ...(tipoColumna === "resultTribunal" && {
        controlTribunal: { _eq: true },
      }),
      ...(tipoColumna === "resultSistema1" && {
        sistema1: { _eq: true },
        controlOIC: { _eq: false },
      }),
      ...(tipoColumna === "resultSistema2" && {
        sistema2: { _eq: true },
        controlOIC: { _eq: false },
      }),
      ...(tipoColumna === "resultSistema3OIC" && {
        sistema3: { _eq: true },
        _or: [
          { controlOIC: { _eq: true } },
          { controlTribunal: { _eq: true } },
        ],
      }),
      ...(tipoColumna === "resultSistema3Tribunal" && {
        sistema3: { _eq: true },
        controlOIC: { _eq: false },
        controlTribunal: { _eq: true },
      }),
      ...(tipoColumna === "resultSistema6" && {
        sistema6: { _eq: true },
        controlOIC: { _eq: false },
      }),
      ...(tipoColumna === "resultConexiones" && {
        controlOIC: { _eq: false },
        _or: [
          { sistema1: { _eq: true } },
          { sistema2: { _eq: true } },
          { sistema6: { _eq: true } },
        ],
      }),
      ...(tipoColumna === "resultCampeonatoS1" && {
        sistema1: { _eq: true },
        controlOIC: { _eq: false },
      }),
    };

    const options = {
      filter,
      fields: ["*", "entidad.nombre", "municipio.nombre"], // Incluir campos relacionados
      ...(entidad === null && {
        aggregate: { count: ["*"] },
        groupBy: ["entidad.id"],
      }),
      ...(entidad !== null && { sort: ["nombre"], limit: "-1" }),
    };

    try {
      const result = await directus.request(readItems("entes", options));
      return result;
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      return null;
    }
  }

  const handleCellClick = async (cell: any) => {
    setIsLoading(true);
    setIsDialogOpen(true);
    if (cell.row) {
      const rowElement = cell.row.original;
      const entidad = rowElement.entidad;
      const tipoColumna = cell.column.id;

      const columnVisibilityMap = {
        resultSujetosObligados: {
          sistema1: true,
          sistema2: true,
          sistema3: false,
          sistema6: true,
        },
        resultOIC: {
          sistema1: false,
          sistema2: false,
          sistema3: true,
          sistema6: false,
        },
        resultTribunal: {
          sistema1: true,
          sistema2: true,
          sistema3: true,
          sistema6: true,
        },
        resultSistema1: {
          sistema1: true,
          sistema2: false,
          sistema3: false,
          sistema6: false,
        },
        resultSistema2: {
          sistema1: false,
          sistema2: true,
          sistema3: false,
          sistema6: false,
        },
        resultSistema3: {
          sistema1: false,
          sistema2: false,
          sistema3: true,
          sistema6: false,
        },
        resultSistema3OIC: {
          sistema1: false,
          sistema2: false,
          sistema3: true,
          sistema6: false,
        },
        resultSistema3Tribunal: {
          sistema1: false,
          sistema2: false,
          sistema3: true,
          sistema6: false,
        },
        resultSistema6: {
          sistema1: false,
          sistema2: false,
          sistema3: false,
          sistema6: true,
        },
        resultConexiones: {
          sistema1: true,
          sistema2: true,
          sistema3: false,
          sistema6: true,
        },
        resultCampeonatoS1: {
          sistema1: true,
          sistema2: false,
          sistema3: false,
          sistema6: false,
        },
      };

      const columnasMostrar = columnVisibilityMap[tipoColumna] || {};

      const respuestaDirectus = await fetchDataCell(entidad, tipoColumna);
      setDialogContent(
        <EntesTable data={respuestaDirectus} columnsShow={columnasMostrar} />
      );
      setIsLoading(false);
      //setIsDialogOpen(true);

      // Función para procesar los datos antes de exportar a XLSX
      const processDataForXLSX = (data) => {
        return data.map((item) => ({
          ID: item.id,
          "Nombre del Ente Público": item.nombre,
          "Tipo de Autoridad": getTipoAutoridad(
            item.controlOIC,
            item.controlTribunal
          ),
          "Ambito de Gobierno": item.ambitoGobierno,
          "Poder de Gobierno": item.poderGobierno,
          "Sistema 1": item.sistema1 ? "Sí" : "No",
          "Sistema 2": item.sistema2 ? "Sí" : "No",
          "Sistema 3": item.sistema3 ? "Sí" : "No",
          "Sistema 6": item.sistema6 ? "Sí" : "No",
          Entidad: item.entidad?.nombre || "N/A",
          Municipio: item.municipio?.nombre || "N/A",
          // Añade aquí más campos si es necesario
        }));
      };

      // Función de exportación para XLSX (datos procesados)
      const exportToXLSX = async () => {
        const processedData = processDataForXLSX(respuestaDirectus);

        // Crear una nueva hoja de trabajo
        const ws = XLSX.utils.json_to_sheet([]);

        // Agregar el encabezado
        const header = [
          [
            {
              v: "Secretaría Ejecutiva del Sistema Nacional Anticorrupción",
              s: { font: { bold: true, sz: 14 } },
            },
          ],
          [
            {
              v: "PLATAFORMA DIGITAL NACIONAL",
              s: { font: { bold: true, sz: 14 } },
            },
          ],
          [""], // Espacio en blanco
          [
            {
              v: "Tablero Estadístico de Interconexión Nacional",
              s: { font: { bold: true, sz: 14 } },
            },
          ],
          [""], // Espacio en blanco
          [
            { v: "Fecha de generación:", s: { font: { bold: true } } },
            { v: new Date().toLocaleString() },
          ],
          [""], // Espacio en blanco
          [""], // Espacio adicional antes de los datos
        ];

        // Añadir el encabezado y los datos
        XLSX.utils.sheet_add_aoa(ws, header, { origin: "A1" });
        XLSX.utils.sheet_add_json(ws, processedData, { origin: -1 });

        // Ajustar el ancho de las columnas
        ws["!cols"] = [{ wch: 20 }, { wch: 30 }, { wch: 100 }];

        // Aplicar estilos
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = { c: C, r: R };
            const cellRef = XLSX.utils.encode_cell(cellAddress);
            if (!ws[cellRef]) continue;

            ws[cellRef].s = {
              font: { name: "Calibri", sz: 11 },
              alignment: {
                vertical: "center",
                horizontal: "left",
                wrapText: true,
              },
            };

            if (R < 4) {
              ws[cellRef].s.font.bold = true;
            }
          }
        }

        // Crear el libro de trabajo y añadir la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Datos");

        // Escribir el archivo Excel
        XLSX.writeFileXLSX(wb, "tablero_cobertura.xlsx");
      };

      // Función de exportación para CSV (datos originales)
      const exportToCSV = () => {
        const csvContent = convertToCSV(respuestaDirectus);
        downloadFile(csvContent, "text/csv", "export_origin.csv");
      };

      // Función de exportación para JSON (datos originales)
      const exportToJSON = () => {
        const jsonContent = JSON.stringify(respuestaDirectus, null, 2);
        downloadFile(jsonContent, "application/json", "export_origin.json");
      };

      setDialogContent(
        <>
          <EntesTable data={respuestaDirectus} columnsShow={columnasMostrar} />
          <div className="flex justify-end mt-4">
            <Button onClick={exportToXLSX} className="mr-2">
              <Download className="mr-2 h-4 w-4" /> XLSX
            </Button>
            <Button onClick={exportToCSV} className="mr-2">
              <Download className="mr-2 h-4 w-4" /> CSV
            </Button>
            <Button onClick={exportToJSON}>
              <Download className="mr-2 h-4 w-4" /> JSON
            </Button>
          </div>
        </>
      );
    } else if (cell.column) {
      const tipoColumna = cell.column.id;
      if (
        tipoColumna === "resultSujetosObligados" ||
        tipoColumna === "resultOIC" ||
        tipoColumna === "resultTribunal" ||
        tipoColumna === "resultConexiones" ||
        tipoColumna === "resultCampeonatoS1"
      ) {
        return;
      }

      const nombreAmigableMap = {
        resultSistema1: "Sistema 1",
        resultSistema2: "Sistema 2",
        resultSistema3OIC: "Sistema 3 OIC",
        resultSistema3Tribunal: "Sistema 3 Tribunal",
        resultSistema6: "Sistema 6",
      };

      let dataEntidad;
      if (tipoColumna === "resultSistema3OIC") {
        dataEntidad = data.map((item) => ({
          ...item,
          count: Number(
            ((item[tipoColumna] / item.resultOIC) * 100).toFixed(2)
          ),
        }));
      } else if (tipoColumna === "resultSistema3Tribunal") {
        dataEntidad = data.map((item) => ({
          ...item,
          count: Number(
            ((item[tipoColumna] / item.resultTribunal) * 100).toFixed(2)
          ),
        }));
      } else {
        dataEntidad = data.map((item) => ({
          ...item,
          count: Number(
            ((item[tipoColumna] / item.resultSujetosObligados) * 100).toFixed(2)
          ),
        }));
      }

      let dataNacional;
      if (tipoColumna === "resultSistema3OIC") {
        const totalEntes = data.reduce((acc, item) => acc + item.resultOIC, 0);
        const conectados = data.reduce(
          (acc, item) => acc + item[tipoColumna],
          0
        );
        const porcentajeConectados = (conectados / totalEntes) * 100;
        dataNacional = [
          {
            sistema: nombreAmigableMap[tipoColumna],
            count: parseFloat(porcentajeConectados.toFixed(2)), // Convertir a porcentaje con 2 decimales
            conectados,
            totalEntes,
          },
        ];
      } else if (tipoColumna === "resultSistema3Tribunal") {
        const totalEntes = data.reduce(
          (acc, item) => acc + item.resultTribunal,
          0
        );
        const conectados = data.reduce(
          (acc, item) => acc + item[tipoColumna],
          0
        );
        const porcentajeConectados = (conectados / totalEntes) * 100;
        dataNacional = [
          {
            sistema: nombreAmigableMap[tipoColumna],
            count: parseFloat(porcentajeConectados.toFixed(2)), // Convertir a porcentaje con 2 decimales
            conectados,
            totalEntes,
          },
        ];
      } else {
        const totalEntes = data.reduce(
          (acc, item) => acc + item.resultSujetosObligados,
          0
        );
        const conectados = data.reduce(
          (acc, item) => acc + item[tipoColumna],
          0
        );
        const porcentajeConectados = (conectados / totalEntes) * 100;
        dataNacional = [
          {
            sistema: nombreAmigableMap[tipoColumna],
            count: parseFloat(porcentajeConectados.toFixed(2)), // Convertir a porcentaje con 2 decimales
            conectados,
            totalEntes,
          },
        ];
      }

      // Obtener datos de ambito
      let dataAmbito = [];

      const fetchAmbitoData = async () => {
        try {
          const ambitoQueries = {
            resultSistema1: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema2: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema3OIC: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema3Tribunal: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema6: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSujetosObligados: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultOIC: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultTribunal: {
              federal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Federal" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              estatal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Estatal" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              municipal: readItems("entes", {
                filter: {
                  ambitoGobierno: { _eq: "Municipal" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
          };

          let resultFederal, resultEstatal, resultMunicipal;
          let totalFederal, totalEstatal, totalMunicipal;

          if (tipoColumna === "resultSistema3OIC") {
            [resultFederal, resultEstatal, resultMunicipal] = await Promise.all(
              [
                directus.request(ambitoQueries.resultSistema3OIC.federal),
                directus.request(ambitoQueries.resultSistema3OIC.estatal),
                directus.request(ambitoQueries.resultSistema3OIC.municipal),
              ]
            );

            const totalOICFederal = await directus.request(
              ambitoQueries.resultOIC.federal
            );
            const totalOICEstatal = await directus.request(
              ambitoQueries.resultOIC.estatal
            );
            const totalOICMunicipal = await directus.request(
              ambitoQueries.resultOIC.municipal
            );

            totalFederal = totalOICFederal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalEstatal = totalOICEstatal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalMunicipal = totalOICMunicipal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
          } else if (tipoColumna === "resultSistema3Tribunal") {
            [resultFederal, resultEstatal, resultMunicipal] = await Promise.all(
              [
                directus.request(ambitoQueries.resultSistema3Tribunal.federal),
                directus.request(ambitoQueries.resultSistema3Tribunal.estatal),
                directus.request(
                  ambitoQueries.resultSistema3Tribunal.municipal
                ),
              ]
            );

            const totalTribunalFederal = await directus.request(
              ambitoQueries.resultTribunal.federal
            );
            const totalTribunalEstatal = await directus.request(
              ambitoQueries.resultTribunal.estatal
            );
            const totalTribunalMunicipal = await directus.request(
              ambitoQueries.resultTribunal.municipal
            );

            totalFederal = totalTribunalFederal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalEstatal = totalTribunalEstatal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalMunicipal = totalTribunalMunicipal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
          } else {
            [resultFederal, resultEstatal, resultMunicipal] = await Promise.all(
              [
                directus.request(ambitoQueries[tipoColumna].federal),
                directus.request(ambitoQueries[tipoColumna].estatal),
                directus.request(ambitoQueries[tipoColumna].municipal),
              ]
            );

            const totalSujetosFederal = await directus.request(
              ambitoQueries.resultSujetosObligados.federal
            );
            const totalSujetosEstatal = await directus.request(
              ambitoQueries.resultSujetosObligados.estatal
            );
            const totalSujetosMunicipal = await directus.request(
              ambitoQueries.resultSujetosObligados.municipal
            );

            totalFederal = totalSujetosFederal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalEstatal = totalSujetosEstatal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalMunicipal = totalSujetosMunicipal.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
          }

          const federalConectados = resultFederal.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );
          const estatalConectados = resultEstatal.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );
          const municipalConectados = resultMunicipal.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );

          const federalPorcentaje = (federalConectados / totalFederal) * 100;
          const estatalPorcentaje = (estatalConectados / totalEstatal) * 100;
          const municipalPorcentaje =
            (municipalConectados / totalMunicipal) * 100;

          dataAmbito = [
            {
              ambito: "Federal",
              count: parseFloat(federalPorcentaje.toFixed(2)),
              conectados: federalConectados,
              totalEntes: totalFederal,
            },
            {
              ambito: "Estatal",
              count: parseFloat(estatalPorcentaje.toFixed(2)),
              conectados: estatalConectados,
              totalEntes: totalEstatal,
            },
            {
              ambito: "Municipal",
              count: parseFloat(municipalPorcentaje.toFixed(2)),
              conectados: municipalConectados,
              totalEntes: totalMunicipal,
            },
          ];
        } catch (error) {
          console.error("Error al cargar los datos de ambito:", error);
        }
      };

      await fetchAmbitoData();

      // Obtener datos de poder
      let dataPoder = [];

      const fetchPoderData = async () => {
        try {
          const poderQueries = {
            resultSistema1: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  sistema1: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema2: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  sistema2: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema3OIC: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  sistema3: { _eq: true },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema3Tribunal: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  sistema3: { _eq: true },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSistema6: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  sistema6: { _eq: true },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultSujetosObligados: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  controlOIC: { _eq: false },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultOIC: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  _or: [
                    { controlOIC: { _eq: true } },
                    { controlTribunal: { _eq: true } },
                  ],
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
            resultTribunal: {
              ejecutivo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Ejecutivo" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              judicial: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Judicial" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              legislativo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Legislativo" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
              autonomo: readItems("entes", {
                filter: {
                  poderGobierno: { _eq: "Autonomo" },
                  controlTribunal: { _eq: true },
                },
                aggregate: { count: ["*"] },
                groupBy: ["entidad"],
              }),
            },
          };

          let resultEjecutivo,
            resultJudicial,
            resultLegislativo,
            resultAutonomo;
          let totalEjecutivo, totalJudicial, totalLegislativo, totalAutonomo;

          if (tipoColumna === "resultSistema3OIC") {
            [
              resultEjecutivo,
              resultJudicial,
              resultLegislativo,
              resultAutonomo,
            ] = await Promise.all([
              directus.request(poderQueries.resultSistema3OIC.ejecutivo),
              directus.request(poderQueries.resultSistema3OIC.judicial),
              directus.request(poderQueries.resultSistema3OIC.legislativo),
              directus.request(poderQueries.resultSistema3OIC.autonomo),
            ]);

            const totalOICEjecutivo = await directus.request(
              poderQueries.resultOIC.ejecutivo
            );
            const totalOICJudicial = await directus.request(
              poderQueries.resultOIC.judicial
            );
            const totalOICLegislativo = await directus.request(
              poderQueries.resultOIC.legislativo
            );
            const totalOICAutonomo = await directus.request(
              poderQueries.resultOIC.autonomo
            );

            totalEjecutivo = totalOICEjecutivo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalJudicial = totalOICJudicial.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalLegislativo = totalOICLegislativo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalAutonomo = totalOICAutonomo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
          } else if (tipoColumna === "resultSistema3Tribunal") {
            [
              resultEjecutivo,
              resultJudicial,
              resultLegislativo,
              resultAutonomo,
            ] = await Promise.all([
              directus.request(poderQueries.resultSistema3Tribunal.ejecutivo),
              directus.request(poderQueries.resultSistema3Tribunal.judicial),
              directus.request(poderQueries.resultSistema3Tribunal.legislativo),
              directus.request(poderQueries.resultSistema3Tribunal.autonomo),
            ]);

            const totalTribunalEjecutivo = await directus.request(
              poderQueries.resultTribunal.ejecutivo
            );
            const totalTribunalJudicial = await directus.request(
              poderQueries.resultTribunal.judicial
            );
            const totalTribunalLegislativo = await directus.request(
              poderQueries.resultTribunal.legislativo
            );
            const totalTribunalAutonomo = await directus.request(
              poderQueries.resultTribunal.autonomo
            );

            totalEjecutivo = totalTribunalEjecutivo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalJudicial = totalTribunalJudicial.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalLegislativo = totalTribunalLegislativo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalAutonomo = totalTribunalAutonomo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
          } else {
            [
              resultEjecutivo,
              resultJudicial,
              resultLegislativo,
              resultAutonomo,
            ] = await Promise.all([
              directus.request(poderQueries[tipoColumna].ejecutivo),
              directus.request(poderQueries[tipoColumna].judicial),
              directus.request(poderQueries[tipoColumna].legislativo),
              directus.request(poderQueries[tipoColumna].autonomo),
            ]);

            const totalSujetosEjecutivo = await directus.request(
              poderQueries.resultSujetosObligados.ejecutivo
            );
            const totalSujetosJudicial = await directus.request(
              poderQueries.resultSujetosObligados.judicial
            );
            const totalSujetosLegislativo = await directus.request(
              poderQueries.resultSujetosObligados.legislativo
            );
            const totalSujetosAutonomo = await directus.request(
              poderQueries.resultSujetosObligados.autonomo
            );

            totalEjecutivo = totalSujetosEjecutivo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalJudicial = totalSujetosJudicial.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalLegislativo = totalSujetosLegislativo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
            totalAutonomo = totalSujetosAutonomo.reduce(
              (acc, item) => acc + Number(item.count),
              0
            );
          }

          const ejecutivoConectados = resultEjecutivo.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );
          const judicialConectados = resultJudicial.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );
          const legislativoConectados = resultLegislativo.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );
          const autonomoConectados = resultAutonomo.reduce(
            (acc, item) => acc + Number(item.count),
            0
          );

          const ejecutivoPorcentaje =
            (ejecutivoConectados / totalEjecutivo) * 100;
          const judicialPorcentaje = (judicialConectados / totalJudicial) * 100;
          const legislativoPorcentaje =
            (legislativoConectados / totalLegislativo) * 100;
          const autonomoPorcentaje = (autonomoConectados / totalAutonomo) * 100;

          dataPoder = [
            {
              poder: "Ejecutivo",
              count: parseFloat(ejecutivoPorcentaje.toFixed(2)),
              conectados: ejecutivoConectados,
              totalEntes: totalEjecutivo,
            },
            {
              poder: "Judicial",
              count: parseFloat(judicialPorcentaje.toFixed(2)),
              conectados: judicialConectados,
              totalEntes: totalJudicial,
            },
            {
              poder: "Legislativo",
              count: parseFloat(legislativoPorcentaje.toFixed(2)),
              conectados: legislativoConectados,
              totalEntes: totalLegislativo,
            },
            {
              poder: "OCAS",
              count: parseFloat(autonomoPorcentaje.toFixed(2)),
              conectados: autonomoConectados,
              totalEntes: totalAutonomo,
            },
          ];
        } catch (error) {
          console.error("Error al cargar los datos de poder:", error);
        }
      };

      await fetchPoderData();

      setIsLoading(false);
      setDialogContent(
        <TabsColumnsSistemas
          dataEntidad={dataEntidad}
          selectedColumn={tipoColumna}
          dataNacional={dataNacional}
          dataAmbito={dataAmbito}
          dataPoder={dataPoder}
        />
      );
    }
  };
  // Función auxiliar para determinar el tipo de autoridad
  const getTipoAutoridad = (controlOIC, controlTribunal) => {
    if (!controlOIC && !controlTribunal) return "Sujeto Obligado";
    if (controlOIC && !controlTribunal) return "Autoridad Resolutora";
    if (!controlOIC && controlTribunal) return "TJA";
    return "Otro"; // Para cualquier otra combinación
  };
  // Función para convertir a CSV (datos originales)
  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value
        )
        .join(",")
    );
    return [headers, ...rows].join("\n");
  };

  const downloadFile = (content, type, filename) => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Modificar la renderización de las celdas para usar íconos
  const renderCell = (value, columnId) => {
    if (columnId.startsWith("sistema")) {
      return value ? (
        <Check className="text-green-500" />
      ) : (
        <X className="text-red-500" />
      );
    }
    return value;
  };

  return (
    <>
      <div className="flex items-center py-4">
        <div className="w-3/4 pr-4">
          <Input
            placeholder={`Filtrar por nombre...`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="w-full"
          />
        </div>
        <div className="w-1/4">
          <InfoAlert />
        </div>
      </div>
      <ScrollArea className="rounded-md border h-[calc(80vh-100px)]">
        <Table className="relative w-full">
          <TableHeader className="sticky bottom-0 bg-gray-200 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() => {
                        if (canSort) {
                          header.column.toggleSorting(
                            header.column.getIsSorted() === "asc"
                          );
                        } else {
                          handleCellClick(header);
                        }
                      }}
                      className="cursor-pointer py-2 relative group transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center justify-center relative">
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        <span className="text-gray-600 dark:text-gray-200 absolute right-0 pr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {canSort ? (
                            <ArrowUpDown className="h-4 w-4" />
                          ) : (
                            <BarChart2 className="h-4 w-4" />
                          )}
                        </span>
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onMouseEnter={() => setHoveredRowId(row.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  className={
                    hoveredRowId === row.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={() => handleCellClick(cell)}
                      onMouseEnter={() => setHoveredColumnId(cell.column.id)}
                      onMouseLeave={() => setHoveredColumnId(null)}
                      className={`cursor-pointer ${
                        hoveredColumnId === cell.column.id
                          ? "bg-gray-200 dark:bg-gray-600"
                          : ""
                      } ${
                        hoveredRowId === row.id &&
                        hoveredColumnId === cell.column.id
                          ? "bg-gray-300 dark:bg-gray-500"
                          : ""
                      } text-center`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-xl"
                >
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter className="sticky bottom-0 bg-gray-200 dark:bg-gray-800">
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    className="text-center py-2 px-0.5 text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
        <DialogContent className="p-6 rounded-md shadow-lg max-w-5xl w-full bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Entes Públicos
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {isLoading ? (
              <div className="flex flex-row items-start gap-2">
                Cargando datos...
                <Loader2 className="animate-spin ml-1" />
              </div>
            ) : (
              <>{dialogContent}</>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="mt-4"
              disabled={isLoading}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
