"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: number
  priority?: boolean
  variant?: "default" | "fill"
}

export function Logo({ className, size = 32, priority = false, variant = "default" }: LogoProps) {
  if (variant === "fill") {
    return (
      <Image
        src="/logo-final.png"
        alt="VIGILANTE Logo"
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 33vw"
        style={{ objectFit: 'contain' }}
        className={cn("object-contain", className)}
      />
    )
  }

  return (
    <Image
      src="/logo-final.png"
      alt="VIGILANTE Logo"
      width={size}
      height={size}
      priority={priority}
      style={{ width: `${size}px`, height: 'auto', aspectRatio: '1/1' }}
      className={cn("shrink-0", className)}
    />
  )
}
