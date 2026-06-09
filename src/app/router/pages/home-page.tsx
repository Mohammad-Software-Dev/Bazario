import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Bazario frontend</CardTitle>
          <CardDescription>Home Page here</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2"></CardContent>
      </Card>
    </div>
  );
}
