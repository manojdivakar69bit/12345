import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Printer, QrCode } from "lucide-react";

const PRINT_OPTIONS = ["10", "20", "50", "100", "500", "1000"] as const;

const SIZE_PRESETS = [
  { label: "3×4 cm", w: 3, h: 4 },
  { label: "4×6 cm", w: 4, h: 6 },
  { label: "6×8 cm", w: 6, h: 8 },
  { label: "8×10 cm", w: 8, h: 10 },
  { label: "Custom", w: 0, h: 0 },
];

interface BulkStickerPrintCardProps {
  baseUrl: string;
  printableCount: number;
}

const openStickerPrintWindow = (codes: string[], baseUrl: string, wCm: number, hCm: number) => {
  const qrSize = Math.min(wCm, hCm) * 0.6;

  const stickersMarkup = codes
    .map((code) => {
      const qrMarkup = renderToStaticMarkup(
        <QRCodeSVG value={`${baseUrl}/emergency/${code}`} size={qrSize * 28} level="M" />
      );
      return `
        <div class="sticker">
          <div class="header">Call My Family 👍</div>
          <div class="scan-text">SCAN IN EMERGENCY</div>
          <div class="qr">${qrMarkup}</div>
          <div class="code">${code}</div>
          <div class="footer">Protected by CallMyFamily</div>
        </div>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html><head><title>Print QR Stickers</title>
<style>
  @page { margin: 0.5cm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; padding: 1rem; }
  .info { text-align: center; margin-bottom: 1rem; font-size: 14px; color: #666; }
  .print-btn { display: block; margin: 0 auto 1rem; padding: 10px 30px; background: #dc2626; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
  .grid { display: flex; flex-wrap: wrap; gap: 0.5cm; justify-content: center; }
  .sticker { width: ${wCm}cm; height: ${hCm}cm; border: 1px solid #ddd; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 0.3cm; page-break-inside: avoid; }
  .header { background: #dc2626; color: white; width: 100%; text-align: center; padding: 0.15cm; font-weight: bold; font-size: ${Math.max(6, wCm * 1.5)}pt; border-radius: 3px; }
  .scan-text { font-size: ${Math.max(5, wCm * 1)}pt; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  .qr { flex: 1; display: flex; align-items: center; justify-content: center; }
  .code { font-family: monospace; font-size: ${Math.max(7, wCm * 1.5)}pt; font-weight: bold; }
  .footer { background: #dc2626; color: white; width: 100%; text-align: center; padding: 0.1cm; font-size: ${Math.max(4, wCm * 0.8)}pt; border-radius: 3px; }
  @media print { .no-print { display: none !important; } body { padding: 0; } }
</style></head><body>
<div class="no-print">
  <p class="info">${codes.length} sticker${codes.length === 1 ? "" : "s"} ready (${wCm}×${hCm} cm)</p>
  <button class="print-btn" onclick="window.print()">🖨️ Print Stickers</button>
</div>
<div class="grid">${stickersMarkup}</div>
<script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);
  const printWindow = window.open(blobUrl, "_blank");
  if (!printWindow) {
    const fw = window.open("", "_blank");
    if (fw) {
      fw.document.write(html);
      fw.document.close();
    } else {
      throw new Error("Please allow popups to print stickers");
    }
  }
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
};

const BulkStickerPrintCard = ({ baseUrl, printableCount }: BulkStickerPrintCardProps) => {
  const [selectedCount, setSelectedCount] = useState("10");
  const [sizePreset, setSizePreset] = useState("6×8 cm");
  const [customW, setCustomW] = useState("6");
  const [customH, setCustomH] = useState("8");

  const isCustom = sizePreset === "Custom";
  const currentSize = isCustom
    ? { w: parseFloat(customW) || 6, h: parseFloat(customH) || 8 }
    : SIZE_PRESETS.find((s) => s.label === sizePreset) || { w: 6, h: 8 };

  const printMutation = useMutation({
    mutationFn: async (count: string) => {
      const limit = Number(count);
      // Fetch printable QR codes from Supabase
      const { data: printable, error } = await supabase
        .from("qr_codes")
        .select("code")
        .in("status", ["available", "assigned"])
        .order("code")
        .limit(limit);
      if (error) throw error;
      if (!printable || printable.length === 0) throw new Error("No QR codes available for printing");
      const codes = printable.map((item: any) => item.code);
      return { requested: limit, codes };
    },
    onSuccess: async ({ requested, codes }) => {
      openStickerPrintWindow(codes, baseUrl, currentSize.w, currentSize.h);

      // Store print history in Supabase
      const email = localStorage.getItem("cmf_email") || "unknown";
      await supabase.from("print_history").insert({
        printed_by: email,
        count: codes.length,
        code_from: codes[0],
        code_to: codes[codes.length - 1],
      });

      if (codes.length < requested) {
        toast.success(`Only ${codes.length} unlinked stickers were available.`);
        return;
      }
      toast.success(`${codes.length} stickers are ready to print.`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="card-shadow">
      <CardHeader><CardTitle className="flex items-center gap-2"><Printer size={18} /> Print All Stickers</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Print from existing unlinked QR codes in a sticker sheet layout.</p>

        <div>
          <Label>Number of stickers</Label>
          <Select value={selectedCount} onValueChange={setSelectedCount}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRINT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>{option} stickers</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sticker size</Label>
          <Select value={sizePreset} onValueChange={setSizePreset}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIZE_PRESETS.map((s) => (
                <SelectItem key={s.label} value={s.label}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isCustom && (
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Width (cm)</Label><Input type="number" value={customW} onChange={(e) => setCustomW(e.target.value)} min="1" step="0.5" /></div>
            <div><Label>Height (cm)</Label><Input type="number" value={customH} onChange={(e) => setCustomH(e.target.value)} min="1" step="0.5" /></div>
          </div>
        )}

        <Button className="w-full emergency-gradient hover:opacity-90 text-primary-foreground" onClick={() => printMutation.mutate(selectedCount)} disabled={printMutation.isPending || printableCount === 0}>
          <Printer size={14} className="mr-1" />
          {printMutation.isPending ? "Preparing..." : "Print Stickers"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">Unlinked QR codes ready: {printableCount}</p>
      </CardContent>
    </Card>
  );
};

export default BulkStickerPrintCard;
