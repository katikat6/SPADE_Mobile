import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function HistoryScreen({
  records,
  onDeleteRecord,
  onExportCSV,
  onSelectRecord,
}) {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0
  );
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const filteredRecords = records.filter((item) => {
    const matchesTab =
      filter === 'All' ||
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      (item.type && item.type.toLowerCase().includes(filter.toLowerCase()));
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.source &&
        item.source.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBrown} />
      <View style={[styles.simpleHeader, { paddingTop: statusBarHeight + 12 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="time-outline" size={20} color="#FFF" />
          <Text style={styles.simpleHeaderTitle}> Test History</Text>
        </View>

        <TouchableOpacity
          style={styles.chartToggleBtn}
          onPress={() => setShowChart(!showChart)}
        >
          <Ionicons name="bar-chart-outline" size={14} color="#FFF" />
          <Text style={styles.chartToggleText}>
            {showChart ? ' Hide Chart' : ' NPK Trends'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16, flex: 1 }}>
        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fertilizer name or source..."
            placeholderTextColor="#9E8C80"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Fertilizer Category Filter Pills & Edit Button Row */}
        <View style={styles.filterBar}>
          <View style={{ flexDirection: 'row' }}>
            {['All', 'Vermicast', 'Compost', 'Manure'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.filterPill,
                  filter === tab && styles.filterPillActive,
                ]}
                onPress={() => setFilter(tab)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filter === tab && styles.filterPillTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.editBtn,
              editMode && { backgroundColor: COLORS.acidicBg, borderColor: '#EF9A9A' },
            ]}
            onPress={() => setEditMode(!editMode)}
          >
            <Ionicons
              name={editMode ? 'checkmark-outline' : 'create-outline'}
              size={14}
              color={editMode ? COLORS.acidicText : COLORS.darkBrown}
            />
            <Text
              style={[
                styles.editBtnText,
                editMode && { color: COLORS.acidicText },
              ]}
            >
              {editMode ? ' Done' : ' Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Collapsible NPK Nutrient Trend Chart */}
          {showChart && filteredRecords.length > 0 && (
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>
                NPK Nutrient Comparison (ppm)
              </Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2E7D32' }]} />
                  <Text style={styles.legendLabel}>Nitrogen (N)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#FB8C00' }]} />
                  <Text style={styles.legendLabel}>Phosphorus (P)</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#6D4C41' }]} />
                  <Text style={styles.legendLabel}>Potassium (K)</Text>
                </View>
              </View>

              {filteredRecords.slice(0, 4).map((rec) => (
                <View key={rec.id} style={styles.chartRow}>
                  <Text style={styles.chartSampleName} numberOfLines={1}>
                    {rec.name} ({rec.date.split('•')[0].trim()})
                  </Text>
                  <View style={styles.multiBarContainer}>
                    <View
                      style={[
                        styles.miniBar,
                        {
                          width: `${Math.min((rec.n / 220) * 100, 100)}%`,
                          backgroundColor: '#2E7D32',
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniBar,
                        {
                          width: `${Math.min((rec.p / 220) * 100, 100)}%`,
                          backgroundColor: '#FB8C00',
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.miniBar,
                        {
                          width: `${Math.min((rec.k / 220) * 100, 100)}%`,
                          backgroundColor: '#6D4C41',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Synced Test History Cards */}
          {filteredRecords.length === 0 ? (
            <Text style={styles.emptyText}>No matching fertilizer records found.</Text>
          ) : (
            filteredRecords.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyCard}
                onPress={() => onSelectRecord(item)}
              >
                <View style={styles.recordLeft}>
                  <View style={styles.dotIndicator} />
                  <View>
                    <Text style={styles.recordName}>{item.name}</Text>
                    <Text style={styles.recordDate}>{item.date}</Text>
                    <Text style={styles.npkMiniSummary}>
                      N: {item.n} • P: {item.p} • K: {item.k} ppm
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      marginRight: editMode ? 12 : 0,
                    }}
                  >
                    <View style={styles.phPill}>
                      <Text style={styles.phPillText}>pH {item.ph}</Text>
                    </View>
                    <Text style={styles.typeSubText}>
                      {item.type || 'Organic'}
                    </Text>
                  </View>

                  {editMode && (
                    <TouchableOpacity
                      style={styles.deleteIconBtn}
                      onPress={() =>
                        Alert.alert(
                          'Delete Test Record',
                          `Remove "${item.name}" from synchronized records?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => onDeleteRecord(item.id),
                            },
                          ]
                        )
                      }
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.acidicText}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}

          {filteredRecords.length > 0 && (
            <TouchableOpacity
              style={styles.exportAllBtn}
              onPress={() =>
                onExportCSV(filteredRecords, 'SPADE_All_Test_Records.csv')
              }
            >
              <Ionicons
                name="download-outline"
                size={16}
                color={COLORS.primaryGreen}
              />
              <Text style={styles.exportAllText}> Export all to CSV</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.creamBg },
  simpleHeader: {
    backgroundColor: COLORS.darkBrown,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simpleHeaderTitle: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  chartToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#523628',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  chartToggleText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 12, color: COLORS.textDark },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: COLORS.darkBrown,
    borderColor: COLORS.darkBrown,
  },
  filterPillText: { fontSize: 11, color: COLORS.textDark, fontWeight: '600' },
  filterPillTextActive: { color: '#FFF' },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  editBtnText: { fontSize: 11, fontWeight: 'bold', color: COLORS.darkBrown },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  legendLabel: { fontSize: 10, color: COLORS.textMuted },
  chartRow: { marginBottom: 8 },
  chartSampleName: { fontSize: 11, color: COLORS.textDark, marginBottom: 3 },
  multiBarContainer: {
    backgroundColor: '#F5F0EB',
    borderRadius: 4,
    padding: 3,
  },
  miniBar: { height: 5, borderRadius: 2, marginVertical: 1 },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
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
  npkMiniSummary: {
    color: COLORS.primaryGreen,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
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
  typeSubText: { fontSize: 10, color: COLORS.textMuted, marginTop: 4 },
  deleteIconBtn: { padding: 4 },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    marginTop: 24,
    fontSize: 12,
  },
  exportAllBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  exportAllText: {
    color: COLORS.primaryGreen,
    fontWeight: 'bold',
    fontSize: 13,
  },
});