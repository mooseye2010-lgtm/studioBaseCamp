import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function LoadingSpinner() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="relative h-24 w-24">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-muted-foreground/50 rounded-full" />
                <Icons.Stake className="h-16 w-16 text-primary absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom-right animate-stake-in" />
            </div>
      </div>
    );
}