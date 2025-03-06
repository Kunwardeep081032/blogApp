/* eslint-disable react-refresh/only-export-components */
// Custom hook to manage Theme context dark to light, light to dark

import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextProps = {
    mode: "light" | "dark";
    setMode: (mode: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] = useState<ThemeContextProps["mode"]>(
        (localStorage.getItem("theme") as ThemeContextProps["mode"]) || "light",
    );

    const changeTheme = (mode: ThemeContextProps["mode"]) => {
        if (mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", mode);
    };

    useEffect(() => {
        changeTheme(mode);
    }, [mode]);

    return <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
