import { UserRole } from "../features/auth/types/auth.types";

type RoleClasses = {
    // Background
    screenBg: string
    headerBg: string
    surfaceBg: string
    badgeBg: string
    // Text
    textPrimary: string
    textMuted: string
    textHeader: string
    textAccent: string
    // Borders
    border: string
    borderActive: string
    // Components
    button: string
    buttonText: string
    input: string
    errorBox: string
    // Role label
    accentText: string
}
export const getRoleClasses = (role: UserRole): RoleClasses => {
    if (role === 'transporter') {
        return {
            // Backgrounds
            screenBg: 'bg-ms-background',
            headerBg: 'bg-ms-secondary',
            surfaceBg: 'bg-ms-surface',
            badgeBg: 'bg-ms-badge',

            // Text
            textPrimary: 'text-ms-textDark',
            textMuted: 'text-ms-textMuted',
            textHeader: 'text-white',
            textAccent: 'text-ms-primary',

            // Borders
            border: 'border-ms-border',
            borderActive: 'border-ms-secondary',

            // Components
            button: 'bg-ms-primary',
            buttonText: 'text-ms-textDark',
            input: 'bg-ms-surface border border-ms-border text-ms-textDark',
            errorBox: 'bg-red-50 border border-red-200',

            // Accent
            accentText: 'text-ms-primary',
        }
    }
    return {
        // Backgrounds
        screenBg: 'bg-fe-background',
        headerBg: 'bg-fe-secondary',
        surfaceBg: 'bg-fe-surface',
        badgeBg: 'bg-fe-badge',

        // Text
        textPrimary: 'text-fe-textDark',
        textMuted: 'text-fe-textMuted',
        textHeader: 'text-white',
        textAccent: 'text-fe-primary',

        // Borders
        border: 'border-fe-border',
        borderActive: 'border-fe-primary',

        // Components
        button: 'bg-fe-primary',
        buttonText: 'text-white',
        input: 'bg-fe-surface border border-fe-border text-fe-textDark',
        errorBox: 'bg-red-50 border border-red-200',

        // Accent
        accentText: 'text-fe-accent',
    }
}