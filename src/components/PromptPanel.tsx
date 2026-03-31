import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const EXAMPLES = [
  "A job application form with name, email, resume upload, and experience level",
  "A customer feedback survey with rating, comments, and product category",
  "A event registration form with attendee details and dietary preferences",
  "A bug report form with severity, steps to reproduce, and screenshot",
];

export function PromptPanel({ onGenerate, isGenerating }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
    }
  };

  return (
    <div className="flex flex-col h-full p-6 gap-6">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold font-display text-gradient mb-2"
        >
          FormForge AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm"
        >
          Describe your form in plain English and watch it come to life.
        </motion.p>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the form you want to create..."
            className="min-h-[160px] bg-secondary/50 border-border/50 resize-none text-foreground placeholder:text-muted-foreground focus:ring-primary/30 focus:border-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
            }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            ⌘ + Enter
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold gap-2"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Form
            </>
          )}
        </Button>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
          Try an example
        </p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((example, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => setPrompt(example)}
              className="text-left text-sm text-muted-foreground hover:text-foreground p-3 rounded-lg bg-secondary/30 hover:bg-secondary/60 border border-border/30 hover:border-border/60 transition-all duration-200"
            >
              {example}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
