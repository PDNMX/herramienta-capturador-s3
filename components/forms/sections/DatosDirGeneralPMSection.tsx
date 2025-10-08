// @ts-nocheck
"use client";

import { DatosRepresentanteFields } from "./DatosRepresentanteFields";

interface DatosDirGeneralPMSectionProps {
  form: any;
  loading: boolean;
}

export const DatosDirGeneralPMSection: React.FC<
  DatosDirGeneralPMSectionProps
> = ({ form, loading }) => {
  return (
    <div className="space-y-6">
      {/* Descripción de la sección */}
      <p className="text-sm text-muted-foreground">
        En el presente apartado se establecen los datos del director general y
        del representante legal de la persona moral
      </p>

      {/* Director General */}
      <DatosRepresentanteFields
        form={form}
        loading={loading}
        fieldPrefix="directorGeneral"
        title="Director general de la persona moral"
      />

      {/* Representante Legal */}
      <DatosRepresentanteFields
        form={form}
        loading={loading}
        fieldPrefix="representanteLegal"
        title="Representante legal de la persona moral"
      />
    </div>
  );
};