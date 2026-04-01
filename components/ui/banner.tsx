import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const bannerVariants = cva(
  "sticky top-0 text-center border px-2.5 py-2.5 text-md font-semibold transition-colors max-w-full h-12",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-200 text-secondary-foreground hover:bg-amber-200/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof bannerVariants> { }

function Banner({ className, variant, ...props }: BannerProps) {
  return (
    <div className={cn(bannerVariants({ variant }), className)} {...props} />
  )
}

export { Banner, bannerVariants }
