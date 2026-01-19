"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function CalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#36127a" },
          dark: { "cal-brand": "#fafafa" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="@container/form bg-card border rounded-lg p-4 @md/form:p-6">
      <h3 className="text-xl @md/form:text-2xl font-semibold mb-6">
        Agendar una reunión
      </h3>
      <div style={{ width: "100%", height: "600px", overflow: "auto" }}>
        <Cal
          namespace="30min"
          calLink="marc-bau-benavent/30min"
          style={{ width: "100%", height: "100%", overflow: "scroll" }}
          config={{ layout: "month_view" }}
        />
      </div>
    </div>
  );
}
