// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import { Overview } from "@/components/overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import icoS1 from "@/components/tables/cobertura-table/icons-thead/s1.svg";
import icoS2 from "@/components/tables/cobertura-table/icons-thead/s2.svg";
import icoS3OIC from "@/components/tables/cobertura-table/icons-thead/s3OIC.svg";
import icoS6 from "@/components/tables/cobertura-table/icons-thead/s6.svg";
import iconEjecutivo from "@/components/tables/cobertura-table/icons-thead/ejecutivo.svg";
import iconJudicial from "@/components/tables/cobertura-table/icons-thead/judicial.svg";
import iconLegislativo from "@/components/tables/cobertura-table/icons-thead/legislativo.svg";
import iconAutonomo from "@/components/tables/cobertura-table/icons-thead/autonomo.svg";
import iconEjecutivoMunicipal from "@/components/tables/cobertura-table/icons-thead/ejecutivo_municipal.svg";
import iconOICE from "@/components/tables/cobertura-table/icons-thead/oice.svg";
import iconOICM from "@/components/tables/cobertura-table/icons-thead/oicm.svg";
import iconTJA from "@/components/tables/cobertura-table/icons-thead/tribunal.svg";

const colors = {
  sistema1: "text-[#F29888]",
  sistema2: "text-[#B25FAC]",
  sistema3: "text-[#9085DA]",
  sistema6: "text-[#42A5CC]",
};

export default function Page() {
  const { session, status } = useCurrentSession();
  const [data, setData] = useState({
    sistema1: 0,
    sistema2: 0,
    sistema3: 0,
    sistema6: 0,
    totalSujetosObligados: 0,
    totalOIC: 0,
  });

  const [counts, setCounts] = useState({
    ejecutivo: 0,
    judicial: 0,
    legislativo: 0,
    autonomo: 0,
    ejecutivoMunicipal: 0,
    OIC: 0,
    OICM: 0,
    TJA: 0,
  });

  useEffect(() => {
    if (session?.forceLogout) {
      signOut({ callbackUrl: "/" });
    } else if (status === "authenticated") {
      async function fetchData() {
        try {
          const result = await directus.request(
            withToken(
              session?.access_token,
              readItems("entes", {
                limit: "-1",
                fields: [
                  "*",
                  "controlOIC",
                  "controlTribunal",
                  "ambitoGobierno",
                  "poderGobierno",
                ],
              }),
            ),
          );

          // Procesar datos
          const processedData = result.reduce(
            (acc, item) => {
              if (!item.controlOIC) {
                if (item.sistema1) acc.sistema1 += 1;
                if (item.sistema2) acc.sistema2 += 1;
                if (item.sistema6) acc.sistema6 += 1;
                acc.totalSujetosObligados += 1;

                if (item.ambitoGobierno !== "Municipal") {
                  if (item.poderGobierno === "Ejecutivo") acc.ejecutivo += 1;
                  if (item.poderGobierno === "Judicial") acc.judicial += 1;
                  if (item.poderGobierno === "Legislativo")
                    acc.legislativo += 1;
                  if (item.poderGobierno === "Autonomo") acc.autonomo += 1;
                } else {
                  if (item.poderGobierno === "Ejecutivo")
                    acc.ejecutivoMunicipal += 1;
                }
              }
              if (item.controlOIC || item.controlTribunal) {
                if (item.controlOIC) {
                  if (item.ambitoGobierno === "Estatal") acc.OIC += 1;
                  if (item.ambitoGobierno === "Municipal") acc.OICM += 1;
                }
                if (item.controlTribunal) {
                  acc.TJA += 1;
                }
                if (item.sistema3) acc.sistema3 += 1;
                acc.totalOIC += 1;
              }
              return acc;
            },
            {
              sistema1: 0,
              sistema2: 0,
              sistema3: 0,
              sistema6: 0,
              totalSujetosObligados: 0,
              totalOIC: 0,
              ejecutivo: 0,
              judicial: 0,
              legislativo: 0,
              autonomo: 0,
              ejecutivoMunicipal: 0,
              OIC: 0,
              OICM: 0,
              TJA: 0,
            },
          );

          setData(processedData);
          setCounts(processedData);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchData();
    }
  }, [session, status]);

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(2);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hola, ¡Bienvenido de nuevo! 👋
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>
                Visualiza en tiempo real el avance de los Entes Públicos en la
                interconexión a los siguientes sistemas de la{" "}
                <strong>Plataforma Digital Nacional</strong>:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex items-center">
                <Image
                  src={icoS1}
                  alt="Icono S1"
                  width={20}
                  height={20}
                  className="mr-2"
                />{" "}
                - Sistema de evolución patrimonial, de declaración de intereses
                y constancia de presentación de declaración fiscal
              </p>
              <p className="flex items-center">
                <Image
                  src={icoS2}
                  alt="Icono S2"
                  width={20}
                  height={20}
                  className="mr-2"
                />{" "}
                - Sistema de los Servidores públicos que intervengan en
                procedimientos de contrataciones públicas
              </p>
              <p className="flex items-center">
                <Image
                  src={icoS3OIC}
                  alt="Icono S3OIC"
                  width={20}
                  height={20}
                  className="mr-2"
                />{" "}
                - Sistema nacional de Servidores públicos y particulares
                sancionados
              </p>
              <p className="flex items-center">
                <Image
                  src={icoS6}
                  alt="Icono S6"
                  width={20}
                  height={20}
                  className="mr-2"
                />{" "}
                - Sistema de Información Pública de Contrataciones
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-bold tracking-tight ${colors.sistema1}`}>
                Entes Públicos Conectados al Sistema 1
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colors.sistema1}`}>
                {data.sistema1}
              </div>
              <p className={`text-xs ${colors.sistema1}`}>
                {calculatePercentage(data.sistema1, data.totalSujetosObligados)}
                % de los sujetos obligados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-bold tracking-tight ${colors.sistema2}`}>
                Entes Públicos Conectados al Sistema 2
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colors.sistema2}`}>
                {data.sistema2}
              </div>
              <p className={`text-xs ${colors.sistema2}`}>
                {calculatePercentage(data.sistema2, data.totalSujetosObligados)}
                % de los sujetos obligados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-bold tracking-tight ${colors.sistema3}`}>
                Autoridades Resolutoras Conectados al Sistema 3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colors.sistema3}`}>
                {data.sistema3}
              </div>
              <p className={`text-xs ${colors.sistema3}`}>
                {calculatePercentage(data.sistema3, data.totalOIC)}% de los OIC
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className={`text-sm font-bold tracking-tight ${colors.sistema6}`}>
                Entes Públicos Conectados al Sistema 6
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${colors.sistema6}`}>
                {data.sistema6}
              </div>
              <p className={`text-xs ${colors.sistema6}`}>
                {calculatePercentage(data.sistema6, data.totalSujetosObligados)}
                % de los sujetos obligados
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Avance del Segundo Trimestre</CardTitle>
              <CardDescription>
                Última actualización: 30 de junio de 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview entidad={session?.user?.entidad} />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Clasificación Entes Públicos</CardTitle>
              <CardDescription>Sujetos Obligados</CardDescription>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconEjecutivo}
                      alt="Icono Ejecutivo"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Ejecutivo Estatal - {counts.ejecutivo}
                  </div>
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconJudicial}
                      alt="Icono Judicial"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Judicial Estatal - {counts.judicial}
                  </div>
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconLegislativo}
                      alt="Icono Legislativo"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Legislativo Estatal - {counts.legislativo}
                  </div>
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconAutonomo}
                      alt="Icono Autonomo"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Autónomo Estatal - {counts.autonomo}
                  </div>
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconEjecutivoMunicipal}
                      alt="Icono Ejecutivo Municipal"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Ejecutivo Municipal - {counts.ejecutivoMunicipal}
                  </div>
                </div>
              </CardContent>
              <CardDescription>Órganos Internos de Control</CardDescription>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconOICE}
                      alt="Icono OIC"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    OICE Órganos Internos de Control Estatales - {counts.OIC}
                  </div>
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconOICM}
                      alt="Icono OICM"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    OICM Órganos Internos de Control Municipales - {counts.OICM}
                  </div>
                </div>
              </CardContent>
              <CardDescription>
                Tribunal de Justicia Administrativa
              </CardDescription>
              <CardContent>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <Image
                      src={iconTJA}
                      alt="Icono TJA"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Tribunal de Justicia Administrativa - {counts.TJA}
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
