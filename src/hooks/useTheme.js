import { useState } from 'react';

const DEFAULT_THEME = "light"

function useTheme(startingTheme = DEFAULT_THEME) {
    const [theme, setTheme] = useState(startingTheme);

    function validateTheme(themeValue) {
        if (themeValue === "dark") {
            setTheme("dark");
        } else {
            setTheme(DEFAULT_THEME);
        }
    }

    return {
        theme,
        setTheme: validateTheme,
    }
}

export default useTheme;