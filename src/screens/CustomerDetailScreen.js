import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import BottomNavigation from '../components/BottomNavigation';
import {AppContext} from '../data/AppContext';
import {formatCurrency} from '../data/mockData';

const CustomerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {customerId} = route.params;
  const {customers, orders} = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('orders');

  const customer = customers.find(c => c.id === customerId);

  if (!customer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Customer not found</Text>
      </SafeAreaView>
    );
  }

  const customerOrders = orders.filter(o => o.customer === customer.name);

  const measurements = customer.measurements || {
    chest: '39"',
    waist: '38"',
    shoulder: '39"',
    sleeve: '40"',
    length: '39"',
    neck: '34"',
    hip: '40"',
    thigh: '42"',
    bottom: '40"',
    inseam: '38"',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return colors.warning;
      case 'In Progress':
        return colors.info;
      case 'Ready':
        return colors.success;
      case 'Delivered':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const renderOrderItems = (items) => {
    if (typeof items === 'string') return items;
    if (Array.isArray(items)) {
      return items.map(i => `${i.type || i.name} × ${i.quantity}`).join(', ');
    }
    return '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{customer.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.profileCard}>
        <Text style={styles.customerName}>{customer.name}</Text>
        <Text style={styles.customerMobile}>{customer.mobile}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{customer.orders}</Text>
            <Text style={styles.statLabel}>ORDERS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, customer.due > 0 && styles.pendingValue]}>
              {formatCurrency(customer.due || 0)}
            </Text>
            <Text style={styles.statLabel}>PENDING</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
          onPress={() => setActiveTab('orders')}>
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'measurements' && styles.tabActive]}
          onPress={() => setActiveTab('measurements')}>
          <Text style={[styles.tabText, activeTab === 'measurements' && styles.tabTextActive]}>
            Measurements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payments' && styles.tabActive]}
          onPress={() => setActiveTab('payments')}>
          <Text style={[styles.tabText, activeTab === 'payments' && styles.tabTextActive]}>
            Payments
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'orders' && (
          <>
            {customerOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetail', {orderId: order.id})}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.id || order.orderNumber}</Text>
                  <Text style={[styles.orderStatus, {color: getStatusColor(order.status)}]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.orderItems}>{renderOrderItems(order.items)}</Text>
                <Text style={styles.orderDate}>{order.orderDate || order.date}</Text>
                <Text style={styles.orderAmount}>{formatCurrency(order.total || order.amount)}</Text>
              </TouchableOpacity>
            ))}
            {customerOrders.length === 0 && (
              <Text style={{textAlign: 'center', marginTop: 20}}>No orders found.</Text>
            )}
          </>
        )}

        {activeTab === 'measurements' && (
          <View style={styles.measurementsGrid}>
            {Object.entries(measurements).map(([key, value]) => (
              <View key={key} style={styles.measurementItem}>
                <Text style={styles.measurementLabel}>{key.toUpperCase()}</Text>
                <Text style={styles.measurementValue}>{value}</Text>
              </View>
            ))}
            <TouchableOpacity 
              style={styles.editMeasurementsButton}
              onPress={() => navigation.navigate('Measurements', {customerId: customer.id})}>
              <Text style={styles.editMeasurementsText}>Edit Measurements</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'payments' && (
          <View style={styles.paymentsPlaceholder}>
            <Text style={styles.placeholderText}>Payment history will appear here</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.bottomAction, styles.measureAction]}
          onPress={() => navigation.navigate('Measurements', {customerId: customer.id})}>
          <Text style={styles.actionIcon}>📐</Text>
          <Text style={styles.actionLabel}>Measure</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.bottomAction, styles.newOrderAction]}
          onPress={() => navigation.navigate('NewOrder')}>
          <Text style={[styles.actionIcon, {color: colors.surface}]}>+</Text>
          <Text style={[styles.actionLabel, {color: colors.surface}]}>New Order</Text>
        </TouchableOpacity>
      </View>

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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  profileCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  customerName: {
    ...typography.h3,
    color: colors.text,
  },
  customerMobile: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...typography.h4,
    color: colors.text,
  },
  pendingValue: {
    color: colors.error,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 130,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  orderStatus: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  orderItems: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  orderDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderAmount: {
    ...typography.h4,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  measurementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  measurementItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '30%',
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  measurementLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  measurementValue: {
    ...typography.h4,
    color: colors.text,
    marginTop: 2,
  },
  editMeasurementsButton: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
    width: '100%',
  },
  editMeasurementsText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  paymentsPlaceholder: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'transparent',
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  measureAction: {
    backgroundColor: colors.surface,
  },
  newOrderAction: {
    backgroundColor: colors.primary,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
    color: colors.text,
  },
  actionLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.text,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default CustomerDetailScreen;