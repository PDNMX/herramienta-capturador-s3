// @ts-nocheck
"use client";

import BreadCrumb from "@/components/breadcrumb";
import { EntesTable } from "@/components/tables/entes-table/table";
import directus from "@/lib/directus";
import { readItems, withToken } from "@directus/sdk";
import { useEffect, useState } from "react";
import { useCurrentSession } from "@/hooks/useCurrentSession";
import { signOut } from "next-auth/react";

const breadcrumbItems = [{ title: "Entes Públicos", link: "/dashboard/entes" }];

export default function Page() {
  const { session, status } = useCurrentSession();
  const [entes, setEntes] = useState([]);
  console.log(session)

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
                sort: ["nombre"],
                limit: "-1",
                fields: ["*"],
              }),
            ),
          );

          setEntes(result);
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }

      fetchData();
    }
  }, [session, status]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <EntesTable data={entes} />
    </div>
  );
}
