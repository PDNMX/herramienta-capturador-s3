import React, { useState } from "react";
import { InfoIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

import icoSujetosObligados from "./icons-thead/sujetosObligados.svg";
import icoConexiones from "./icons-thead/conexiones.svg";
import icoS1 from "./icons-thead/s1.svg";
import icoS2 from "./icons-thead/s2.svg";
import icoS3OIC from "./icons-thead/s3OIC.svg";
import icoS3Tribunal from "./icons-thead/s3Tribunal.svg";
import icoS6 from "./icons-thead/s6.svg";
import icoTribunal from "./icons-thead/tribunal.svg";
import icoOIC from "./icons-thead/oic.svg";
import camp from "./icons-thead/cal.svg";

const InfoAlert = () => {
  const [isOpen, setIsOpen] = useState(false);

  const columnInfo = [
    {
      icon: icoSujetosObligados,
      title: "Sujetos Obligados",
      description:
        "Número total de Sujetos Obligados en la entidad federativa.",
    },
    {
      icon: icoOIC,
      title: "OIC",
      description:
        "Número de Órganos Internos de Control en la entidad federativa.",
    },
    {
      icon: icoTribunal,
      title: "Tribunal",
      description:
        "Número de Tribunales de Justicia Administrativa en la entidad federativa.",
    },
    {
      icon: icoS1,
      title: "Sistema 1",
      description:
        "Sujetos Obligados conectados al Sistema de evolución patrimonial, de declaración de intereses y constancia de presentación de declaración fiscal",
    },
    {
      icon: icoS2,
      title: "Sistema 2",
      description:
        "Sujetos Obligados conectados al Sistema de los servidores públicos que intervengan en procedimientos de contrataciones públicas.",
    },
    {
      icon: icoS3OIC,
      title: "Sistema 3 OIC",
      description:
        "Órganos Internos de Control conectados al Sistema de Servidores Públicos y Particulares Sancionados.",
    },
    {
      icon: icoS3Tribunal,
      title: "Sistema 3 Tribunal",
      description:
        "Tribunales de Justicia Administrativa conectados al Sistema nacional de servidores públicos y particulares sancionados.",
    },
    {
      icon: icoS6,
      title: "Sistema 6",
      description:
        "Sujetos Obligados conectados al Sistema de información pública de contrataciones.",
    },
    {
      icon: icoConexiones,
      title: "Conexiones",
      description:
        "Porcentaje de Sujetos Obligados conectados a los Sistemas 1, 2 y 6.",
    },
    {
      icon: camp,
      title: "Campeonato S1",
      description: "Porcentaje de avance en la interconexión al Sistema 1.",
    },
  ];

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-lg blur-sm animate-pulse"></div>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full relative z-10 bg-background hover:bg-primary/10 dark:bg-background dark:hover:bg-primary/20 border-2 border-primary transition-all duration-300 ease-in-out"
        >
          <InfoIcon className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium">Guía de Símbolos</span>
          <ChevronRight className="h-4 w-4 ml-auto text-primary" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">
              Descripción de los Símbolos
            </DialogTitle>
            <DialogDescription className="text-base">
              Explora una explicación detallada sobre los símbolos y columnas
              presentes en el Tablero Estadístico.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {columnInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex-shrink-0">
                  <Image
                    src={info.icon}
                    alt={info.title}
                    width={40}
                    height={40}
                    className="mt-1"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-sm">{info.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {info.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoAlert;
