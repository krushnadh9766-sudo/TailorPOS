import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

const MeasurementsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {customerId} = route.params;

  const [activeGarment, setActiveGarment] = useState('Shirt');
  const [measurements, setMeasurements] = useState({
    chest: '35',
    waist: '41',
    shoulder: '39',
    sleeve: '40',
    length: '38',
    neck: '43',
    hip: '38',
    thigh: '42',
    bottom: '36',
    inseam: '35',
  });

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
      chest: '35',
      waist: '41',
      shoulder: '39',
      sleeve: '40',
      length: '38',
      neck: '43',
      hip: '38',
      thigh: '42',
      bottom: '36',
      inseam: '35',
    });
  };

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Measurements</Text>
          <Text style={styles.headerSubtitle}>Rahul Sharma</Text>
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
                value={measurements[field.key]}
                onChangeText={(text) => updateMeasurement(field.key, text)}
                keyboardType="numeric"
                maxLength={5}
              />
              <Text style={styles.measurementRange}>
                {parseInt(measurements[field.key]) - 5} in{' '}
                {parseInt(measurements[field.key]) + 5} in
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

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navNew]} onPress={() => navigation.navigate('NewOrder')}>
          <View style={styles.navNewButton}>
            <Text style={styles.navNewIcon}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Customers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>✨</Text>
          <Text style={styles.navLabel}>AI</Text>
        </TouchableOpacity>
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
    paddingBottom: 100,
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
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  navIcon: {
    fontSize: 22,
  },
  navLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    fontSize: 10,
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  navNew: {
    marginTop: -20,
  },
  navNewButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  navNewIcon: {
    fontSize: 32,
    color: colors.surface,
    fontWeight: '300',
  },
});

export default MeasurementsScreen;