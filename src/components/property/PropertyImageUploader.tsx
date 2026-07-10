import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedImage {
  objectPath: string;
  previewUrl: string;
  name: string;
}

interface PropertyImageUploaderProps {
  label: string;
  hint?: string;
  maxFiles?: number;
  onImagesChange: (objectPaths: string[]) => void;
  className?: string;
}

interface FileEntry {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  objectPath?: string;
  error?: string;
  progress: number;
}

export function PropertyImageUploader({
  label,
  hint,
  maxFiles = 8,
  onImagesChange,
  className,
}: PropertyImageUploaderProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const notifyParent = useCallback((updatedEntries: FileEntry[]) => {
    const paths = updatedEntries
      .filter(e => e.status === "done" && e.objectPath)
      .map(e => `/api/storage${e.objectPath}`);
    onImagesChange(paths);
  }, [onImagesChange]);

  const uploadOne = useCallback(async (entry: FileEntry) => {
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "uploading", progress: 10 } : e));

    try {
      const metaRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: entry.file.name,
          size: entry.file.size,
          contentType: entry.file.type || "image/jpeg",
        }),
      });

      if (!metaRes.ok) throw new Error("Could not get upload URL");
      const { uploadURL, objectPath } = await metaRes.json() as { uploadURL: string; objectPath: string };

      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, progress: 40 } : e));

      const putRes = await fetch(uploadURL, {
        method: "PUT",
        body: entry.file,
        headers: { "Content-Type": entry.file.type || "image/jpeg" },
      });

      if (!putRes.ok) throw new Error("Upload to storage failed");

      setEntries(prev => {
        const updated = prev.map(e =>
          e.id === entry.id ? { ...e, status: "done" as const, objectPath, progress: 100 } : e
        );
        notifyParent(updated);
        return updated;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "error" as const, error: msg, progress: 0 } : e));
    }
  }, [notifyParent]);

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    const remaining = maxFiles - entries.length;
    const toAdd = imageFiles.slice(0, remaining);

    const newEntries: FileEntry[] = toAdd.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending" as const,
      progress: 0,
    }));

    setEntries(prev => [...prev, ...newEntries]);

    // upload each immediately
    newEntries.forEach(e => uploadOne(e));
  }, [entries.length, maxFiles, uploadOne]);

  const removeEntry = (id: string) => {
    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      notifyParent(updated);
      return updated;
    });
  };

  const retryEntry = (entry: FileEntry) => {
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: "pending", error: undefined, progress: 0 } : e));
    uploadOne({ ...entry, status: "pending" });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const canAddMore = entries.length < maxFiles;

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>

      {/* Thumbnails grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {entries.map(entry => (
            <div key={entry.id} className="relative group aspect-square rounded-xl overflow-hidden border bg-muted">
              <img
                src={entry.previewUrl}
                alt={entry.file.name}
                className="w-full h-full object-cover"
              />

              {/* Uploading overlay */}
              {entry.status === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <div className="w-3/4 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Done checkmark */}
              {entry.status === "done" && (
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}

              {/* Error overlay */}
              {entry.status === "error" && (
                <div className="absolute inset-0 bg-destructive/60 flex flex-col items-center justify-center gap-1 p-1">
                  <AlertCircle className="w-4 h-4 text-white" />
                  <button
                    type="button"
                    onClick={() => retryEntry(entry)}
                    className="text-[10px] text-white underline leading-tight"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Remove button */}
              {entry.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/40"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload or drag & drop</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              JPG, PNG, WEBP · Up to {maxFiles} photos · {maxFiles - entries.length} remaining
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files ?? []);
          addFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
