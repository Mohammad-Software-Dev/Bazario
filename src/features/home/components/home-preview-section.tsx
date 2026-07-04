import { Card, CardContent } from "@/components/ui/card";

interface HomePreviewSectionProps {
  title: string;
  description?: string;
  emptyMessage: string;
  children: React.ReactNode;
}

export function HomePreviewSection({
  title,
  description,
  emptyMessage,
  children,
}: HomePreviewSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

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
