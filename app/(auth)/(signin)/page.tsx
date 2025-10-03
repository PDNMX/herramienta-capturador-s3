// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { CoberturaTable } from "@/components/tables/cobertura-table/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import directus from "@/lib/directus";
import { Loader2 } from "lucide-react";
import { readItems } from "@directus/sdk";

export default function AuthenticationPage() {
  const [entes, setEntes] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    async function fetchCombinarResultadosDirectus() {
      setIsLoading(true);
      try {
        // Realizar ambas solicitudes en paralelo
        const solicitudes = {
          // resultSujetosObligados
          resultSujetosObligados: directus.request(
            readItems("entes", {
              filter: { controlOIC: { _eq: false } },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultOIC
          resultOIC: directus.request(
            readItems("entes", {
              filter: {
                _or: [
                  { controlOIC: { _eq: true } },
                  { controlTribunal: { _eq: true } },
                ],
              },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultTribunal
          resultTribunal: directus.request(
            readItems("entes", {
              filter: { controlTribunal: { _eq: true } },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultSistema1
          resultSistema1: directus.request(
            readItems("entes", {
              filter: { sistema1: { _eq: true }, controlOIC: { _eq: false } },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultSistema2
          resultSistema2: directus.request(
            readItems("entes", {
              filter: { sistema2: { _eq: true }, controlOIC: { _eq: false } },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultSistema3OIC
          resultSistema3OIC: directus.request(
            readItems("entes", {
              filter: {
                sistema3: { _eq: true },
                _or: [
                  { controlOIC: { _eq: true } },
                  { controlTribunal: { _eq: true } },
                ],
              },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultSistema3Tribunal
          resultSistema3Tribunal: directus.request(
            readItems("entes", {
              filter: {
                sistema3: { _eq: true },
                controlOIC: { _eq: false },
                controlTribunal: { _eq: true },
              },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
          // resultSistema6
          resultSistema6: directus.request(
            readItems("entes", {
              filter: { sistema6: { _eq: true }, controlOIC: { _eq: false } },
              aggregate: { count: ["*"] },
              groupBy: ["entidad"],
            })
          ),
        };

        const resultados = await Promise.all(Object.values(solicitudes));

        const combinedData = resultados.reduce((acumulador, result, index) => {
          const conteoAgrupamiento = Object.keys(solicitudes)[index];
          result.forEach((item) => {
            const { entidad, count } = item;
            acumulador[entidad] = {
              ...acumulador[entidad],
              [conteoAgrupamiento]: parseInt(count, 10) || 0, // Convertir a número o usar 0 si es undefined/NaN
            };
          });
          return acumulador;
        }, {});

        // Asegurar que todas las entidades tengan conteos
        for (const entidad in combinedData) {
          for (const conteoAgrupamiento in solicitudes) {
            combinedData[entidad][conteoAgrupamiento] =
              combinedData[entidad][conteoAgrupamiento] || 0;
          }
        }

        // Calcular el campeonato y conexiones para cada entidad
        for (const entidad in combinedData) {
          const totalSO = combinedData[entidad].resultSujetosObligados;
          const sistema1 = combinedData[entidad].resultSistema1;
          const sistema2 = combinedData[entidad].resultSistema2;
          const sistema6 = combinedData[entidad].resultSistema6;

          if (totalSO > 0) {
            const porcentaje = (100 * sistema1) / totalSO;
            let diferencia = 100 - porcentaje;
            if (porcentaje < 50) {
              diferencia = porcentaje;
            }
            const campeonato = porcentaje + (diferencia * totalSO) / 2700;
            combinedData[entidad].resultCampeonatoS1 = Math.round(campeonato); // Redondear y almacenar como número

            const conexiones =
              (100 * (sistema1 + sistema2 + sistema6)) / (3 * totalSO);
            combinedData[entidad].resultConexiones = Math.round(conexiones); // Redondear y almacenar como número
          } else {
            combinedData[entidad].resultCampeonatoS1 = 0; // Almacenar como número
            combinedData[entidad].resultConexiones = 0; // Almacenar como número
          }
        }

        const resultadoFinal = Object.entries(combinedData).map(
          ([entidad, count]) => ({
            entidad,
            ...count,
          })
        );
        //console.log(resultadoFinal);
        setEntes(resultadoFinal);
      } catch (error) {
        setError(error); // Establecer mensaje de error
        console.error("Error al cargar los datos:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCombinarResultadosDirectus();
  }, []);

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="flex flex-row items-start gap-2">
          Cargando datos... 
          <Loader2 className="animate-spin ml-1" />{" "}
          {/* Mensaje de carga */}
        </div> // Mensaje de carga
      ) : error ? (
        <div>Error al cargar los datos: {error.message}</div> // Mensaje de error
      ) : (
        <ScrollArea className="w-full h-full">
          <CoberturaTable data={entes} />
        </ScrollArea>
      )}
    </div>
  );
}
