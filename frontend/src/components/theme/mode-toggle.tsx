import { createSignal, onMount } from "solid-js";
import { CgLaptop } from "solid-icons/cg";
import { FaSolidMoon } from "solid-icons/fa";
import { FaSolidSun } from "solid-icons/fa";
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type ThemeMode = "light" | "dark" | "system";

export function ModeToggle() {
    const [theme, setTheme] = createSignal<ThemeMode>("system");

    // Initialize theme from localStorage or system preference
    onMount(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeMode;
        if (savedTheme) {
            setTheme(savedTheme);
            applyTheme(savedTheme);
        } else {
            applyTheme("system");
        }
    });

    const applyTheme = (mode: ThemeMode) => {
        const html = document.documentElement;

        if (mode === "dark") {
            html.classList.add("dark");
        } else if (mode === "light") {
            html.classList.remove("dark");
        } else if (mode === "system") {
            // Check system preference
            const isDarkSystem =
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (isDarkSystem) {
                html.classList.add("dark");
            } else {
                html.classList.remove("dark");
            }
        }

        localStorage.setItem("theme", mode);
        setTheme(mode);
    };

    const handleModeChange = (mode: ThemeMode) => {
        console.log("Setting theme to:", mode);
        applyTheme(mode);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                as={Button<"button">}
                variant="ghost"
                size="sm"
                class="w-9 px-0"
            >
                <FaSolidSun class="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <FaSolidMoon class="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onSelect={() => handleModeChange("light")}
                >
                    <FaSolidSun class="mr-2 size-4" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleModeChange("dark")}>
                    <FaSolidMoon class="mr-2 size-4" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onSelect={() => handleModeChange("system")}
                >
                    <CgLaptop class="mr-2 size-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
