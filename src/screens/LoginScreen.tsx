import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authService } from '../services';
import { COLORS } from '../theme';

interface LoginScreenProps {
  navigation: any;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLikelyPhone = /^\+?\d+$/.test(loginId.trim());

  // 1. Email Format Validator: Check karta hai ki email me '@' aur domain '.' sahi jagah hai ya nahi (jaise user@example.com)
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // 2. Phone Cleaning Helper: Spaces, dashes aur country code (+91 ya 0) hata kar clean 10-digit number nikalta hai
  const cleanPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      return digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      return digits.slice(1);
    }
    return digits;
  };

  // 3. Mobile Number Validator: Check karta hai ki cleaned number poore 10 digits ka valid Indian mobile number hai ya nahi
  const isValidPhone = (value: string): boolean => {
    const cleaned = cleanPhoneNumber(value);
    return /^[6-9]\d{9}$/.test(cleaned) || /^\d{10}$/.test(cleaned);
  };

  const handleLogin = async () => {
    const trimmedLoginId = loginId.trim();

    // VALIDATION 1 (Required Check): Agar user ne email ya phone ka box khali chhod diya toh aage mat badho
    if (!trimmedLoginId) {
      Alert.alert('Validation Error', 'Please enter your email or mobile number.');
      return;
    }

    const isEmail = isValidEmail(trimmedLoginId);
    const cleanedPhone = cleanPhoneNumber(trimmedLoginId);
    const isPhone = isValidPhone(trimmedLoginId);

    // VALIDATION 2 (Format Check): Check karo ki input ya toh valid email ho YA valid 10-digit phone number ho
    if (!isEmail && !isPhone) {
      const digitsOnly = trimmedLoginId.replace(/\D/g, '');
      // Agar user ne number type kiya par wo 10 digits se kam ya zyada hai
      if (digitsOnly.length > 0 && !trimmedLoginId.includes('@')) {
        Alert.alert(
          'Validation Error',
          `Please enter a valid 10-digit mobile number.${digitsOnly.length > 0 ? ` (Entered ${digitsOnly.length} digits)` : ''}`
        );
      // Agar user ne '@' likha hai par email ka format galat hai (e.g. bina .com ke)
      } else if (trimmedLoginId.includes('@')) {
        Alert.alert(
          'Validation Error',
          'Please enter a valid email address (e.g. user@example.com).'
        );
      // Agar na number samajh aaya na email
      } else {
        Alert.alert(
          'Validation Error',
          'Please enter a valid email address or 10-digit mobile number.'
        );
      }
      return;
    }

    // VALIDATION 3 (Password Required Check): Password khali nahi hona chahiye
    if (!password) {
      Alert.alert('Validation Error', 'Please enter your password.');
      return;
    }

    // VALIDATION 4 (Password Minimum Length Check): Security ke liye password kam se kam 6 characters ka hona zaroori hai
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    const loginIdentifier = isPhone ? cleanedPhone : trimmedLoginId.toLowerCase();

    setLoading(true);
    try {
      const { ok, data } = await authService.login({ email: loginIdentifier, password });
      setLoading(false);

      if (ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserHome', params: { user: data.user } }],
        });
      } else {
        Alert.alert('Login Failed', data.error || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Network Error', 'Could not connect to authentication server.');
    }
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Bar */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 16, color: '#121c2a' }}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => Alert.alert('FlyGo Support', '24/7 Helpline: 1800-FLY-GO')}
              activeOpacity={0.7}
            >
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          {/* Brand & Greeting */}
          <View style={styles.brandSection}>
            <View style={styles.logoBox}>
              <Text style={{ fontSize: 26, color: '#ffffff' }}>✈</Text>
            </View>
            <Text style={styles.brandTitle}>FlyGo</Text>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue planning your next journey.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Field 1: Email / Mobile */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Mobile number</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>{isLikelyPhone ? '📞' : '✉'}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email or 10-digit mobile"
                  placeholderTextColor="#717786"
                  value={loginId}
                  onChangeText={setLoginId}
                  autoCapitalize="none"
                  keyboardType={isLikelyPhone ? 'phone-pad' : 'default'}
                />
              </View>
            </View>

            {/* Field 2: Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="password"
                  placeholderTextColor="#717786"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Text style={{ fontSize: 16, color: '#717786' }}>
                    {showPassword ? '👁' : '🙈'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>

            {/* Log in Primary CTA */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.loginBtnText}>Log in</Text>
              )}
            </TouchableOpacity>

            {/* Log in with OTP Secondary Button */}
            <TouchableOpacity
              style={styles.otpBtn}
              onPress={() => navigation.navigate('Otp')}
              activeOpacity={0.8}
                >
              {/* <Text style={{ fontSize: 16, color: '#0059bb' }}>💬</Text> */}
              <Text style={styles.otpBtnText}>Log in with OTP</Text>
            </TouchableOpacity>

          </View>

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Create account</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.trustBadge}>
              {/* <Text style={{ fontSize: 14, color: '#006387' }}>✓</Text> */}
              {/* <Text style={styles.trustText}>Your information is securely encrypted</Text> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  helpText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },

  /* BRAND & HEADER */
  brandSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 4,
  },
  brandTitle: {
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  welcomeTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.textMuted,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textDark,
    padding: 0,
  },
  eyeBtn: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loginBtn: {
    height: 54,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 4,
  },
  loginBtnText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  otpBtn: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  otpBtnText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderDivider,
  },
  dividerText: {
    marginHorizontal: 10,
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerPrompt: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: COLORS.textMuted,
  },
  registerLink: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: COLORS.textPlaceholder,
  },
});
