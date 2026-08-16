import { Card, CardContent } from "@/components/ui/card";

interface AdsSectionProps {
  title: string;
  /**
   * Wird nur benoetigt, wenn der Abschnitt ohne Inhalt gerendert wird.
   * Die Startseite blendet leere Bereiche stattdessen ganz aus.
   */
  emptyMessage?: string;
  children?: React.ReactNode;
}

export function AdsSection({ title, emptyMessage, children }: AdsSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold text-foreground">
        {title}
      </h2>

      {children ? (
        children
      ) : (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      )}
    </section>
  );
}
