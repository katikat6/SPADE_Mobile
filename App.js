import React, { useState } from 'react';
import { Alert, Share } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './theme';

// Import your screens from the screens/ folder
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainMenuScreen from './screens/MainMenuScreen';
import HistoryScreen from './screens/HistoryScreen';
import ResultScreen from './screens/ResultScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Initial Synchronized Fertilizer Test Records (Pure Sensor Data + ERD Metadata)
const INITIAL_RECORDS = [
  {
    id: 'TR-101',
    name: 'Vermicast Sample',
    type: 'Vermicompost',
    source: 'City Agriculture Office (CDO)',
    date: 'Dec 15, 2025 • 9:42 AM',
    ph: 6.8,
    n: 180,
    p: 140,
    k: 160,
    sync_status: 'Synced',
  },
  {
    id: 'TR-102',
    name: 'Compost (Batch 3)',
    type: 'Decomposed Plant Matter',
    source: 'Tablon Organic Farm',
    date: 'Nov 28, 2025 • 2:15 PM',
    ph: 4.1,
    n: 45,
    p: 80,
    k: 30,
    sync_status: 'Synced',
  },
  {
    id: 'TR-103',
    name: 'Animal Manure',
    type: 'Composted Poultry Manure',
    source: 'Bukidnon Partner Farm',
    date: 'Nov 18, 2025 • 10:15 AM',
    ph: 7.0,
    n: 165,
    p: 125,
    k: 150,
    sync_status: 'Synced',
  },
  {
    id: 'TR-104',
    name: 'Vermicast Sample',
    type: 'Vermicompost',
    source: 'Local Smallholder Batch',
    date: 'Nov 02, 2025 • 4:20 PM',
    ph: 4.5,
    n: 60,
    p: 75,
    k: 50,
    sync_status: 'Synced',
  },
];

// CSV Export Utility
const exportToCSV = async (recordsToExport, filename = 'SPADE_Test_Report.csv') => {
  try {
    const header =
      'Record ID,Fertilizer Name,Type,Source,Date,Nitrogen (ppm),Phosphorus (ppm),Potassium (ppm),pH Level,Sync Status\n';
    const rows = recordsToExport
      .map(
        (r) =>
          `${r.id},"${r.name}","${r.type || 'Organic'}","${r.source || 'CDO'}","${
            r.date
          }",${r.n},${r.p},${r.k},${r.ph},${r.sync_status || 'Synced'}`
      )
      .join('\n');

    await Share.share({
      title: filename,
      message: header + rows,
    });
  } catch (error) {
    Alert.alert('Export Error', 'Could not export CSV file.');
  }
};

function MainTabs({
  user,
  records,
  onDeleteRecord,
  onClearAll,
  lastSynced,
  onManualSync,
  onSelectRecord,
}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.darkBrown,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#A89488',
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      >
        {(props) => (
          <MainMenuScreen
            {...props}
            user={user}
            records={records}
            isSynced={true}
            lastSynced={lastSynced}
            onManualSync={onManualSync}
            onSelectRecord={onSelectRecord}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="History"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="time-outline" size={20} color={color} />
          ),
        }}
      >
        {(props) => (
          <HistoryScreen
            {...props}
            records={records}
            onDeleteRecord={onDeleteRecord}
            onExportCSV={exportToCSV}
            onSelectRecord={onSelectRecord}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={20} color={color} />
          ),
        }}
      >
        {(props) => (
          <SettingsScreen
            {...props}
            user={user}
            recordsCount={records.length}
            onClearAll={onClearAll}
            lastSynced={lastSynced}
            onManualSync={onManualSync}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState({
    username: 'juswa',
    role: 'Farmer / Technician',
  });
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [lastSynced, setLastSynced] = useState('Today, 7:53 PM');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleDeleteRecord = (id) => {
    setRecords((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setRecords([]);
  };

  const handleManualSync = () => {
    setRecords(INITIAL_RECORDS);
    setLastSynced('Just now');
    Alert.alert(
      'Device Synced',
      'Encrypted JSON payload retrieved from SPADE Cloud REST API.'
    );
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {(props) => <SignupScreen {...props} onLogin={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="MainTabs">
            {(props) => (
              <MainTabs
                {...props}
                user={user}
                records={records}
                onDeleteRecord={handleDeleteRecord}
                onClearAll={handleClearAll}
                lastSynced={lastSynced}
                onManualSync={handleManualSync}
                onSelectRecord={setSelectedRecord}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>

        <ResultScreen
          record={selectedRecord}
          visible={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onExportCSV={exportToCSV}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}