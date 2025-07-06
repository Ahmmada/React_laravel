import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { AG_GRID_LOCALE_EG } from "@/locales/ar.ts";
import {
  colorSchemeDarkBlue,
  colorSchemeLightWarm,
  themeQuartz,
} from "ag-grid-community";
import { useAppearance } from "@/hooks/use-appearance";
import { useEffect, useState } from "react";

const themeDark = themeQuartz.withPart(colorSchemeDarkBlue);
const themeLight = themeQuartz.withPart(colorSchemeLightWarm);

export default function ThemedAgGrid(props: AgGridReactProps) {
  const { appearance } = useAppearance();

  const [isDark, setIsDark] = useState(() => {
    return appearance === "dark" ||
      (appearance === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  useEffect(() => {
    if (appearance === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        setIsDark(mediaQuery.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      setIsDark(appearance === "dark");
    }
  }, [appearance]);

  const theme = isDark ? themeDark : themeLight;

  return (
    <div
      className="ag-theme-quartz"
      style={{ height: "70vh", width: "100%", direction: "rtl" }}
    >
      {/* 👇 نستخدم key لإعادة بناء الجدول عند تغير الوضع */}
<AgGridReact
  key={isDark ? "dark" : "light"}
 
    enableRtl
    pagination
      animateRows
      suppressCellFocus
      suppressMovableColumns
  rowHeight={props.rowHeight ?? 40}
  headerHeight={props.headerHeight ?? 45}
  paginationPageSize={props.paginationPageSize ?? 20}
      localeText={AG_GRID_LOCALE_EG}
  {...props}
  theme={theme}
/>
    </div>
  );
}

