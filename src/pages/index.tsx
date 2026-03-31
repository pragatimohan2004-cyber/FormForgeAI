import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PromptPanel } from "@/components/PromptPanel";
import { FormPreview } from "@/components/FormPreview";
import { parsePromptToForm } from "@/lib/formGenerator";
import type { GeneratedForm } from "@/types/form";

const Index = () => {
  const [form, setForm] = useState<GeneratedForm | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1200));
    const generated = parsePromptToForm(prompt);
    setForm(generated);
    setIsGenerating(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Prompt */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-[420px] md:min-w-[420px] border-r border-border/40 bg-card/30 overflow-y-auto"
      >
        <PromptPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
      </motion.aside>

      {/* Right Panel - Preview */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex-1 flex flex-col min-h-screen md:min-h-0 bg-background"
      >
        <div className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground/80 text-sm uppercase tracking-wider">
            Form Preview
          </h2>
          {form && (
            <span className="text-xs text-muted-foreground">
              {form.fields.length} field{form.fields.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <FormPreview form={form} isGenerating={isGenerating} />
      </motion.main>
    </div>
  );
};

export default Index;
