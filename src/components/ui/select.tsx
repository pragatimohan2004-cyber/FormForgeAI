import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({ className, children, ...props }: any) {
  return (
    <SelectPrimitive.Trigger className={cn("flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm", className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild><ChevronDown className="h-4 w-4 opacity-50" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({ className, children, ...props }: any) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md", className)} {...props}>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({ className, children, ...props }: any) {
  return (
    <SelectPrimitive.Item className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground", className)} {...props}>
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export function SelectLabel({ className, ...props }: any) {
  return <SelectPrimitive.Label className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
}

export function SelectSeparator({ className, ...props }: any) {
  return <SelectPrimitive.Separator className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
}