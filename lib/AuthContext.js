"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing session in localStorage
        const session = localStorage.getItem("astryx_session");
        if (session) {
            try {
                setUser(JSON.parse(session));
            } catch {
                localStorage.removeItem("astryx_session");
            }
        }
        setIsLoading(false);
    }, []);

    const signup = (name, email, password) => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem("astryx_users") || "[]");

        // Check if email already exists
        if (users.find((u) => u.email === email)) {
            throw new Error("An account with this email already exists");
        }

        // Create new user
        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString(),
            avatar: name.charAt(0).toUpperCase(),
        };

        users.push(newUser);
        localStorage.setItem("astryx_users", JSON.stringify(users));

        // Auto-login after signup
        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
        localStorage.setItem("astryx_session", JSON.stringify(sessionUser));
        setUser(sessionUser);

        return sessionUser;
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem("astryx_users") || "[]");
        const found = users.find((u) => u.email === email && u.password === password);

        if (!found) {
            throw new Error("Invalid email or password");
        }

        const sessionUser = { id: found.id, name: found.name, email: found.email, avatar: found.avatar };
        localStorage.setItem("astryx_session", JSON.stringify(sessionUser));
        setUser(sessionUser);

        return sessionUser;
    };

    const logout = () => {
        localStorage.removeItem("astryx_session");
        setUser(null);
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        localStorage.setItem("astryx_session", JSON.stringify(updatedUser));

        // Also update in users list
        const users = JSON.parse(localStorage.getItem("astryx_users") || "[]");
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            localStorage.setItem("astryx_users", JSON.stringify(users));
        }

        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
