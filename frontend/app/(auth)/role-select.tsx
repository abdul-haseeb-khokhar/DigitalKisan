import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { UserRole } from "../../features/auth/types/auth.types";

const ROLES: {
    label: string
    value: UserRole
    emoji: string
    tagline: string
    cardBg: string
    borderColor: string
    labelColor: string
    taglineColor: string
    badgeBg: string
    badgeText: string
    badgeLabel: string
    arrowColor: string
    circleBg: string
}[] = [
        {
            label: 'Farmer',
            value: 'farmer',
            emoji: '🌾',
            tagline: 'List your crops and connect with buyers directly',
            cardBg: 'bg-fe-badge',
            borderColor: 'border-fe-primary',
            labelColor: 'text-fe-textDark',
            taglineColor: 'text-fe-textMuted',
            badgeBg: 'bg-fe-primary',
            badgeText: 'text-white',
            badgeLabel: 'Fresh Earth',
            arrowColor: 'text-fe-primary',
            circleBg: 'bg-fe-primary',
        },
        {
            label: 'Buyer',
            value: 'buyer',
            emoji: '🛒',
            tagline: 'Browse fresh crops and place orders from farmers',
            cardBg: 'bg-fe-badge',
            borderColor: 'border-fe-primary',
            labelColor: 'text-fe-textDark',
            taglineColor: 'text-fe-textMuted',
            badgeBg: 'bg-fe-primary',
            badgeText: 'text-white',
            badgeLabel: 'Fresh Earth',
            arrowColor: 'text-fe-primary',
            circleBg: 'bg-fe-primary',
        },
        {
            label: 'Transporter',
            value: 'transporter',
            emoji: '🚛',
            tagline: 'Bid on transport jobs and grow your business',
            cardBg: 'bg-ms-badge',
            borderColor: 'border-ms-secondary',
            labelColor: 'text-ms-textDark',
            taglineColor: 'text-ms-textMuted',
            badgeBg: 'bg-ms-secondary',
            badgeText: 'text-white',
            badgeLabel: 'Mitti & Sky',
            arrowColor: 'text-ms-secondary',
            circleBg: 'bg-ms-secondary',
        }
    ]

export default function RoleSelectionScreen() {
    const router = useRouter()

    const handleRoleSelect = (role: UserRole) => {
        router.push(`/(auth)/login?role=${role}`)
    }

    return (
        <SafeAreaView className="flex-1 bg-fe-background">
            <View className="items-center px-6 pt-16 pb-8">
                <Text className="text-fe-textDark text-3xl text-center">Digital Kisan</Text>
                <Text className="text-fe-textMuted text-base text-center">Who are you joining as?</Text>
            </View>

            <View className="px-6 gap-4">
                {ROLES.map((r) => (
                    <TouchableOpacity
                        key={r.value} onPress={() => handleRoleSelect(r.value)} activeOpacity={0.85}
                        className={`${r.cardBg} ${r.borderColor} border-2 rounded-2xl p-5 flex-row items-center gap-4`}>
                        <View className={`${r.circleBg} w-16 h-16 rounded-full items-center justify-center`}>
                            <Text className="text-3xl">{r.emoji}</Text>
                        </View>

                        <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-1">
                                <Text className={`${r.labelColor} text-lg font-bold`}>
                                    {r.label}
                                </Text>
                            </View>
                            <Text className={`${r.taglineColor} text-sm leading-5`}>
                                {r.tagline}
                            </Text>
                        </View>
                        <Text className={`${r.arrowColor} text-2xl font-bold`}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View className="mt-auto pb-10 items-center">
                <Text className="text-fe-textMuted text-sm">
                    Already have an account?
                </Text>
                <TouchableOpacity
                    onPress={() => router.push('/(auth)/login?role=farmer')}
                    className="mt-1"
                >
                    <Text className="text-fe-primary text-sm font-bold">
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}