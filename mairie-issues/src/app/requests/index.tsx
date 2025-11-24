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

export function RequestsPage() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ['reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return api.getReports(user.id);
    },
    enabled: !!user?.id,
  });

  // Apply filters
  const filteredReports = reports
    .filter((report) => {
      // Status filter
      if (statusFilter !== 'all' && report.status !== statusFilter) {
        return false;
      }
      // Search filter
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
          Vea y rastree todos sus reportes enviados
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
                : 'Sin solicitudes aún'}
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
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {report.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <StatusChip status={report.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
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
