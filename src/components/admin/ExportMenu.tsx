import { Download, FileSpreadsheet, FileText, Sheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Row = Record<string, string | number | null | undefined>;

type Props = {
  filename: string;
  rows: Row[];
  /** Optional column order; defaults to keys of first row */
  columns?: string[];
};

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCSV(rows: Row[], cols: string[]): string {
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.join(",");
  const body = rows.map((r) => cols.map((c) => escape(r[c])).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function ExportMenu({ filename, rows, columns }: Props) {
  const cols = columns ?? (rows[0] ? Object.keys(rows[0]) : []);

  const exportCSV = () => {
    if (!rows.length) return toast.error("No hay datos para exportar");
    const csv = toCSV(rows, cols);
    downloadBlob(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }), `${filename}.csv`);
    toast.success("CSV exportado");
  };

  const exportExcel = async () => {
    if (!rows.length) return toast.error("No hay datos para exportar");
    try {
      const xlsx = await import(/* @vite-ignore */ "xlsx");
      const ws = xlsx.utils.json_to_sheet(rows, { header: cols });
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Datos");
      const buf = xlsx.write(wb, { type: "array", bookType: "xlsx" });
      downloadBlob(new Blob([buf], { type: "application/octet-stream" }), `${filename}.xlsx`);
      toast.success("Excel exportado");
    } catch (e) {
      console.error(e);
      toast.error("Instalá la dependencia 'xlsx' para exportar Excel");
    }
  };

  const exportPDF = async () => {
    if (!rows.length) return toast.error("No hay datos para exportar");
    try {
      const [{ default: jsPDF }, autoTable] = await Promise.all([
        import(/* @vite-ignore */ "jspdf"),
        import(/* @vite-ignore */ "jspdf-autotable"),
      ]);
      const doc = new jsPDF({ orientation: "landscape" });
      doc.setFontSize(16);
      doc.setTextColor(26, 61, 143);
      doc.text(`L&A Multiventas — ${filename}`, 14, 18);
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text(new Date().toLocaleString("es-PY"), 14, 24);
      // @ts-expect-error – autoTable extends jsPDF prototype at runtime
      (autoTable.default ?? autoTable)(doc, {
        startY: 30,
        head: [cols],
        body: rows.map((r) => cols.map((c) => String(r[c] ?? ""))),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [26, 61, 143], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 245, 252] },
      });
      doc.save(`${filename}.pdf`);
      toast.success("PDF exportado");
    } catch (e) {
      console.error(e);
      toast.error("Instalá 'jspdf' y 'jspdf-autotable' para exportar PDF");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-mg-line bg-mg-ink/70 text-mg-text hover:border-mg-gold/50 hover:text-mg-gold-soft"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-mg-line bg-mg-ink text-mg-text">
        <DropdownMenuLabel className="text-mg-muted">Formato</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-mg-line" />
        <DropdownMenuItem onClick={exportPDF} className="gap-2 focus:bg-mg-ink-soft focus:text-mg-pink">
          <FileText className="h-4 w-4 text-rose-300" /> PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportExcel} className="gap-2 focus:bg-mg-ink-soft focus:text-mg-pink">
          <FileSpreadsheet className="h-4 w-4 text-emerald-300" /> Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportCSV} className="gap-2 focus:bg-mg-ink-soft focus:text-mg-pink">
          <Sheet className="h-4 w-4 text-sky-300" /> CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
