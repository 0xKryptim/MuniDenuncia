import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusChip } from '@/components/reports/StatusChip';
import type { Report } from '@/lib/types';

export function DashboardPage() {
  const { user } = useAuth();

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ['reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return api.getReports(user.id);
    },
    enabled: !!user?.id,
  });

  // Get the 3 most recent reports
  const recentReports = reports
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Panel Principal</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido de vuelta! Reporte problemas y haga seguimiento de sus solicitudes.
        </p>
      </div>

      {/* Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link to="/report" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Reportar un Problema</CardTitle>
              <CardDescription className="text-base">
                Envíe una nueva denuncia con fotos y detalles de ubicación
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link to="/requests" className="group">
          <Card className="h-full transition-all hover:shadow-lg hover:border-primary cursor-pointer">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200">
                  <FileText className="h-8 w-8" />
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">Ver Mis Solicitudes</CardTitle>
              <CardDescription className="text-base">
                Haga seguimiento del estado de todos sus reportes enviados
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Solicitudes Recientes</h2>
          <Button variant="ghost" asChild>
            <Link to="/requests">Ver Todas</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        ) : recentReports.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="p-4 rounded-full bg-muted mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aún no hay solicitudes</h3>
              <p className="text-muted-foreground text-center mb-6">
                Reporte su primer problema para comenzar
              </p>
              <Button asChild>
                <Link to="/report">Reportar un Problema</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <Link key={report.id} to={`/requests/${report.id}`}>
                <Card className="h-full transition-all hover:shadow-lg cursor-pointer overflow-hidden">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={report.photoUrl}
                      alt={report.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{report.title}</h3>
                    <div className="flex items-center justify-between">
                      <StatusChip status={report.status} />
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}