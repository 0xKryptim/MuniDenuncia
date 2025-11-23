import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusChip } from '@/components/reports/StatusChip';
import type { Report, ReportStatus } from '@/lib/types';

type FilterStatus = 'all' | ReportStatus;

// Ejemplos de denuncias para demostración
const EXAMPLE_REPORTS: Report[] = [
  {
    id: 'ejemplo-1',
    userId: 'demo',
    title: 'Luminaria rota en Av. Pedro Montt',
    description: 'La luminaria ubicada frente al número 1234 no funciona desde hace una semana, causando peligro para los peatones por las noches.',
    photoUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop',
    location: {
      lat: -33.0472,
      lng: -71.6127,
      address: 'Av. Pedro Montt 1234, Valparaíso, Región de Valparaíso, Chile'
    },
    status: 'in_progress',
    urgency: 'high',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    messages: []
  },
  {
    id: 'ejemplo-2',
    userId: 'demo',
    title: 'Bache profundo en Calle Cumming',
    description: 'Hay un bache de aproximadamente 50cm de diámetro que puede dañar los vehículos. Se encuentra a la altura del supermercado.',
    photoUrl: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800&auto=format&fit=crop',
    location: {
      lat: -33.0450,
      lng: -71.6200,
      address: 'Calle Cumming 567, Valparaíso, Región de Valparaíso, Chile'
    },
    status: 'in_review',
    urgency: 'medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    messages: []
  },
  {
    id: 'ejemplo-3',
    userId: 'demo',
    title: 'Acumulación de basura en Plaza Victoria',
    description: 'Los contenedores están desbordados y hay basura acumulada alrededor desde el fin de semana.',
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&auto=format&fit=crop',
    location: {
      lat: -33.0378,
      lng: -71.6270,
      address: 'Plaza Victoria, Valparaíso, Región de Valparaíso, Chile'
    },
    status: 'resolved',
    urgency: 'medium',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    messages: []
  },
  {
    id: 'ejemplo-4',
    userId: 'demo',
    title: 'Semáforo intermitente en Av. Argentina',
    description: 'El semáforo del cruce con Calle Chacabuco está intermitente desde esta mañana, generando confusión en los conductores.',
    photoUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop',
    location: {
      lat: -33.0420,
      lng: -71.6180,
      address: 'Av. Argentina con Calle Chacabuco, Valparaíso, Región de Valparaíso, Chile'
    },
    status: 'in_progress',
    urgency: 'high',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    messages: []
  }
];

export function RequestsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: userReports = [], isLoading } = useQuery<Report[]>({
    queryKey: ['reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return api.getReports(user.id);
    },
    enabled: !!user?.id,
  });

  // Combinar reportes del usuario con ejemplos
  const allReports = [...userReports, ...EXAMPLE_REPORTS];

  // Apply filters
  const filteredReports = allReports
    .filter((report) => {
      if (statusFilter !== 'all' && report.status !== statusFilter) {
        return false;
      }
      if (searchQuery && !report.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const statusButtons: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'submitted', label: 'Enviadas' },
    { value: 'in_review', label: 'En Revisión' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'resolved', label: 'Resueltas' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Solicitudes</h1>
        <p className="text-muted-foreground">
          Vea y haga seguimiento de todas sus denuncias enviadas
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statusButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={statusFilter === btn.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                <div className="h-6 bg-muted rounded w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReports.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted mb-4">
              <FileText className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No se encontraron solicitudes'
                : 'Aún no hay solicitudes'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              {searchQuery || statusFilter !== 'all'
                ? 'Intente ajustar sus filtros o búsqueda'
                : 'Comience reportando su primer problema'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button asChild>
                <Link to="/report">Reportar un Problema</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Mostrando {filteredReports.length} {filteredReports.length === 1 ? 'solicitud' : 'solicitudes'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card
                key={report.id}
                className="h-full transition-all hover:shadow-lg cursor-pointer overflow-hidden group"
              >
                <Link to={`/requests/${report.id}`}>
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {report.id.startsWith('ejemplo-') && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Ejemplo
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {report.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <StatusChip status={report.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}