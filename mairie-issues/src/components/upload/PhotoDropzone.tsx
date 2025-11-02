import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PhotoDropzoneProps {
  onFileSelect: (file: File) => void;
  value?: File;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function PhotoDropzone({ onFileSelect, value, disabled = false }: PhotoDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFile = (file: File) => {
    const error = validateFile(file);
    if (error) {
      alert(error);
      return;
    }

    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Note: We can't really "clear" the value prop since it's controlled by parent
    // The parent should handle this through their state management
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const hasFile = value || preview;

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-input hover:border-primary/50 hover:bg-accent/50',
          hasFile && 'border-solid',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="w-full space-y-4">
            <div className="relative mx-auto max-w-md overflow-hidden rounded-lg">
              <img
                src={preview}
                alt="Preview"
                className="h-auto w-full object-contain"
                style={{ maxHeight: '300px' }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute right-2 top-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {value && (
              <div className="space-y-1 text-center text-sm">
                <p className="font-medium text-foreground">{value.name}</p>
                <p className="text-muted-foreground">{formatFileSize(value.size)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, or WebP (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Maximum file size: 10MB. Supported formats: JPEG, PNG, WebP
      </p>
    </div>
  );
}
