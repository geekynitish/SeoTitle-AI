import { useState } from "react";
import { TitleForm } from "@/components/TitleForm";
import { ResultCard } from "@/components/ResultCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import sonbarsaLogo from "@/assets/sonbarsa-logo.svg";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ original: string; rephrased: string } | null>(null);

  const handleSubmit = async (title: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("rephrase-title", {
        body: { title },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResult({
        original: title,
        rephrased: data.rephrasedTitle,
      });
    } catch (error) {
      console.error("Error rephrasing title:", error);
      toast.error("Failed to rephrase title. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={sonbarsaLogo} alt="SonBarsa Logo" className="h-10 w-auto" />
            <div>
              <h1 className="font-semibold text-foreground">
                Hindi SEO Title Generator by <span className="text-primary font-bold">SonBarsa</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Powered by <span className="text-primary font-medium">SonBarsa</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span className="text-primary font-bold">SonBarsa</span> AI-Powered SEO Optimization
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              हिंदी न्यूज़ टाइटल को{" "}
              <span className="text-gradient">SEO-फ्रेंडली</span> बनाएं
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              अपना हिंदी न्यूज़ टाइटल डालें और AI की मदद से Google-optimized 
              SEO टाइटल पाएं। Ideal character count: 50-60.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-soft border border-border">
            <TitleForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Result */}
          {result && (
            <ResultCard title={result.rephrased} original={result.original} />
          )}

          {/* Tips Section */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Optimizes for Google Discover and Search ",
                description: "generates SEO-friendly, keyword-rich titles",
              },
              {
                title: "Editorial integrity",
                description: "fully maintaining the ethos of responsible journalism maintains consistent headline quality",
              },
              {
                title: "Compelling & Clear",
                description: "Saves desk time and Improves CTR, impressions, and overall engagement",
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-secondary/50 border border-border space-y-1"
              >
                <h3 className="font-medium text-foreground text-sm">{tip.title}</h3>
                <p className="text-xs text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
