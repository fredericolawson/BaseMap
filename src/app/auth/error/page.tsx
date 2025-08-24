import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    error?: string;
    description?: string;
    message?: string;
  }> 
}) {
  const params = await searchParams;
  
  // Log error details to console for debugging
  if (typeof window !== 'undefined') {
    console.error('[Auth Error Page] Error details:', params);
  }

  return (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sorry, something went wrong.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {params?.error && (
                <div>
                  <p className="text-sm font-medium">Error Code:</p>
                  <p className="text-sm text-muted-foreground">{params.error}</p>
                </div>
              )}
              {params?.description && (
                <div>
                  <p className="text-sm font-medium">Description:</p>
                  <p className="text-sm text-muted-foreground">{params.description}</p>
                </div>
              )}
              {params?.message && (
                <div>
                  <p className="text-sm font-medium">Message:</p>
                  <p className="text-sm text-muted-foreground">{params.message}</p>
                </div>
              )}
              {!params?.error && !params?.description && !params?.message && (
                <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
              )}
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">
                  Check the browser console for detailed debugging information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
