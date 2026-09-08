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

const customers = [
  {
    id: '1',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    orders: 8,
    due: 1200,
  },
  {
    id: '2',
    name: 'Priya Menon',
    mobile: '9845012345',
    orders: 14,
    due: 0,
  },
  {
    id: '3',
    name: 'Arun Kumar',
    mobile: '9900112233',
    orders: 3,
    due: 800,
  },
  {
    id: '4',
    name: 'Sunita Rao',
    mobile: '9712345678',
    orders: 22,
    due: 2500,
  },
  {
    id: '5',
    name: 'Vijay Nair',
    mobile: '9988776655',
    orders: 5,
    due: 0,
  },
];

const CustomersScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Customers</Text>
          <Text style={styles.customerCount}>{filteredCustomers.length} customers</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search name or mobile..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredCustomers.map((customer) => (
          <TouchableOpacity
            key={customer.id}
            style={styles.customerCard}
            onPress={() => navigation.navigate('CustomerDetail', {customerId: customer.id})}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerMobile}>{customer.mobile}</Text>
            </View>
            <View style={styles.customerStats}>
              <Text style={styles.orderCount}>{customer.orders} orders</Text>
              {customer.due > 0 ? (
                <Text style={styles.dueAmount}>₹{customer.due} due</Text>
              ) : (
                <Text style={styles.clearAmount}>Clear</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.surface,
  },
  customerCount: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: colors.surface,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
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
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  customerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 2,
  },
  customerMobile: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  customerStats: {
    alignItems: 'flex-end',
  },
  orderCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  dueAmount: {
    ...typography.bodySmall,
    color: colors.error,
    fontWeight: '600',
  },
  clearAmount: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
  },
  bottomNav: {
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

export default CustomersScreen;