import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle2, Trash2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRequestUploadUrl, useUpdatePropertyVideo } from "@/lib/api-client";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;

interface PropertyVideoUploadProps {
  propertyId: number;
  existingVideoUrl: string | null;
  onVideoChange: (url: string | null) => void;
}

export function PropertyVideoUpload({
  propertyId,
  existingVideoUrl,
  onVideoChange,
}: PropertyVideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const requestUrl = useRequestUploadUrl();
  const updateVideo = useUpdatePropertyVideo();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({ title: "Invalid file", description: "Please select a video file (.mp4, .mov, etc.)", variant: "destructive" });
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast({ title: "File too large", description: "Maximum video size is 100MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const { uploadURL, objectPath } = await requestUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type },
      });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.open("PUT", uploadURL);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      await updateVideo.mutateAsync({ id: propertyId, data: { videoUrl: objectPath } });
      onVideoChange(objectPath);
      toast({ title: "Video uploaded!", description: "The property video tour is now live." });
    } catch (err) {
      toast({ title: "Upload failed", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemove = async () => {
    await updateVideo.mutateAsync({ id: propertyId, data: { videoUrl: null } });
    onVideoChange(null);
    toast({ title: "Video removed" });
  };

  if (uploading) {
    return (
      <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 flex flex-col items-center gap-3 bg-primary/5">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="font-medium text-foreground">Uploading… {uploadProgress}%</p>
        <div className="w-full max-w-xs bg-muted rounded-full h-2">
          <div
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    );
  }

  if (existingVideoUrl) {
    return (
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">Video tour uploaded</p>
          <p className="text-xs text-muted-foreground truncate">{existingVideoUrl}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive shrink-0"
          onClick={handleRemove}
          disabled={updateVideo.isPending}
        >
          <Trash2 className="w-4 h-4 mr-1" /> Remove
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          Replace
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-muted-foreground/25 rounded-2xl p-10 flex flex-col items-center gap-4 cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all"
      onClick={() => inputRef.current?.click()}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Video className="w-7 h-7 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-foreground mb-1">Upload a video tour</p>
        <p className="text-sm text-muted-foreground">MP4, MOV, WebM — max 100MB</p>
      </div>
      <Button variant="outline" size="sm" className="rounded-full gap-2">
        <Upload className="w-4 h-4" /> Choose Video
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
