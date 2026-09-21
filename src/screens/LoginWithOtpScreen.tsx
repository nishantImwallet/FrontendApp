import { StyleSheet, Text, View,KeyboardAvoidingView,ScrollView,SafeAreaView,StatusBar, TouchableOpacity,TextInput } from 'react-native';
import { Platform } from 'react-native';
import React from 'react'

export default function LoginWithOtpScreen() {
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
          {/* 1. TOP STATUS & NAVIGATION BAR */}

          <View style={styles.topbar}>
            {/*  these are the three part of the navigation items here */}
             {/* this is the back button here */}
            <TouchableOpacity style={styles.backButton}>
                 <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>


            {/* this is the middle brand button here */}
            <View style={styles.brandCenter}>
                <View style={styles.brandIconBox}>
                    <Text style={styles.brandPlaneIcon}>✈️</Text>
                </View>
                <Text style={styles.brandName}>FlyGo</Text>

            </View>
             {/*  this is the third button here */}        
                    <TouchableOpacity style={styles.helpBtn}>
                        <Text style={styles.helpQuestionIcon}>
                         ❓
                        </Text>
                        <Text style={styles.helpText}>
                            Help
                        </Text>            
                    </TouchableOpacity>
            </View>

             <View style={styles.introSection}>
            <View style={styles.securityPill}>
              <Text style={styles.securityCheckIcon}>🛡️</Text>
              <Text style={styles.securityPillText}>Aviation Grade Security</Text>
            </View>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.subheading}>Enter your mobile number to continue securely.</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.inputLabel}>Mobile number</Text>

                <View style={styles.phoneInputContainer}>
              {/* Country Code Trigger */}
              <TouchableOpacity style={styles.countryPicker}>
                <Text style={styles.flagIcon}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
                <Text style={styles.dropdownArrow}>⌄</Text>
              </TouchableOpacity>
              {/* Vertical Divider */}
              <View style={styles.verticalDivider} />
              {/* Phone Input */}
              <TextInput
                style={styles.phoneTextInput}
                placeholder="98765 43210"
                placeholderTextColor="#c1c6d7"
                keyboardType="phone-pad"
                maxLength={10}
                // value={phoneNumber}
                // onChangeText={setPhoneNumber}
              />
              <Text style={styles.phoneRightIcon}>📞</Text>
            </View>
          </View>


         
   
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  
  )
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
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  topbar:{
    marginTop:30,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'

  },
  backButtonText:{



  },
  backButton:{
     width: 42,
    height: 42,
    borderRadius: 21,
    // backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: '#121c2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
   backArrow:{
     fontSize: 26,
    color: '#121c2a',
    lineHeight: 28,
   },
  brandCenter:{
      flexDirection: 'row',
      alignItems: 'center',
     gap: 6,
  },
  brandPlaneIcon:{
       fontSize: 14,

  },
  brandIconBox:{
       width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#0059bb',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  brandName:{
     fontSize: 18,
    fontWeight: '800',
    color: '#0059bb',
    letterSpacing: -0.3,

  },
  helpBtn:{
     flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#eff4ff',
  },
  helpQuestionIcon:{
        fontSize: 13,

  },
  helpText:{
     fontSize: 12,
    fontWeight: '600',
    color: '#565e74',

  },
  introSection:{
      marginTop: 16,
    marginBottom: 20,

  },
  securityPill:{
      alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff4ff',
    borderWidth: 1,
    borderColor: 'rgba(193, 198, 215, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 12,
  },
  securityCheckIcon:{
    fontSize: 12,
  },
  securityPillText:{
    fontSize: 11,
    fontWeight: '700',
    color: '#0059bb',
    letterSpacing: 0.3,

  }, 
  heading:{

    fontSize:26,
    fontWeight:400,
    color: '#0059bb',
     letterSpacing: 0.3,


  },
  subheading:{
     fontSize: 26,
    fontWeight: '800',
    color: '#121c2a',
    letterSpacing: -0.5,

  },
  card:{
     backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e6eeff',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  inputLabel:{
      fontSize: 13,
    fontWeight: '700',
    color: '#121c2a',
    marginBottom: 8,
  },
  phoneInputContainer:{
      height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c1c6d7',
    borderRadius: 14,
    paddingHorizontal: 12,

  },
  countryPicker:{
     flexDirection: 'row',
     alignItems: 'center',
     gap: 4,
  },
  flagIcon:{
      fontSize: 16,
  },
  countryCode:{
      fontSize: 15,
    fontWeight: '700',
    color: '#121c2a',

  },
  dropdownArrow:{
     fontSize: 14,
    color: '#565e74',

  },
  verticalDivider:{
    width: 1,
    height: 24,
    backgroundColor: '#c1c6d7',
    marginHorizontal: 10,
  },
  phoneTextInput:{
    flex: 1,
    fontSize: 16,
    color: '#121c2a',
    fontWeight: '600',
    letterSpacing: 0.5,
    height: '100%',
  },
  phoneRightIcon:{
      fontSize: 16,
  }
})