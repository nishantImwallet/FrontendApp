import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme';
import { useAuth } from '../hooks';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading } = useAuth({ navigation });

  const handleRegister = async () => {
    const res = await register(
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone,
        password,
        role: 'user',
      },
      agreeTerms
    );

    if (res.success) {
      navigation.navigate('Login');
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
    <KeyboardAvoidingView
        style={styles.flexOne}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. TOP BAR NAVIGATION */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                if (navigation.canGoBack()) navigation.goBack();
              }}
            >
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>

            <View style={styles.brandCenter}>
              <View style={styles.brandIconBox}>
                <Text style={styles.brandPlaneIcon}>🛫</Text>
              </View>
              <Text style={styles.brandName}>FlyGo</Text>
            </View>

            <TouchableOpacity
              style={styles.helpBtn}
              onPress={() =>
                Alert.alert('FlyGo Support', 'Contact us at support@flygo.com or +91-1800-FLY-GO')
              }
            >
              <Text style={styles.helpIcon}>❓</Text>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          {/* 2. SECURITY PILL & INTRO */}
          {/* <View style={styles.introSection}>
            <View style={styles.securityPill}>
              <Text style={styles.securityIcon}>🛡️</Text>
              <Text style={styles.securityPillText}>AVIATION GRADE SECURITY</Text>
            </View>
            <Text style={styles.heading}>Create your account</Text>
            <Text style={styles.subheading}>
              Join FlyGo to book flights, track journeys, and earn miles.
            </Text>
          </View> */}

          {/* 3. REGISTRATION FORM CARD */}
          <View style={styles.formCard}>
            {/* First & Last Name 2-Column Grid */}
            <View style={styles.nameRow}>
              <View style={styles.nameCol}>
                <Text style={styles.label}>First name</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputPrefixIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Rahul"
                    placeholderTextColor="#94A3B8"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>

              <View style={styles.nameCol}>
                <Text style={styles.label}>Last name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputNoIcon}
                    placeholder="e.g. Sharma"
                    placeholderTextColor="#94A3B8"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email address</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefixIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. user@example.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Mobile Number with Country Code */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile number</Text>
              <View style={styles.phoneContainer}>
                <View style={styles.countryPill}>
                  <Text style={styles.flagIcon}>🇮🇳</Text>
                  <Text style={styles.countryCode}>+91</Text>
                  <Text style={styles.dropdownArrow}>⌄</Text>
                </View>

                <View style={styles.phoneInputArea}>
                  <Text style={styles.phoneIcon}>📞</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="10-digit number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputPrefixIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

              {/* Requirement hint */}
              {/* <View style={styles.hintRow}> */}
                {/* <Text style={styles.hintIcon}>🛡️</Text>
                <Text style={styles.hintText}>
                  At least 8 characters with a number & symbol
                </Text>
              </View> */}
            </View>

            {/* Terms & Conditions Checkbox */}
        {/* <TouchableOpacity
              style={styles.termsRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxActive]}>
                {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to FlyGo's{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
        </TouchableOpacity> */}

            {/* Primary Action Button */}
        <TouchableOpacity
              style={styles.registerBtn}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
        >
              <Text style={styles.registerBtnText}>
                {loading ? 'Creating account...' : 'Create account'}
              </Text>
              <Text style={styles.btnArrow}>→</Text>
        </TouchableOpacity>
      </View>

          {/* 4. ALTERNATIVE ONBOARDING */}
          <View style={styles.socialSection}>
            <View style={styles.loginPromptRow}>
              <Text style={styles.loginPromptText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log in</Text>
      </TouchableOpacity>
            </View>
          </View>

          {/* 5. FOOTER */}
          {/* <View style={styles.footerSection}>
            <View style={styles.encryptionBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.encryptionText}>
                256-bit encrypted passenger verification
              </Text>
            </View>
          </View> */}
        </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flexOne: {
    flex: 1, 
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: COLORS.textDark,
    lineHeight: 28,
    fontWeight: '300',
  },
  brandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  
  },
  brandIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandPlaneIcon: {
    fontSize: 12,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  helpIcon: {
    fontSize: 13,
  },
  helpText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },

  /* INTRO */
  introSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  securityPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(0, 89, 187, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  securityIcon: {
    fontSize: 12,
  },
  securityPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  /* FORM CARD */
  formCard: {
    marginTop:60, 
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  nameCol: {
    flex: 1,
  },
  fieldGroup: {
    marginBottom: 12,
     },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
     },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
  },
  inputPrefixIcon: {
    fontSize: 16,
    marginRight: 8,
    color: COLORS.primary,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    height: '100%',
  },
  inputNoIcon: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    height: '100%',
    paddingHorizontal: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 6,
    height: 48,
    overflow: 'hidden',
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: '100%',
    backgroundColor: COLORS.primaryLight,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight,
  },
  flagIcon: {
    fontSize: 15,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  phoneInputArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
  },
  phoneIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  phoneInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    height: '100%',
  },
  passwordInput: {
    paddingRight: 6,
  },
  eyeBtn: {
    padding: 6,
  },
  eyeIcon: {
    fontSize: 16,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  hintIcon: {
    fontSize: 12,
  },
  hintText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: COLORS.cardBg,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.textLight,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  registerBtn: {
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  registerBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '700',
  },
  btnArrow: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
  },

  /* SOCIAL */
  socialSection: {
    marginTop: 18,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    marginHorizontal: 10,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.cardBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialIcon: {
    fontSize: 15,
    },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  loginPromptText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary, 
  },

  /* FOOTER */
  footerSection: {
    alignItems: 'center',
    marginTop: 18,
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  lockIcon: {
    fontSize: 12,
  },
  encryptionText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
