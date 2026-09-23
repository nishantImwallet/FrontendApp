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
import { useAuth } from '../hooks';

interface OtpLoginScreenProps {
  navigation: any;
}

export default function OtpLoginScreen({ navigation }: OtpLoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const { sendOtp, loading } = useAuth({ navigation });

  const handleGetOtp = async () => {
    const res = await sendOtp(phoneNumber);
    if (res.success) {
      setCodeSent(true);
      if (res.data?.debugOtp) {
        Alert.alert('OTP Sent', `Verification OTP for test: ${res.data.debugOtp}`);
      }
      setTimeout(() => {
        setCodeSent(false);
        navigation.navigate('VerifyOtp', { phoneNumber: res.phoneNumber || phoneNumber });
      }, 800);
    } else {
      // Fallback transition for offline mode if needed
      navigation.navigate('VerifyOtp', { phoneNumber });
    }
  };

  return (

    <>
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
          {/* Top Bar Navigation */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              // onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Login')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18, color: '#121c2a' }}>←</Text> 
          </TouchableOpacity> 

            <View style={styles.brandContainer}>
              <View style={styles.brandIconBox}>
                <Text style={{ fontSize: 14, color: '#ffffff' }}>✈</Text>
              </View>
              <Text style={styles.brandText}>FlyGo</Text>
            </View>

            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => Alert.alert('FlyGo Support', '24/7 Aviation Helpline: 1800-FLY-GO')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14, color: '#565e74' }}>?</Text>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          {/* Main Greeting & Intro Header */}
          <View style={styles.introContainer}>
            {/* <View style={styles.securityBadge}>
              <Text style={{ fontSize: 12, color: '#0059bb' }}>✓</Text>
              <Text style={styles.securityBadgeText}>Aviation Grade Security</Text>
            </View> */}
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your mobile number to continue securely.</Text>
          </View>

          {/* Main Card Component */}
          <View style={styles.card}>
            <Text style={styles.label}>Mobile number</Text>

            {/* Input Row */}
            <View style={styles.inputContainer}>
              {/* Country Selector */}
              <TouchableOpacity style={styles.countryPicker} activeOpacity={0.7}>
                <View style={styles.flagIcon}>
                  <View style={[styles.flagStripe, { backgroundColor: '#f4c430' }]} />
                  <View style={[styles.flagStripe, { backgroundColor: '#ffffff' }]} />
                  <View style={[styles.flagStripe, { backgroundColor: '#2e7d32' }]} />
                </View>
                <Text style={styles.countryCode}>+91</Text>
                <Text style={{ fontSize: 12, color: '#565e74', marginLeft: 2 }}>▼</Text>
              </TouchableOpacity>

              {/* Vertical Divider */}
              <View style={styles.verticalDivider} />

              {/* Phone Input */}
              <TextInput
                style={styles.phoneInput}
                placeholder="your number"
                placeholderTextColor="#121c2a"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
              <Text style={{ fontSize: 16, color: '#717786' }}>📞</Text>
            </View>

            {/* Microcopy info */}
            {/* <View style={styles.infoRow}>
              <Text style={{ fontSize: 14, color: '#0059bb' }}>ⓘ</Text>
              <Text style={styles.infoText}>
                We'll send a 6-digit verification code to this number.
              </Text>
            </View> */}

            {/* Action CTA Button */}
            <TouchableOpacity
              style={[
                styles.otpButton,
                codeSent && { backgroundColor: '#006387' },
              ]}
              onPress={handleGetOtp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.otpButtonText}>Sending OTP...</Text>
                </View>
              ) : codeSent ? (
                <View style={styles.buttonContent}>
                  <Text style={styles.otpButtonText}>Code Sent!</Text>
                  <Text style={{ fontSize: 16, color: '#ffffff' }}>✓</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.otpButtonText}>Get OTP</Text>
                  <Text style={{ fontSize: 16, color: '#ffffff' }}>→</Text>
                </View>
              )}
            </TouchableOpacity>

          </View>

          {/* FlyGo Fast-Pass Auto Read Banner */}
          {/* <View style={styles.fastPassBanner}>
            <View style={styles.fastPassLeft}>
              <View style={styles.flashIconBox}>
                <Text style={{ fontSize: 12, color: '#0059bb' }}>⚡</Text>
              </View>
              <Text style={styles.fastPassText}>Auto-read SMS on this device</Text>
            </View>
            <Text style={styles.fastPassStatus}>Active</Text>
          </View> */}

          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>New to FlyGo? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Create account</Text>
              </TouchableOpacity>
            </View>

            {/* <View style={styles.encryptionBadge}>
              <Text style={{ fontSize: 14, color: '#0059bb' }}>🛡</Text>
              <Text style={styles.encryptionText}>
                Your information is protected with secure encryption.
              </Text>
            </View> */}

            {/* <Text style={styles.termsText}>
              By logging in, you agree to FlyGo's Terms of Service and Privacy Policy.
            </Text> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
    </>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    minHeight: '100%',
    justifyContent: 'space-between',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    // borderColor: 'rgba(193, 198, 215, 0.4)',
     borderColor: '#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0059bb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#0059bb',
    letterSpacing: -0.5,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eff4ff',
  },
  helpText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#565e74',
  },
  introContainer: {
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.3)',
    marginBottom: 12,
  },
  securityBadgeText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#0059bb',
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700',
    color: '#121c2a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#565e74',
    marginTop: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    // borderColor: 'rgba(193, 198, 215, 0.5)',
    borderColor: '#121c2a',
    padding: 24,
    // elevation: 2,
    // shadowColor: '#0f172a',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.06,
    // shadowRadius: 20,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#121c2a',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    // borderColor: 'rgba(193, 198, 215, 0.7)',
    borderColor: '#121c2a',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 4,
  },
  flagIcon: {
    width: 20,
    height: 14,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagStripe: {
    flex: 1,
    width: '100%',
    borderColor: '#121c2a',
  },
  countryCode: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#121c2a',
    marginLeft: 4,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    // backgroundColor: 'rgba(193, 198, 215, 0.6)',
    backgroundColor: '#121c2a',
    marginHorizontal: 8,
  },
  phoneInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#121c2a',
    letterSpacing: 0.5,
    padding: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  infoText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
    flex: 1,
  },
  otpButton: {
    height: 56,
    backgroundColor: '#0059bb',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    // elevation: 4,
    // shadowColor: '#0059bb',
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.35,
    // shadowRadius: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(193, 198, 215, 0.4)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '500',
    color: '#565e74',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.6)',
    backgroundColor: '#ffffff',
  },
  socialText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#121c2a',
  },
  fastPassBanner: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fastPassLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flashIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 89, 187, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastPassText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: '#414754',
  },
  fastPassStatus: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600',
    color: '#0059bb',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
    gap: 14,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registerPrompt: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#414754',
  },
  registerLink: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#0059bb',
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 244, 255, 0.6)',
  },
  encryptionText: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '500',
    color: '#565e74',
  },
  termsText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#717786',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
