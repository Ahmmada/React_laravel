import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ExportDropdownProps {
  onExport: (type: "csv" | "excel" | "pdf") => void;
}

export default function ExportDropdown({ onExport }: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="bg-orange text-orange-foreground"> تصدير</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onExport("csv")}>
          📄 CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("excel")}>
          📊 اكسل
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport("pdf")}>
          🧾 PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}