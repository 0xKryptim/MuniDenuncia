import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, Clock, Share2, Twitter, Facebook, MessageCircle, Link2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/reports/StatusChip';
import { Badge } from '@/components/ui/badge';
import type { Report, Message } from '@/lib/types';

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);

  const { data: report, isLoading } = useQuery<Report>({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id) throw new Error('Report ID is required');
      return api.getReport(id);
    },
    enabled: !!id,
  });

  // Social sharing functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareOnTwitter = () => {
    if (!report) return;
    const text = `He reportado un problema en mi comunidad: ${report.title} #MuniDenuncia`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=450');
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=450');
  };

  const shareOnWhatsApp = () => {
    if (!report) return;
    const text = `Mira mi reporte en MuniDenuncia: ${report.title} - ${shareUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="h-10 bg-muted rounded w-3/4" />
          <div className="h-96 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-xl font-semibold mb-2">Reporte no encontrado</h2>
            <p className="text-muted-foreground mb-4">
              El reporte que busca no existe o ha sido eliminado.
            </p>
            <Button onClick={() => navigate('/requests')}>Volver a Solicitudes</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status history from messages or create from report
  const statusHistory = [
    { status: 'submitted', date: report.createdAt, label: 'Enviado' },
    ...(report.status !== 'submitted'
      ? [{ status: report.status, date: report.updatedAt, label: getStatusLabel(report.status) }]
      : []),
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/requests">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Solicitudes
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3">{report.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Creado: {formatDate(report.createdAt)}</span>
              </div>
              {report.updatedAt !== report.createdAt && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Actualizado: {formatDate(report.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
          <StatusChip status={report.status} className="text-base px-4 py-2" />
        </div>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statusHistory.map((item, index) => (
                <div key={index} className="flex items-center">
                  <Badge
                    variant={index === statusHistory.length - 1 ? 'default' : 'secondary'}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </Badge>
                  {index < statusHistory.length - 1 && (
                    <div className="h-px w-8 bg-border mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Foto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={report.photoUrl}
                  alt={report.title}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {report.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Messages/Chat Thread */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              {report.messages && report.messages.length > 0 ? (
                <div className="space-y-4">
                  {report.messages.map((message: Message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.system
                            ? 'bg-muted text-muted-foreground italic'
                            : message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.createdAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Sin actividad aún</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ubicación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Static map placeholder */}
                <div className="relative h-48 rounded-lg overflow-hidden bg-muted border">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  {/* In a real app, you would use a static map API or leaflet */}
                  <div
                    className="w-full h-full bg-cover bg-center opacity-50"
                    style={{
                      backgroundImage: `url(https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${report.location.lng},${report.location.lat})/${report.location.lng},${report.location.lat},14,0/400x300@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw)`,
                    }}
                  />
                </div>
                {report.location.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{report.location.address}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartir en Redes Sociales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Comparte tu reporte para aumentar la visibilidad y el apoyo de la comunidad
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnFacebook}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="flex items-center gap-2"
                >
                  {copiedLink ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  {copiedLink ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información del Reporte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">ID del Reporte:</span>
                <p className="font-mono text-xs mt-1">{report.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>
                <div className="mt-1">
                  <StatusChip status={report.status} />
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Creado:</span>
                <p className="mt-1">{formatDate(report.createdAt)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Última Actualización:</span>
                <p className="mt-1">{formatDate(report.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    submitted: 'Enviado',
    in_review: 'En Revisión',
    in_progress: 'En Progreso',
    resolved: 'Resuelto',
    rejected: 'Rechazado',
  };
  return labels[status] || status;
}
