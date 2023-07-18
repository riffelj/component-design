import React, { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children, initialLogginInUser }) {
    const [loggedInUser, setLoggedInUser] = useState(initialLogginInUser);
    return (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider }