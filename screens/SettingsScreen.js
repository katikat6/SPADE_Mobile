import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function SettingsScreen({
  navigation,
  user,
  recordsCount,
  onClearAll,
  lastSynced,
  onManualSync,
}) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0
  );
  const [autoSync, setAutoSync] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBrown} />
      <View style={[styles.simpleHeader, { paddingTop: statusBarHeight + 12 }]}>
        <Text style={styles.simpleHeaderTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.settingsGroupLabel}>SYNC STATUS</Text>
        <TouchableOpacity style={styles.settingsCard} onPress={onManualSync}>
          <View style={styles.settingsRow}>
            <View style={styles.recordLeft}>
              <Ionicons
                name="cloud-done-outline"
                size={22}
                color={COLORS.darkBrown}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.recordName}>Device Sync</Text>
                <Text style={styles.recordDate}>Connected to SPADE device</Text>
              </View>
            </View>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: COLORS.optimalBg },
              ]}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: COLORS.optimalText,
                }}
              >
                ✓ Synced
              </Text>
            </View>
          </View>
          <Text style={[styles.recordDate, { marginTop: 8 }]}>
            Last Synced: {lastSynced} (Tap to sync now)
          </Text>
        </TouchableOpacity>

        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.recordLeft}>
              <Ionicons name="sync-outline" size={20} color={COLORS.darkBrown} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.recordName}>Automatic Background Sync</Text>
                <Text style={styles.recordDate}>
                  Auto-upload when Wi-Fi is detected
                </Text>
              </View>
            </View>
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: '#D7C4B2', true: '#A5D6A7' }}
              thumbColor={autoSync ? COLORS.primaryGreen : '#F4F3F4'}
            />
          </View>
        </View>

        <Text style={styles.settingsGroupLabel}>DATA MANAGEMENT</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsRow}>
            <View style={styles.recordLeft}>
              <Ionicons name="folder-outline" size={20} color={COLORS.darkBrown} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.recordName}>Local Records</Text>
                <Text style={styles.recordDate}>
                  {recordsCount} tests saved on device
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsCard}
          onPress={() =>
            Alert.alert(
              'Clear All Data',
              'Remove all cached test records from this mobile device?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear All', style: 'destructive', onPress: onClearAll },
              ]
            )
          }
        >
          <View style={styles.settingsRow}>
            <View style={styles.recordLeft}>
              <Ionicons name="trash-outline" size={20} color={COLORS.acidicText} />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.recordName, { color: COLORS.acidicText }]}>
                  Clear All Data
                </Text>
                <Text style={styles.recordDate}>Remove all local records</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        <Text style={styles.settingsGroupLabel}>APP INFO</Text>
        <View style={styles.settingsCard}>
          <View style={styles.recordLeft}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={COLORS.darkBrown}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.recordName}>SPADE v1.0.0</Text>
              <Text style={styles.recordDate}>
                Developed at USTP • Cagayan de Oro
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsCard}
          onPress={() =>
            Alert.alert(
              'SPADE Field Testing Guide',
              '1. Dilute organic fertilizer sample (1:10 ratio).\n2. Calibrate ISE & TCS3200 sensors on the Raspberry Pi unit.\n3. Run NPK & pH analysis on the touchscreen.\n4. Connect to Wi-Fi to synchronize records to this dashboard.'
            )
          }
        >
          <View style={styles.settingsRow}>
            <View style={styles.recordLeft}>
              <Ionicons name="book-outline" size={20} color={COLORS.darkBrown} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.recordName}>Help & Guide</Text>
                <Text style={styles.recordDate}>How to use the device</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </View>
        </TouchableOpacity>

        <Text style={styles.settingsGroupLabel}>ACCOUNT</Text>
        <TouchableOpacity
          style={styles.settingsCard}
          onPress={() =>
            Alert.alert('Log Out', 'Return to the login screen?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => navigation.replace('Login'),
              },
            ])
          }
        >
          <View style={styles.settingsRow}>
            <View style={styles.recordLeft}>
              <Ionicons
                name="person-circle-outline"
                size={26}
                color={COLORS.darkBrown}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.recordName}>
                  {user?.username || 'David Sturdevant'}
                </Text>
                <Text style={styles.recordDate}>
                  {user?.role || 'Farmer / Technician'} • CDO (Tap to Log Out)
                </Text>
              </View>
            </View>
            <Ionicons
              name="log-out-outline"
              size={20}
              color={COLORS.acidicText}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  simpleHeader: {
    backgroundColor: COLORS.darkBrown,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  simpleHeaderTitle: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  settingsGroupLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginTop: 12,
    marginBottom: 6,
  },
  settingsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center' },
  recordName: { fontWeight: 'bold', color: COLORS.textDark, fontSize: 13 },
  recordDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
});