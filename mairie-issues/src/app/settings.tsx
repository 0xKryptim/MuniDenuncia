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
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
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
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Current theme: {theme === 'dark' ? 'Dark' : 'Light'}
                  </p>
                </div>
              </div>
              <Button onClick={toggleTheme} variant="outline">
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language (Stub) */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Choose your preferred language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base font-medium">Display Language</Label>
                  <p className="text-sm text-muted-foreground">Current language: English</p>
                </div>
              </div>
              <Button variant="outline" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications (Stub) */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your reports via email
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <Label className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get real-time updates on your device
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Technical details about the app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <Label className="text-base font-medium">Data Adapter</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={adapterType === 'supabase' ? 'default' : 'secondary'}>
                    {adapterType === 'supabase' ? 'Supabase' : 'Mock'}
                  </Badge>
                  {adapterType === 'supabase' && isRealtimeEnabled && (
                    <Badge variant="outline" className="text-xs">
                      Realtime Enabled
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {adapterType === 'supabase'
                    ? 'Using Supabase for data persistence and authentication'
                    : 'Using mock data for development and testing'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-base font-medium">App Version</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Version {appVersion}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-base font-medium">Build Environment</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {import.meta.env.MODE === 'production' ? 'Production' : 'Development'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-muted bg-muted/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Mairie Issues</h3>
              <p className="text-sm text-muted-foreground">
                A citizen reporting platform for municipal issues
              </p>
              <p className="text-xs text-muted-foreground">
                Built with React, TypeScript, and TailwindCSS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
