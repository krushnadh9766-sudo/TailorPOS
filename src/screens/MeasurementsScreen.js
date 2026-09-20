import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import BottomNavigation from '../components/BottomNavigation';
import {measurementApi} from '../services/api/measurementApi';
import {customerApi} from '../services/api/customerApi';

const MeasurementsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const {customerId} = route.params;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeGarment, setActiveGarment] = useState('Shirt');
  const [measurements, setMeasurements] = useState({
    chest: '',
    waist: '',
    shoulder: '',
    sleeve: '',
    length: '',
    neck: '',
    hip: '',
    thigh: '',
    bottom: '',
    inseam: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const custRes = await customerApi.getCustomer(customerId);
        if (custRes.success) {
          setCustomer(custRes.data);
        }
        const measRes = await measurementApi.getMeasurement(customerId, activeGarment);
        if (measRes.success && measRes.data) {
          setMeasurements({
            chest: measRes.data.chest ? String(measRes.data.chest) : '',
            waist: measRes.data.waist ? String(measRes.data.waist) : '',
            shoulder: measRes.data.shoulder ? String(measRes.data.shoulder) : '',
            sleeve: measRes.data.sleeve ? String(measRes.data.sleeve) : '',
            length: measRes.data.length ? String(measRes.data.length) : '',
            neck: measRes.data.neck ? String(measRes.data.neck) : '',
            hip: measRes.data.hip ? String(measRes.data.hip) : '',
            thigh: measRes.data.thigh ? String(measRes.data.thigh) : '',
            bottom: measRes.data.bottom ? String(measRes.data.bottom) : '',
            inseam: measRes.data.inseam ? String(measRes.data.inseam) : '',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (isFocused && customerId) {
      fetchData();
    }
  }, [customerId, isFocused, activeGarment]);

  const garmentTypes = ['Shirt', 'Pant', 'Kurta', 'Blouse', 'Suit', 'Other'];

  const measurementFields = [
    {key: 'chest', label: 'CHEST (IN)'},
    {key: 'waist', label: 'WAIST (IN)'},
    {key: 'shoulder', label: 'SHOULDER (IN)'},
    {key: 'sleeve', label: 'SLEEVE (IN)'},
    {key: 'length', label: 'LENGTH (IN)'},
    {key: 'neck', label: 'NECK (IN)'},
    {key: 'hip', label: 'HIP (IN)'},
    {key: 'thigh', label: 'THIGH (IN)'},
    {key: 'bottom', label: 'BOTTOM (IN)'},
    {key: 'inseam', label: 'INSEAM (IN)'},
  ];

  const updateMeasurement = (key, value) => {
    setMeasurements({...measurements, [key]: value});
  };

  const handleReset = () => {
    setMeasurements({
      chest: '',
      waist: '',
      shoulder: '',
      sleeve: '',
      length: '',
      neck: '',
      hip: '',
      thigh: '',
      bottom: '',
      inseam: '',
    });
  };

  const handleSave = async () => {
    try {
      const data = {
        garment_type: activeGarment,
        chest: parseFloat(measurements.chest) || 0,
        waist: parseFloat(measurements.waist) || 0,
        shoulder: parseFloat(measurements.shoulder) || 0,
        sleeve: parseFloat(measurements.sleeve) || 0,
        length: parseFloat(measurements.length) || 0,
        neck: parseFloat(measurements.neck) || 0,
        hip: parseFloat(measurements.hip) || 0,
        thigh: parseFloat(measurements.thigh) || 0,
        bottom: parseFloat(measurements.bottom) || 0,
        inseam: parseFloat(measurements.inseam) || 0,
      };
      const res = await measurementApi.saveMeasurement(customerId, data);
      if (res.success) {
        Alert.alert('Success', 'Measurements saved successfully', [
          {text: 'OK', onPress: () => navigation.goBack()}
        ]);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save measurements');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />
      </SafeAreaView>
    );
  }

  if (!customer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{textAlign: 'center', marginTop: 50}}>Customer not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Measurements</Text>
          <Text style={styles.headerSubtitle}>{customer.name}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.garmentTabs}
        contentContainerStyle={styles.garmentTabsContent}>
        {garmentTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.garmentTab, activeGarment === type && styles.garmentTabActive]}
            onPress={() => setActiveGarment(type)}>
            <Text
              style={[
                styles.garmentTabText,
                activeGarment === type && styles.garmentTabTextActive,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {measurementFields.map((field) => (
          <View key={field.key} style={styles.measurementRow}>
            <Text style={styles.measurementLabel}>{field.label}</Text>
            <View style={styles.measurementInputs}>
              <TextInput
                style={styles.measurementInput}
                value={String(measurements[field.key])}
                onChangeText={(text) => updateMeasurement(field.key, text)}
                keyboardType="numeric"
                maxLength={5}
              />
              <Text style={styles.measurementRange}>
                {parseInt(measurements[field.key]) ? parseInt(measurements[field.key]) - 5 : 0} in{' '}
                {parseInt(measurements[field.key]) ? parseInt(measurements[field.key]) + 5 : 0} in
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Measurements</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize: 32,
    color: colors.surface,
    fontWeight: '300',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.surface,
  },
  headerSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  headerRight: {
    width: 40,
  },
  garmentTabs: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexGrow: 0,
  },
  garmentTabsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  garmentTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  garmentTabActive: {
    backgroundColor: colors.primary,
  },
  garmentTabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  garmentTabTextActive: {
    color: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  measurementRow: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  measurementLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  measurementInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  measurementInput: {
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    width: 50,
    textAlign: 'center',
    marginRight: spacing.sm,
  },
  measurementRange: {
    ...typography.caption,
    color: colors.textLight,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.border,
  },
  resetButtonText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flex: 2,
  },
  saveButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default MeasurementsScreen;