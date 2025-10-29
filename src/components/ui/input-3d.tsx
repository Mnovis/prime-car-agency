import * as React from "react";
import { cn } from "@/lib/utils";
import { Mail, Lock } from "lucide-react";

export interface Input3DProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: "email" | "password";
  label?: string;
}

const Input3D = React.forwardRef<HTMLInputElement, Input3DProps>(
  ({ className, type, icon, label, ...props }, ref) => {
    const IconComponent = icon === "email" ? Mail : Lock;

    return (
      <div className="relative">
        {label && (
          <span className="absolute -top-3 left-5 bg-primary text-primary-foreground font-bold px-3 py-1 text-xs border-2 border-black z-10 tracking-wide">
            {label}
          </span>
        )}
        <div
          className={cn(
            "group relative bg-muted/20 p-5 flex items-center gap-4 border-4 border-black max-w-md transition-all duration-500 ease-out",
            "hover:scale-105 hover:shadow-[25px_25px_0_-5px_hsl(var(--primary)),25px_25px_0_0_#000]",
            "shadow-[10px_10px_0_#000]",
            "[transform-style:preserve-3d] [perspective:1000px]",
            "[transform:rotateX(10deg)_rotateY(-10deg)]",
            "hover:[transform:rotateX(5deg)_rotateY(-5deg)_scale(1.05)]",
            className
          )}
        >
          {/* Shadow blur effect */}
          <div className="absolute inset-0 -z-10 [transform:translateZ(-50px)] bg-gradient-to-br from-primary/40 to-primary/10 blur-xl" />

          {/* Icon button */}
          {icon && (
            <button
              type="button"
              className={cn(
                "border-3 border-black bg-primary p-3 transition-all duration-500 ease-out",
                "flex items-center justify-center relative z-[3] [transform:translateZ(20px)]",
                "hover:[transform:translateZ(10px)_translateX(-5px)_translateY(-5px)]",
                "hover:shadow-[5px_5px_0_0_#000]"
              )}
              tabIndex={-1}
            >
              <IconComponent className="w-6 h-6 text-black" />
            </button>
          )}

          {/* Input field */}
          <input
            type={type}
            className={cn(
              "w-full outline-none border-3 border-black p-4 text-lg bg-background text-foreground",
              "transition-all duration-500 ease-out relative z-[3] [transform:translateZ(10px)]",
              "placeholder:text-muted-foreground placeholder:font-bold placeholder:uppercase placeholder:tracking-wide",
              "hover:bg-muted/10 focus:bg-muted/10",
              "hover:[transform:translateZ(20px)_translateX(-5px)_translateY(-5px)]",
              "focus:[transform:translateZ(20px)_translateX(-5px)_translateY(-5px)]",
              "hover:shadow-[5px_5px_0_0_#000] focus:shadow-[5px_5px_0_0_#000]",
              "font-mono tracking-tight"
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input3D.displayName = "Input3D";

export { Input3D };
