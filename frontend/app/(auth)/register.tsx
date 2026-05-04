import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useAuthContext } from '../../context/AuthContext'
import { getRoleClasses } from '../../constants/roleClasses'
import { UserRole } from '../../features/auth/types/auth.types'

export default function RegisterScreen() {
  const { role } = useLocalSearchParams<{ role: UserRole }>()
  const selectedRole: UserRole = role ?? 'farmer'
  const cls = getRoleClasses(selectedRole)

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [phone, setPhone]       = useState('')
  const [password, setPassword] = useState('')
  const { register, loading, error } = useAuthContext()
  const router = useRouter()

  const handleRegister = async () => {
    console.log('register function in register.tsx called')
    if (!name || !phone || !password ||!selectedRole) return
    await register({ name, email, phone, password, role: selectedRole,
        ...(email ? {email} : {})
     })
  }

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${cls.screenBg}`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >

        {/* Header */}
        <View className={`${cls.headerBg} pt-20 pb-10 px-6 rounded-b-3xl`}>
          <Text className={`${cls.accentText} text-sm font-medium mb-2`}>
            Digital Kisan
          </Text>
          <Text className="text-white text-3xl font-bold">
            Create Account
          </Text>
          <Text className="text-blue-200 text-sm mt-1 capitalize">
            Joining as {selectedRole}
          </Text>
        </View>

        <View className="px-6 pt-8">

          {/* Error */}
          {error && (
            <View className={`${cls.errorBox} rounded-xl p-4 mb-4`}>
              <Text className="text-error text-sm">{error}</Text>
            </View>
          )}

          {/* Name */}
          <Text className={`${cls.textPrimary} text-sm font-medium mb-1.5`}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Muhammad Iqbal"
            className={`${cls.input} rounded-xl px-4 py-3.5 mb-4`}
          />

          {/* Email */}
          <Text className={`${cls.textPrimary} text-sm font-medium mb-1.5`}>Email</Text>
          <Text className={`${cls.textMuted} text-xs`}> (Optional)</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`${cls.input} rounded-xl px-4 py-3.5 mb-4`}
          />

          {/* Phone */}
          <Text className={`${cls.textPrimary} text-sm font-medium mb-1.5`}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="03001234567"
            keyboardType="phone-pad"
            className={`${cls.input} rounded-xl px-4 py-3.5 mb-4`}
          />

          {/* Password */}
          <Text className={`${cls.textPrimary} text-sm font-medium mb-1.5`}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            className={`${cls.input} rounded-xl px-4 py-3.5 mb-8`}
          />

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className={`${cls.button} rounded-xl py-4 items-center ${loading ? 'opacity-70' : 'opacity-100'}`}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className={`${cls.buttonText} text-base font-bold`}>Create Account</Text>
            }
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className={`${cls.textMuted} text-sm`}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push(`/(auth)/login?role=${selectedRole}`)}>
              <Text className={`${cls.accentText} text-sm font-bold`}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Change Role */}
          <TouchableOpacity
            onPress={() => router.push(`/(auth)/role-select`)}
            className="items-center mt-4 mb-10"
          >
            <Text className={`${cls.textMuted} text-sm`}>← Change role</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}