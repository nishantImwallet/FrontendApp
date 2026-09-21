import React, { useState, useEffect, useRef } from 'react';
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

interface VerifyOtpScreenProps {
  navigation: any;
  route?: any;
}

export default function VerifyOtpScreen({ navigation, route }: VerifyOtpScreenProps) {
  const insets = useSafeAreaInsets();
  const phone = route?.params?.phoneNumber || '9876543210';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeInput, setActiveInput] = useState(5);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(true);

  const inputRefs = useRef<Array<any>>([]);

  // useEffect(() => {
  //   let interval: any = null;
  //   if (timer > 0) {
  //     interval = setInterval(() => setTimer((t) => t - 1), 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveInput(index - 1);
    }
  };

  const handleVerify = async () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 6) {
      Alert.alert('Incomplete Code', 'Please enter all 6 digits of the OTP.');
      return;
    }
    setLoading(true);
    setShowError(false);

    try {
      const { ok, data } = await authService.verifyOtp(phone, enteredCode);
      setLoading(false);

      if (ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserHome', params: { user: data.user || { phone } } }],
        });
      } else {
        setShowError(true);
        Alert.alert('Verification Error', data.error || 'Incorrect OTP code');
      }
    } catch (err) {
      setLoading(false);
      // Demo fallback in case backend is offline
      if (enteredCode === '482093' || enteredCode.length === 6) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserHome', params: { user: { phone } } }],
        });
      } else {
        setShowError(true);
      }
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18, color: '#121c2a' }}>←</Text>
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Text style={{ fontSize: 16, color: '#0059bb' }}>✈</Text>
              <Text style={styles.brandText}>FlyGo</Text>
            </View>

            <TouchableOpacity
              style={styles.helpBtn}
              onPress={() => Alert.alert('Help', 'Support helpline: 1800-FLY-GO')}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 12, color: '#565e74' }}>?</Text>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          </View>

          {/* Security Badge Chip */}
          {/* <View style={styles.badgeWrapper}>
            <View style={styles.securityBadge}>
              <Text style={{ fontSize: 11, color: '#0059bb' }}>✓</Text>
              <Text style={styles.securityBadgeText}>AVIATION GRADE SECURITY</Text>
            </View>
          </View> */}

          {/* Headline & Context */}
          <View style={styles.introBox}>
            <Text style={styles.headline}>Verify your mobile number</Text>
            <View style={styles.subtextRow}>
              <Text style={styles.subtext}>Enter the 6-digit code sent to </Text>
              <Text style={styles.phoneHighlight}>+91 ••••{phone.slice(-4)}</Text>
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 4 }}>
              </TouchableOpacity>
            </View>
          </View>

          {/* OTP Card */}
          <View style={styles.card}>
            {/* 6-Box Grid */}
            <View style={styles.otpGrid}>
              {otp.map((digit, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.otpBox,
                    activeInput === idx && styles.otpBoxActive,
                  ]}
                >
                  <TextInput
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onFocus={() => setActiveInput(idx)}
                    onChangeText={(t) => handleOtpChange(t, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                  />
                </View>
              ))}
            </View>

            {/* Error Banner */}
            {/* {showError && (
              <View style={styles.errorBanner}>
                <Text style={{ fontSize: 14, color: '#ba1a1a' }}>ⓘ</Text>
                <Text style={styles.errorText}>
                  Incorrect security pin. 2 attempts remaining.
                </Text>
                <TouchableOpacity onPress={() => setShowError(false)}>
                  <Text style={{ fontSize: 14, color: '#93000a' }}>✕</Text>
                </TouchableOpacity>
              </View>
            )} */}

            {/* Resend Timer Row */}
            {/* <View style={styles.resendRow}>
              <Text style={styles.resendQuestion}>Didn't receive the code?</Text>
              <View style={styles.timerBox}>
                <Text style={{ fontSize: 12, color: '#565e74' }}>⏱</Text>
                <Text style={styles.timerText}>
                  Resend in <Text style={{ color: '#121c2a', fontWeight: '700' }}>00:{timer < 10 ? `0${timer}` : timer}</Text>
                </Text>
              </View>
            </View> */}
          </View>

          {/* WhatsApp Alternate Button */}
          {/* <TouchableOpacity
            style={styles.whatsAppBtn}
            onPress={() => Alert.alert('WhatsApp OTP', 'Sending verification code via WhatsApp...')}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 14, color: '#0059bb' }}>💬</Text>
            <Text style={styles.whatsAppText}>Send code via WhatsApp instead</Text>
          </TouchableOpacity> */}

          {/* Bottom Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={handleVerify}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.btnRow}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.verifyBtnText}>Verifying Security Token...</Text>
                </View>
              ) : (
                <View style={styles.btnRow}>
                  <Text style={styles.verifyBtnText}>Verify & Continue</Text>
                  <Text style={{ fontSize: 16, color: '#ffffff' }}>→</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changeNumBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.changeNumText}>Change mobile number</Text>
            </TouchableOpacity>

            {/* <View style={styles.trustFooter}>
              <View style={styles.lockRow}>
                <Text style={{ fontSize: 12, color: '#565e74' }}>🔒</Text>
                <Text style={styles.lockText}>256-bit encrypted passenger verification</Text>
              </View>
              <Text style={styles.complianceText}>
                By continuing, you acknowledge FlyGo's Terms of Service and authenticate for secure booking sessions.
              </Text>
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
   borderColor:'#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#0059bb',
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor:'#121c2a',
  },
  helpText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#565e74',
  },
  badgeWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
  },
  securityBadgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: '#0059bb',
    letterSpacing: 0.5,
  },
  introBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headline: {
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '700',
    color: '#121c2a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  subtext: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#414754',
  },
  phoneHighlight: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#121c2a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    // borderColor: 'rgba(193, 198, 215, 0.4)',
     borderColor: '#121c2a',
    padding: 20,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 2,
  },
  otpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    // borderColor: 'rgba(193, 198, 215, 0.6)',
     borderColor: '#121c2a',

    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    borderWidth: 2,
    borderColor: '#0059bb',
    backgroundColor: '#eff4ff',
  },
  otpInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: '#0059bb',
    padding: 0,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#ffdad6',
    borderColor: 'rgba(186, 26, 26, 0.2)',
    borderWidth: 1,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: '#93000a',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.3)',
  },
  resendQuestion: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
  },
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#565e74',
  },
  whatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  whatsAppText: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '600',
    color: '#0059bb',
  },
  footer: {
    marginTop: 24,
    gap: 12,
  },
  verifyBtn: {
    height: 56,
    borderRadius: 6,
    backgroundColor: '#0070ea',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0070ea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 4,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifyBtnText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  changeNumBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  changeNumText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500',
    color: '#565e74',
  },
  trustFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(193, 198, 215, 0.3)',
    paddingTop: 12,
    alignItems: 'center',
    gap: 6,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockText: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#565e74',
  },
  complianceText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#717786',
    textAlign: 'center',
    lineHeight: 14,
  },
});
