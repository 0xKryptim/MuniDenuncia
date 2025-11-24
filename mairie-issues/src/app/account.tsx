import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Sesión cerrada exitosamente');
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Cargando información del usuario...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get user initials for avatar fallback
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cuenta</h1>
        <p className="text-muted-foreground">Administre la información de su cuenta</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>Su información personal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                {user.name && (
                  <div className="flex items-start gap-3">
                    <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Correo</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">ID de Usuario</p>
                    <p className="font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones de Cuenta</CardTitle>
            <CardDescription>Administre la configuración de su cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium mb-1">Cerrar Sesión</h3>
                <p className="text-sm text-muted-foreground">
                  Cierre sesión en este dispositivo
                </p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <h3 className="font-medium mb-1">Editar Perfil</h3>
                <p className="text-sm text-muted-foreground">
                  Actualice su nombre, correo y avatar
                </p>
              </div>
              <Button variant="outline" disabled>
                Próximamente
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <h3 className="font-medium mb-1">Cambiar Contraseña</h3>
                <p className="text-sm text-muted-foreground">
                  Actualice la contraseña de su cuenta
                </p>
              </div>
              <Button variant="outline" disabled>
                Próximamente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-muted bg-muted/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              ¿Necesita ayuda con su cuenta? Contacte soporte en{' '}
              <a href="mailto:support@mairie.local" className="text-primary hover:underline">
                support@mairie.local
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
