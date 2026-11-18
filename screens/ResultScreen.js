import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function ResultScreen({
  record,
  visible,
  onClose,
  onExportCSV,
}) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && record) {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
      barAnim.setValue(0);

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(barAnim, {
          toValue: 1,
          duration: 600,
          delay: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible, record, scaleAnim, opacityAnim, barAnim]);

  if (!record) return null;

  const nWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min((record.n / 200) * 100, 100)}%`],
  });
  const pWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min((record.p / 200) * 100, 100)}%`],
  });
  const kWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min((record.k / 200) * 100, 100)}%`],
  });
  const phWidth = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', `${Math.min((record.ph / 14) * 100, 100)}%`],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Dimmed Backdrop (Tap outside to close) */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.popupCard,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Stop clicks inside the card from closing the modal */}
          <Pressable>
            {/* Pop-up Green Header */}
            <View style={styles.resultHeader}>
              <View style={styles.headerTopRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="document-text-outline" size={18} color="#FFF" />
                  <Text style={styles.resultHeaderTitle}> Test Report</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeIconBtn}>
                  <Ionicons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultHeaderSub}>
                {record.name} • {record.date}
              </Text>
            </View>

            <ScrollView
              style={{ maxHeight: 460 }}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            >
              {/* NPK & pH 2x2 Grid with Animated Progress Bars */}
              <View style={styles.npkGrid}>
                <View style={styles.npkBox}>
                  <Text style={styles.npkLabel}>NITROGEN (N) • ISE</Text>
                  <Text style={[styles.npkValue, { color: '#2E7D32' }]}>
                    {record.n} <Text style={styles.unitText}>ppm</Text>
                  </Text>
                  <View style={styles.barTrack}>
                    <Animated.View
                      style={[
                        styles.barFill,
                        { width: nWidth, backgroundColor: '#2E7D32' },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.npkBox}>
                  <Text style={styles.npkLabel}>PHOSPHORUS (P) • OPTICAL</Text>
                  <Text style={[styles.npkValue, { color: '#E65100' }]}>
                    {record.p} <Text style={styles.unitText}>ppm</Text>
                  </Text>
                  <View style={styles.barTrack}>
                    <Animated.View
                      style={[
                        styles.barFill,
                        { width: pWidth, backgroundColor: '#FB8C00' },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.npkBox}>
                  <Text style={styles.npkLabel}>POTASSIUM (K) • ISE</Text>
                  <Text style={[styles.npkValue, { color: '#5D4037' }]}>
                    {record.k} <Text style={styles.unitText}>ppm</Text>
                  </Text>
                  <View style={styles.barTrack}>
                    <Animated.View
                      style={[
                        styles.barFill,
                        { width: kWidth, backgroundColor: '#6D4C41' },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.npkBox}>
                  <Text style={styles.npkLabel}>pH LEVEL • ISE</Text>
                  <Text style={[styles.npkValue, { color: '#1565C0' }]}>
                    {record.ph}
                  </Text>
                  <View style={styles.barTrack}>
                    <Animated.View
                      style={[
                        styles.barFill,
                        { width: phWidth, backgroundColor: '#1E88E5' },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* ERD Fertilizer & Sync Metadata Card */}
              <View style={styles.metaCard}>
                <Text style={styles.metaHeader}>FERTILIZER & SYNC METADATA</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Record ID:</Text>
                  <Text style={styles.metaVal}>#{record.id}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Fertilizer Type:</Text>
                  <Text style={styles.metaVal}>
                    {record.type || 'Organic Input'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Source / Producer:</Text>
                  <Text style={styles.metaVal}>
                    {record.source || 'Local Farm Batch (CDO)'}
                  </Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaKey}>Sync Status:</Text>
                  <Text style={[styles.metaVal, { color: COLORS.optimalText }]}>
                    {record.sync_status || 'Synced (Cloud PostgreSQL)'}
                  </Text>
                </View>
              </View>

              {/* Bottom Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.csvBtn}
                  onPress={() =>
                    onExportCSV([record], `SPADE_Report_${record.id}.csv`)
                  }
                >
                  <Text style={styles.csvBtnText}>⬇ Export CSV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 16, 10, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  popupCard: {
    width: '100%',
    backgroundColor: COLORS.creamBg,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    elevation: 10,
  },
  resultHeader: {
    backgroundColor: COLORS.primaryGreen,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeIconBtn: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
  },
  resultHeaderTitle: { color: '#FFF', fontSize: 19, fontWeight: 'bold' },
  resultHeaderSub: { color: '#E6F4EA', fontSize: 12, marginTop: 4 },
  npkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  npkBox: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  npkLabel: { fontSize: 9, color: COLORS.textMuted, fontWeight: 'bold' },
  npkValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  unitText: { fontSize: 11, fontWeight: 'normal', color: COLORS.textMuted },
  barTrack: {
    height: 4,
    backgroundColor: '#EFEBE9',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  barFill: { height: 4, borderRadius: 2 },
  metaCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: 2,
  },
  metaHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  metaKey: { fontSize: 11, color: COLORS.textMuted },
  metaVal: { fontSize: 11, fontWeight: '600', color: COLORS.textDark },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  csvBtn: {
    width: '48%',
    borderWidth: 1,
    borderColor: COLORS.darkBrown,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  csvBtnText: { color: COLORS.darkBrown, fontWeight: 'bold', fontSize: 13 },
  doneBtn: {
    width: '48%',
    backgroundColor: COLORS.darkBrown,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
});