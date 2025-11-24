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
        <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
        <p className="text-muted-foreground">
          ¡Bienvenido de nuevo! Reporte problemas y rastree sus solicitudes.
        </p>
      </div>

      {/* Primary Action - Centered and Large */}
      <div className="flex justify-center mb-12">
        <Link to="/report" className="group w-full max-w-lg">
          <Card className="transition-all hover:shadow-xl hover:scale-105 hover:border-primary cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-primary/20 text-primary mb-4">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <CardTitle className="text-2xl mb-3">Reportar un Problema</CardTitle>
                <CardDescription className="text-base">
                  Envíe un nuevo problema con fotos y detalles de ubicación
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-center gap-2 text-primary">
                <span className="font-medium">Comenzar</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
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
              <h3 className="text-lg font-semibold mb-2">Sin solicitudes aún</h3>
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
                        {new Date(report.createdAt).toLocaleDateString()}
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
