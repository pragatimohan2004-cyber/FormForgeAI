import { motion, AnimatePresence } from "framer-motion";
import { Copy, Download, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { GeneratedForm, FormField } from "@/types/form";
import { toast } from "sonner";

interface FormPreviewProps {
  form: GeneratedForm | null;
  isGenerating: boolean;
}

function FieldRenderer({ field, index }: { field: FormField; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="space-y-2"
    >
      <Label className="text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="text-primary ml-1">*</span>}
      </Label>

      {(field.type === "text" || field.type === "email" || field.type === "number" || field.type === "phone" || field.type === "url" || field.type === "date") && (
        <Input
          type={field.type === "phone" ? "tel" : field.type}
          placeholder={field.placeholder}
          className="bg-secondary/40 border-border/40 focus:border-primary/50 focus:ring-primary/20"
        />
      )}

      {field.type === "textarea" && (
        <Textarea
          placeholder={field.placeholder}
          className="bg-secondary/40 border-border/40 focus:border-primary/50 focus:ring-primary/20 min-h-[80px]"
        />
      )}

      {field.type === "select" && field.options && (
        <Select>
          <SelectTrigger className="bg-secondary/40 border-border/40">
            <SelectValue placeholder={field.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === "checkbox" && (
        <div className="flex items-center gap-2">
          <Checkbox id={field.id} />
          <Label htmlFor={field.id} className="text-sm text-muted-foreground">
            {field.placeholder || field.label}
          </Label>
        </div>
      )}

      {field.type === "radio" && field.options && (
        <RadioGroup>
          {field.options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`${field.id}-${opt.value}`} />
              <Label htmlFor={`${field.id}-${opt.value}`} className="text-sm text-muted-foreground">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </motion.div>
  );
}

export function FormPreview({ form, isGenerating }: FormPreviewProps) {
  const handleCopyJSON = () => {
    if (form) {
      navigator.clipboard.writeText(JSON.stringify(form, null, 2));
      toast.success("Form JSON copied to clipboard!");
    }
  };

  const handleDownloadJSON = () => {
    if (form) {
      const blob = new Blob([JSON.stringify(form, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.title.toLowerCase().replace(/\s+/g, "-")}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Form JSON downloaded!");
    }
  };

  if (isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-muted-foreground font-display">Crafting your form...</p>
        </motion.div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
            <FileJson className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-display font-semibold text-foreground/80 mb-2">
            No form yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Describe your form in the prompt panel and hit generate to see it here.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-display font-bold text-foreground"
            >
              {form.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {form.description}
            </motion.p>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="outline" onClick={handleCopyJSON} className="border-border/50 hover:bg-secondary">
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={handleDownloadJSON} className="border-border/50 hover:bg-secondary">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 space-y-5"
        >
          <AnimatePresence>
            {form.fields.map((field, i) => (
              <FieldRenderer key={field.id} field={field} index={i} />
            ))}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: form.fields.length * 0.06 + 0.1 }}
          >
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold mt-4">
              Submit
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
