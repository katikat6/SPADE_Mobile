import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function MainMenuScreen({
  navigation,
  records,
  user,
  isSynced,
  lastSynced,
  onManualSync,
  onSelectRecord,
}) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0
  );
  const [refreshing, setRefreshing] = useState(false);

  // Subtle entrance animation for dashboard content
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      if (onManualSync) onManualSync();
      setRefreshing(false);
    }, 800);
  };

  const uniqueTypes = new Set(records.map((r) => r.type || r.name)).size;
  const avgPh =
    records.length > 0
      ? (
          records.reduce((sum, r) => sum + Number(r.ph || 0), 0) /
          records.length
        ).toFixed(1)
      : '0.0';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBrown} />
      {/* Dark Brown Header */}
      <View style={[styles.headerBanner, { paddingTop: statusBarHeight + 12 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.logoRowSmall}>
            <Ionicons name="leaf" size={20} color="#4CAF50" />
            <Text style={styles.headerBrand}> SPADE</Text>
          </View>
          <Text style={styles.roleTag}>{user?.role || 'Farmer / Technician'}</Text>
        </View>

        <Text style={styles.greetingSub}>
          Good morning, {user?.username || 'juswa'}!
        </Text>
        <Text style={styles.greetingTitle}>What do you need today?</Text>

        <TouchableOpacity style={styles.syncBadge} onPress={onManualSync}>
          <Ionicons
            name={isSynced ? 'checkmark-circle-outline' : 'sync-outline'}
            size={14}
            color="#A5D6A7"
          />
          <Text style={styles.syncBadgeText}>
            {' '}
            {isSynced
              ? `Device Synced • ${lastSynced}`
              : 'Offline Mode • Tap to Sync'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Quick Summary KPI Pills */}
          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiNumber}>{records.length}</Text>
              <Text style={styles.kpiLabel}>Total Synced</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={[styles.kpiNumber, { color: COLORS.primaryGreen }]}>
                {uniqueTypes}
              </Text>
              <Text style={styles.kpiLabel}>Sample Types</Text>
            </View>
            <View style={styles.kpiBox}>
              <Text style={[styles.kpiNumber, { color: COLORS.darkBrown }]}>
                {avgPh}
              </Text>
              <Text style={styles.kpiLabel}>Avg pH Level</Text>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>New Synced Records</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.viewAllLink}>View All →</Text>
            </TouchableOpacity>
          </View>

          {/* Synced Fertilizer Records Card */}
          <View style={styles.recordsCard}>
            {records.length === 0 ? (
              <Text style={styles.emptyText}>
                No test records synced yet. Pull down or tap Device Sync to fetch
                cloud data.
              </Text>
            ) : (
              records.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.recordRow,
                    index === Math.min(records.length, 5) - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() => onSelectRecord(item)}
                >
                  <View style={styles.recordLeft}>
                    <View style={styles.dotIndicator} />
                    <View>
                      <Text style={styles.recordName}>{item.name}</Text>
                      <Text style={styles.recordDate}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={styles.phPill}>
                      <Text style={styles.phPillText}>pH {item.ph}</Text>
                    </View>
                    <Text style={styles.npkText}>
                      N:{item.n} P:{item.p} K:{item.k}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Bottom Navigation Quick Cards */}
          <View style={styles.quickCardsRow}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('History')}
            >
              <Ionicons name="time-outline" size={26} color={COLORS.darkBrown} />
              <Text style={styles.quickCardTitle}>History</Text>
              <Text style={styles.quickCardSub}>View past test records</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons
                name="options-outline"
                size={26}
                color={COLORS.darkBrown}
              />
              <Text style={styles.quickCardTitle}>Settings</Text>
              <Text style={styles.quickCardSub}>Sync & device options</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  headerBanner: {
    backgroundColor: COLORS.darkBrown,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoRowSmall: { flexDirection: 'row', alignItems: 'center' },
  headerBrand: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  roleTag: {
    color: '#D7C4B2',
    fontSize: 10,
    backgroundColor: '#523628',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  greetingSub: { color: '#D7C4B2', fontSize: 12, marginTop: 10 },
  greetingTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#523628',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 6,
  },
  syncBadgeText: { color: '#E6F4EA', fontSize: 11 },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  kpiBox: {
    width: '31%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  kpiNumber: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark },
  kpiLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textDark },
  viewAllLink: { fontSize: 12, color: COLORS.primaryGreen, fontWeight: 'bold' },
  recordsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#E5D5C5',
  },
  recordLeft: { flexDirection: 'row', alignItems: 'center' },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: COLORS.primaryGreen,
  },
  recordName: { fontWeight: 'bold', color: COLORS.textDark, fontSize: 13 },
  recordDate: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  phPill: {
    backgroundColor: COLORS.optimalBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  phPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.optimalText,
  },
  npkText: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    paddingVertical: 20,
    fontSize: 12,
  },
  quickCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  quickCard: {
    width: '48%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickCardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.textDark,
    marginTop: 10,
  },
  quickCardSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
});