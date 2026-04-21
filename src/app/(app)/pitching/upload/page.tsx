"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { format } from "date-fns";
import { RAPSODO_COLUMN_MAP, normalizePitchType, METADATA_ROWS_TO_SKIP } from "@/lib/rapsodo-mapping";
import { createPitchSession } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

type MappedPitch = Record<string, unknown>;

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsedPitches, setParsedPitches] = useState<MappedPitch[]>([]);
  const [rawHeaders, setRawHeaders] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [sessionType, setSessionType] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");

    Papa.parse(f, {
      skipEmptyLines: true,
      complete(results) {
        const rows = results.data as string[][];
        if (rows.length <= METADATA_ROWS_TO_SKIP) {
          setError("CSV appears empty or too short (expected 4 metadata rows + header + data).");
          return;
        }

        const headerRow = rows[METADATA_ROWS_TO_SKIP];
        setRawHeaders(headerRow);

        const dataRows = rows.slice(METADATA_ROWS_TO_SKIP + 1);
        const mapped: MappedPitch[] = dataRows
          .filter((row) => row.some((cell) => cell.trim() !== ""))
          .map((row, rowIdx) => {
            const pitch: MappedPitch = {};
            headerRow.forEach((header, colIdx) => {
              const trimmed = header.trim();
              const mapped_key = RAPSODO_COLUMN_MAP[trimmed];
              if (mapped_key && row[colIdx] !== undefined && row[colIdx].trim() !== "") {
                if (mapped_key === "pitch_type") {
                  pitch[mapped_key] = normalizePitchType(row[colIdx]);
                } else if (mapped_key === "strike_zone") {
                  pitch[mapped_key] = row[colIdx].trim();
                } else if (mapped_key === "pitch_number") {
                  pitch[mapped_key] = parseInt(row[colIdx], 10) || rowIdx + 1;
                } else {
                  const num = parseFloat(row[colIdx]);
                  if (!isNaN(num)) pitch[mapped_key] = num;
                }
              }
            });
            if (!pitch.pitch_number) pitch.pitch_number = rowIdx + 1;
            return pitch;
          });

        setParsedPitches(mapped);
      },
      error(err) {
        setError(`Parse error: ${err.message}`);
      },
    });
  }, []);

  const handleUpload = async () => {
    if (parsedPitches.length === 0) return;
    setUploading(true);
    setError("");

    const result = await createPitchSession(
      { date, session_type: sessionType, location, notes },
      parsedPitches
    );

    setUploading(false);
    if (result.error) {
      setError(result.error);
    } else if (result.sessionId) {
      router.push(`/pitching/session/${result.sessionId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload Rapsodo CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <div className="flex items-center gap-3">
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
              <Upload className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground">
              Rapsodo CSV format: 4 metadata rows, then header row, then pitch data
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="up-date">Date</Label>
              <Input id="up-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="up-type">Session Type</Label>
              <Input id="up-type" placeholder="Bullpen, Game, etc." value={sessionType} onChange={(e) => setSessionType(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="up-loc">Location</Label>
            <Input id="up-loc" placeholder="Field / Facility" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="up-notes">Notes</Label>
            <Textarea id="up-notes" placeholder="Session notes..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {parsedPitches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview ({parsedPitches.length} pitches)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-1">#</th>
                    <th className="text-left p-1">Type</th>
                    <th className="text-right p-1">Velo</th>
                    <th className="text-right p-1">Spin</th>
                    <th className="text-right p-1">HB</th>
                    <th className="text-right p-1">VB</th>
                    <th className="text-right p-1">Eff%</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedPitches.slice(0, 10).map((p, i) => (
                    <tr key={i} className="border-b border-muted">
                      <td className="p-1">{String(p.pitch_number ?? i + 1)}</td>
                      <td className="p-1">{String(p.pitch_type ?? "—")}</td>
                      <td className="p-1 text-right">{p.velocity != null ? Number(p.velocity).toFixed(1) : "—"}</td>
                      <td className="p-1 text-right">{p.spin_rate != null ? Math.round(Number(p.spin_rate)) : "—"}</td>
                      <td className="p-1 text-right">{p.horizontal_break != null ? Number(p.horizontal_break).toFixed(1) : "—"}</td>
                      <td className="p-1 text-right">{p.vertical_break != null ? Number(p.vertical_break).toFixed(1) : "—"}</td>
                      <td className="p-1 text-right">{p.spin_efficiency != null ? Number(p.spin_efficiency).toFixed(0) : "—"}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedPitches.length > 10 && (
                <p className="text-xs text-muted-foreground mt-2">...and {parsedPitches.length - 10} more</p>
              )}
            </div>
            <Button className="w-full mt-4" onClick={handleUpload} disabled={uploading}>
              {uploading ? "Importing..." : `Import ${parsedPitches.length} Pitches`}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
