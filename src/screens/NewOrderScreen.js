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
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

const NewOrderScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  // Step 1: Customer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Step 2: Garments
  const [garments, setGarments] = useState([]);
  const [currentGarment, setCurrentGarment] = useState({
    type: 'Shirt',
    quantity: '1',
    price: '',
  });

  // Step 3: Summary
  const [summary, setSummary] = useState({
    subtotal: 0,
    extraCharges: 0,
    discount: 0,
    total: 0,
  });

  const customers = [
    {id: '1', name: 'Rahul Sharma', mobile: '9876543210'},
    {id: '2', name: 'Priya Menon', mobile: '9845012345'},
    {id: '3', name: 'Arun Kumar', mobile: '9900112233'},
  ];

  const garmentTypes = ['Shirt', 'Pant', 'Kurta', 'Blouse', 'Suit', 'Other'];

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery)
  );

  const addGarment = () => {
    if (currentGarment.price && currentGarment.quantity) {
      setGarments([...garments, {
        ...currentGarment,
        amount: parseInt(currentGarment.price) * parseInt(currentGarment.quantity),
      }]);
      setCurrentGarment({type: 'Shirt', quantity: '1', price: ''});
    }
  };

  const nextStep = () => {
    if (step === 1 && selectedCustomer) {
      setStep(2);
    } else if (step === 2 && garments.length > 0) {
      const subtotal = garments.reduce((sum, g) => sum + g.amount, 0);
      const total = subtotal + summary.extraCharges - summary.discount;
      setSummary({...summary, subtotal, total});
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.stepTitle}>1. Customer</Text>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search customer name or mobile..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <TouchableOpacity style={styles.addCustomerButton}>
        <Text style={styles.addCustomerText}>+ Add New Customer</Text>
      </TouchableOpacity>
      <ScrollView style={styles.customerList}>
        {filteredCustomers.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            style={[
              styles.customerItem,
              selectedCustomer?.id === customer.id && styles.customerItemSelected,
            ]}
            onPress={() => setSelectedCustomer(customer)}>
            <View>
              <Text style={styles.customerItemName}>{customer.name}</Text>
              <Text style={styles.customerItemMobile}>{customer.mobile}</Text>
            </View>
            {selectedCustomer?.id === customer.id && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.stepTitle}>2. Garments</Text>
      <View style={styles.garmentForm}>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {garmentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  currentGarment.type === type && styles.typeButtonActive,
                ]}
                onPress={() => setCurrentGarment({...currentGarment, type})}>
                <Text style={[
                  styles.typeButtonText,
                  currentGarment.type === type && styles.typeButtonTextActive,
                ]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Quantity</Text>
          <TextInput
            style={styles.formInput}
            value={currentGarment.quantity}
            onChangeText={(text) => setCurrentGarment({...currentGarment, quantity: text})}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.formLabel}>Price</Text>
          <TextInput
            style={styles.formInput}
            value={currentGarment.price}
            onChangeText={(text) => setCurrentGarment({...currentGarment, price: text})}
            keyboardType="numeric"
            placeholder="Enter price"
            placeholderTextColor={colors.textLight}
          />
        </View>
        <TouchableOpacity style={styles.addGarmentButton} onPress={addGarment}>
          <Text style={styles.addGarmentText}>+ Add Garment</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.garmentList}>
        {garments.map((g, index) => (
          <View key={index} style={styles.garmentItem}>
            <View>
              <Text style={styles.garmentItemName}>{g.type} × {g.quantity}</Text>
              <Text style={styles.garmentItemPrice}>₹{g.amount}</Text>
            </View>
            <TouchableOpacity onPress={() => setGarments(garments.filter((_, i) => i !== index))}>
              <Text style={styles.removeGarment}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={styles.stepTitle}>3. Summary</Text>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryCustomer}>{selectedCustomer?.name}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{summary.subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Extra Charges</Text>
          <TextInput
            style={styles.summaryInput}
            value={String(summary.extraCharges)}
            onChangeText={(text) => setSummary({...summary, extraCharges: parseInt(text) || 0})}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <TextInput
            style={styles.summaryInput}
            value={String(summary.discount)}
            onChangeText={(text) => setSummary({...summary, discount: parseInt(text) || 0})}
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.summaryRow, styles.summaryTotal]}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>₹{summary.total}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.saveButton]}>
          <Text style={styles.saveButtonText}>Save Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.savePrintButton]}>
          <Text style={styles.savePrintButtonText}>Save & Print</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>New Order</Text>
          <Text style={styles.headerSubtitle}>TP-0042 · 2 Sep 2026</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.stepsIndicator}>
        {[1, 2, 3].map((s) => (
          <View key={s} style={styles.stepDotContainer}>
            <View style={[
              styles.stepDot,
              s === step && styles.stepDotActive,
              s < step && styles.stepDotCompleted,
            ]}>
              <Text style={[
                styles.stepDotText,
                s === step && styles.stepDotTextActive,
                s < step && styles.stepDotTextCompleted,
              ]}>{s}</Text>
            </View>
            {s < 3 && <View style={[
              styles.stepLine,
              s < step && styles.stepLineCompleted,
            ]} />}
          </View>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {step > 1 && (
          <TouchableOpacity style={[styles.navButton, styles.prevButton]} onPress={prevStep}>
            <Text style={styles.prevButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        {step < 3 && (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={nextStep}>
            <Text style={styles.nextButtonText}>
              {step === 1 ? 'Next →' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navNew]}>
          <View style={styles.navNewButton}>
            <Text style={styles.navNewIcon}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Customers')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Customers</Text>
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
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  stepDotCompleted: {
    backgroundColor: colors.success,
  },
  stepDotText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stepDotTextActive: {
    color: colors.surface,
  },
  stepDotTextCompleted: {
    color: colors.surface,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  stepLineCompleted: {
    backgroundColor: colors.success,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  stepTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  addCustomerButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  addCustomerText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  customerList: {
    marginTop: spacing.md,
    maxHeight: 300,
  },
  customerItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerItemSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EBF5FF',
  },
  customerItemName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  customerItemMobile: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkmark: {
    ...typography.h4,
    color: colors.primary,
  },
  garmentForm: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  formRow: {
    marginBottom: spacing.md,
  },
  formLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  typeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  typeButtonTextActive: {
    color: colors.surface,
  },
  formInput: {
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addGarmentButton: {
    backgroundColor: colors.success,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  addGarmentText: {
    ...typography.bodySmall,
    color: colors.surface,
    fontWeight: '600',
  },
  garmentList: {
    maxHeight: 200,
  },
  garmentItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  garmentItemName: {
    ...typography.body,
    color: colors.text,
  },
  garmentItemPrice: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  removeGarment: {
    ...typography.h4,
    color: colors.error,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  summaryCustomer: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  summaryInput: {
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    width: 80,
    textAlign: 'right',
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  summaryTotalValue: {
    ...typography.h4,
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  savePrintButton: {
    backgroundColor: colors.success,
  },
  savePrintButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  prevButton: {
    backgroundColor: colors.border,
  },
  prevButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  nextButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
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

export default NewOrderScreen;