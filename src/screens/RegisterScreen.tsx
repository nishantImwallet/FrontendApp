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
import { authService } from '../services';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required.');
      return;
    }
    if (!email.trim() || !password) {
      Alert.alert('Validation Error', 'Please fill in email and password.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Terms & Conditions', 'Please agree to FlyGo Terms and Privacy Policy to continue.');
      return;
    }

    setLoading(true);
    try {
      const { ok, data } = await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'user',
      });
      setLoading(false);
      console.log('Registration response:', data);

      if (!ok) {
        const errorMsg =
          typeof data.message === 'string'
          ? data.message
          : typeof data.error === 'string'
          ? data.error
          : 'Registration failed';
        Alert.alert('Registration Failed', errorMsg);
        return;
      }

      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Network Error', 'Cannot connect to server');
    } finally {
      setLoading(false);
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
                    placeholder=""
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
                    placeholder=""
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
                  placeholder=""
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
                    placeholder=""
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
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
                  placeholder=""
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
    backgroundColor: '#f8f9ff',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#121c2a',
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    // borderColor: '#e2e8f0',
  
  },
  brandIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandPlaneIcon: {
    fontSize: 12,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0059bb',
    letterSpacing: -0.3,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#121c2a'
  },
  helpIcon: {
    fontSize: 13,
  },
  helpText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#565e74',
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
    backgroundColor: '#eff4ff',
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
    color: '#0059bb',
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#121c2a',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 13,
    color: '#565e74',
    marginTop: 4,
  },

  /* FORM CARD */
  formCard: {
    marginTop:60, 
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    // elevation: 4,
    // shadowColor: '#0f172a',
    // shadowOpacity: 0.06,
    // shadowRadius: 16,
    // shadowOffset: { width: 0, height: 4 },
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
    // color: '#414754',
    marginBottom: 6,
     },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    // borderColor: '#c1c6d7',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
  },
  inputPrefixIcon: {
    fontSize: 16,
    marginRight: 8,
     color: '#0059bb',
  },
  input: {
    flex: 1,
    fontSize: 14,
    // color: '#121c2a',
    height: '100%',
  },
  inputNoIcon: {
    flex: 1,
    fontSize: 14,
    // color: '#121c2a',
    height: '100%',
    paddingHorizontal: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    // borderColor: '#c1c6d7',
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
    backgroundColor: '#eff4ff',
    borderRightWidth: 1,
    borderRightColor: '#c1c6d7',
  },
  flagIcon: {
    fontSize: 15,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#121c2a',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#565e74',
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
    color: '#121c2a',
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
    color: '#565e74',
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
    borderColor: '#c1c6d7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: '#ffffff',
  },
  checkboxActive: {
    backgroundColor: '#0059bb',
    borderColor: '#0059bb',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 12,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#565e74',
    lineHeight: 16,
  },
  termsLink: {
    color: '#0059bb',
    fontWeight: '600',
  },
  registerBtn: {
    height: 50,
    backgroundColor: '#0059bb',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    // elevation: 4,
    // shadowColor: '#0059bb',
    // shadowOpacity: 0.35,
    // shadowRadius: 10,
    // shadowOffset: { width: 0, height: 4 },
  },
  registerBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  btnArrow: {
    color: '#ffffff',
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
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#717786',
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
    borderColor: '#c1c6d7',
    backgroundColor: '#ffffff',
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
    color: '#121c2a',
  },
  loginPromptRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  loginPromptText: {
    fontSize: 13,
    // color: '#565e74',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0059bb', 
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
    backgroundColor: '#e6eeff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d9e3f6',
  },
  lockIcon: {
    fontSize: 12,
  },
  encryptionText: {
    fontSize: 11,
    color: '#565e74',
    fontWeight: '500',
  },
});
