import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { reportSchema, type ReportFormData } from '@/lib/validation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LocationPicker } from '@/components/map/LocationPicker';
import { PhotoDropzone } from '@/components/upload/PhotoDropzone';
import type { Location, ReportUrgency } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const location = watch('location');
  const photoFile = watch('photoFile');

  const createReportMutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      setIsUploading(true);
      try {
        const report = await api.createReport(
          {
            title: data.title,
            description: data.description,
            photoFile: data.photoFile,
            location: data.location,
            urgency: data.urgency,
          },
          user.id
        );

        await api.sendMessage(
          {
            reportId: report.id,
            text: `Su denuncia "${data.title}" ha sido enviada exitosamente. La revisaremos pronto.`,
          },
          user.id
        );

        return report;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (report) => {
      toast.success('¡Denuncia enviada exitosamente!');
      navigate(`/requests/${report.id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Error al enviar la denuncia');
    },
  });

  const onSubmit = (data: ReportFormData) => {
    createReportMutation.mutate(data);
  };

  const handleLocationChange = (newLocation: Location) => {
    setValue('location', newLocation, { shouldValidate: true });
  };

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      setValue('photoFile', file, { shouldValidate: true });
    }
  };

  const isSubmitting = createReportMutation.isPending || isUploading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reportar un Problema</h1>
        <p className="text-muted-foreground">
          Envíe una denuncia con fotos y detalles de ubicación para que la municipalidad la revise.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Location */}
        <Card>
          <CardHeader>
            <CardTitle>1. Ubicación</CardTitle>
            <CardDescription>
              Marque la ubicación exacta del problema en el mapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationPicker
              value={location}
              onChange={handleLocationChange}
            />
            {errors.location && (
              <p className="text-sm text-destructive mt-2">{errors.location.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Photo */}
        <Card>
          <CardHeader>
            <CardTitle>2. Fotografía</CardTitle>
            <CardDescription>
              Suba una foto clara del problema (máx. 10MB, JPEG/PNG/WebP)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoDropzone
              value={photoFile}
              onFileSelect={handlePhotoChange}
              disabled={isSubmitting}
            />
            {errors.photoFile && (
              <p className="text-sm text-destructive mt-2">{errors.photoFile.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Details */}
        <Card>
          <CardHeader>
            <CardTitle>3. Detalles</CardTitle>
            <CardDescription>
              Describa el problema claramente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="ej. Luminaria rota en Calle Principal"
                {...register('title')}
                disabled={isSubmitting}
                className="mt-1.5"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Agregue cualquier detalle adicional que pueda ayudar..."
                rows={4}
                {...register('description')}
                disabled={isSubmitting}
                className="mt-1.5"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="urgency">
                Nivel de Urgencia <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue=""
                onValueChange={(value) => setValue('urgency', value as ReportUrgency)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="urgency" className="mt-1.5">
                  <SelectValue placeholder="Seleccione el nivel de urgencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja - No es urgente</SelectItem>
                  <SelectItem value="medium">Media - Necesita atención</SelectItem>
                  <SelectItem value="high">Alta - Problema de seguridad urgente</SelectItem>
                </SelectContent>
              </Select>
              {errors.urgency && (
                <p className="text-sm text-destructive mt-1">{errors.urgency.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar Denuncia'}
          </Button>
        </div>
      </form>
    </div>
  );
}
