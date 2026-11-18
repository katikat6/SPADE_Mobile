import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function SignupScreen({ navigation, onLogin }) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0
  );
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const [barangay, setBarangay] = useState('');
  const [userType, setUserType] = useState('Farmer');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSignUp = () => {
    if (password && confirmPass && password !== confirmPass) {
      Alert.alert('Password Mismatch', 'Please make sure your passwords match.');
      return;
    }
    if (onLogin) {
      onLogin({
        username: fullName.trim() || username.trim() || 'juswa',
        role: userType,
        location: barangay.trim() || 'Cagayan de Oro',
      });
    }
    Alert.alert('Account Created', 'Welcome to SPADE!');
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBrown} />
      <View style={[styles.topBar, { height: statusBarHeight + 8 }]} />
      <ScrollView contentContainerStyle={styles.authContent}>
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={26} color={COLORS.primaryGreen} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.logoTitle}>SPADE</Text>
            <Text style={styles.logoSub}>Cagayan de Oro</Text>
          </View>
        </View>

        <Text style={styles.welcomeTitle}>WELCOME, FARMER!</Text>
        <Text style={styles.welcomeSub}>
          Sign up to start testing your organic fertilizers
        </Text>

        <Text style={styles.inputLabel}>FULL NAME</Text>
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#9E8C80"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <Text style={styles.inputLabel}>USERNAME</Text>
        <View style={styles.inputBox}>
          <Ionicons name="at-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Create a username"
            placeholderTextColor="#9E8C80"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.inputLabel}>CONTACT NUMBER</Text>
        <View style={styles.inputBox}>
          <Ionicons name="call-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Enter your contact number"
            placeholderTextColor="#9E8C80"
            keyboardType="phone-pad"
            value={contact}
            onChangeText={setContact}
          />
        </View>

        <Text style={styles.inputLabel}>BARANGAY / LOCATION</Text>
        <View style={styles.inputBox}>
          <Ionicons name="location-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Enter your barangay or location"
            placeholderTextColor="#9E8C80"
            value={barangay}
            onChangeText={setBarangay}
          />
        </View>

        <Text style={styles.inputLabel}>USER TYPE (ROLE)</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() =>
            setUserType(userType === 'Farmer' ? 'Agricultural Technician' : 'Farmer')
          }
        >
          <Ionicons name="briefcase-outline" size={18} color={COLORS.textMuted} />
          <Text style={styles.input}>{userType}</Text>
          <Text style={{ fontSize: 10, color: COLORS.textMuted, marginRight: 4 }}>
            Tap to switch
          </Text>
          <Ionicons name="swap-horizontal-outline" size={16} color={COLORS.textMuted} />
        </TouchableOpacity>

        <Text style={styles.inputLabel}>PASSWORD</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#9E8C80"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#9E8C80"
            secureTextEntry={!showPass}
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
        </View>

        <TouchableOpacity style={styles.greenBtn} onPress={handleSignUp}>
          <Text style={styles.greenBtnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLinkText}>
            Already have an account?{' '}
            <Text style={styles.signUpHighlight}>LOG IN</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  topBar: { height: 28, backgroundColor: COLORS.darkBrown },
  authContent: { padding: 24, paddingBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  logoTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  logoSub: { fontSize: 10, color: COLORS.textMuted },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
  welcomeSub: { fontSize: 12, color: COLORS.textMuted, marginBottom: 14 },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginBottom: 5,
    marginTop: 10,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  input: { flex: 1, marginLeft: 8, color: COLORS.textDark, fontSize: 13 },
  greenBtn: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  greenBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  footerLinkText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  signUpHighlight: { color: COLORS.acidicText, fontWeight: 'bold' },
});