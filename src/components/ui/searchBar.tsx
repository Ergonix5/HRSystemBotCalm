import * as React from "react"
import { cn } from "@/src/lib/utils"

function SearchInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <div
      data-slot="search-input-wrapper"
      className={cn(
        "flex items-center gap-2 h-[35px]  w-full rounded-md overflow-hidden",
        "border border-gray-500/30 bg-white px-3",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 30 30"
        className="shrink-0 text-gray-500"
        fill="currentColor"
      >
        <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
      </svg>

      <input
        data-slot="search-input"
        className={cn(
          "h-full w-full bg-transparent outline-none",
          "text-sm text-gray-500 placeholder:text-gray-500",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        {...props}
      />
    </div>
  )
}

export { SearchInput }
