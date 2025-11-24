import { Moon, Sun, Globe, Bell, Database, Info } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();

  // Get adapter type from environment
  const adapterType = (import.meta.env.VITE_DATA_ADAPTER || 'mock') as 'mock' | 'supabase';
  const isRealtimeEnabled = import.meta.env.VITE_REALTIME === 'true';

  // App version from package.json
  const appVersion = '0.0.0';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración</h1>
        <p className="text-muted-foreground">Administre las preferencias de la aplicación</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>Personalice el aspecto de la aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-muted-foreground mt-0.5" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <div>
                  <Label className="text-base font-medium">Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Tema actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}
                  </p>
                </div>
              </div>
              <Button onClick={toggleTheme} variant="outline">
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Modo Claro
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Modo Oscuro
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language (Stub) */}
        <Card>
          <CardHeader>
            <CardTitle>Idioma</CardTitle>
            <CardDescription>Elija su idioma preferido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base font-medium">Idioma de Visualización</Label>
                  <p className="text-sm text-muted-foreground">Idioma actual: Español</p>
                </div>
              </div>
              <Button variant="outline" disabled>
                Próximamente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications (Stub) */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Administre cómo recibe actualizaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base font-medium">Notificaciones por Correo</Label>
                  <p className="text-sm text-muted-foreground">
                    Reciba actualizaciones sobre sus reportes por correo
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Próximamente
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base font-medium">Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Reciba actualizaciones en tiempo real en su dispositivo
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Próximamente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Detalles técnicos de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-base font-medium">Adaptador de Datos</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={adapterType === 'supabase' ? 'default' : 'secondary'}>
                    {adapterType === 'supabase' ? 'Supabase' : 'Mock'}
                  </Badge>
                  {adapterType === 'supabase' && isRealtimeEnabled && (
                    <Badge variant="outline" className="text-xs">
                      Tiempo Real Habilitado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {adapterType === 'supabase'
                    ? 'Usando Supabase para persistencia de datos y autenticación'
                    : 'Usando datos de prueba para desarrollo y testing'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-base font-medium">Versión de la App</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Versión {appVersion}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-base font-medium">Entorno de Compilación</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {import.meta.env.MODE === 'production' ? 'Producción' : 'Desarrollo'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-muted bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Portal Ciudadano</h3>
              <p className="text-sm text-muted-foreground">
                Una plataforma de reportes ciudadanos para problemas municipales
              </p>
              <p className="text-xs text-muted-foreground">
                Construido con React, TypeScript y TailwindCSS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
