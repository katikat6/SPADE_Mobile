import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function LoginScreen({ navigation, onLogin }) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLoginPress = () => {
    const cleanName = username.trim() || 'juswa';
    if (onLogin) {
      onLogin({
        username: cleanName,
        role: 'Farmer / Technician',
        device_type: 'Mobile (React Native)',
      });
    }
    navigation.replace('MainTabs');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBrown} />
      <View style={[styles.topBar, { height: statusBarHeight + 8 }]} />

      <ScrollView contentContainerStyle={styles.authContent}>
        <View style={styles.logoRow}>
          <Ionicons name="leaf" size={28} color={COLORS.primaryGreen} />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.logoTitle}>SPADE</Text>
            <Text style={styles.logoSub}>Cagayan de Oro</Text>
          </View>
        </View>

        <Text style={styles.welcomeTitle}>WELCOME, FARMER!</Text>
        <Text style={styles.welcomeSub}>
          Log in to view your organic fertilizer test records
        </Text>

        <Text style={styles.inputLabel}>USERNAME</Text>
        <View style={styles.inputBox}>
          <Ionicons name="person-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#9E8C80"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.inputLabel}>PASSWORD</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
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

        <TouchableOpacity style={styles.greenBtn} onPress={handleLoginPress}>
          <Text style={styles.greenBtnText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.footerLinkText}>
            Don't have an account?{' '}
            <Text style={styles.signUpHighlight}>SIGN UP</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  topBar: { height: 32, backgroundColor: COLORS.darkBrown },
  authContent: { padding: 24 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  logoTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  logoSub: { fontSize: 10, color: COLORS.textMuted },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.textDark },
  welcomeSub: { fontSize: 12, color: COLORS.textMuted, marginBottom: 22 },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginBottom: 6,
    marginTop: 12,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  input: { flex: 1, marginLeft: 8, color: COLORS.textDark, fontSize: 13 },
  greenBtn: {
    backgroundColor: COLORS.primaryGreen,
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  greenBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  footerLinkText: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  signUpHighlight: { color: COLORS.acidicText, fontWeight: 'bold' },
});