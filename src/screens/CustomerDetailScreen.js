import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import BottomNavigation from '../components/BottomNavigation';
import {AppContext} from '../data/AppContext';
import {formatCurrency} from '../data/mockData';
import {customerApi} from '../services/api/customerApi';
import {orderApi} from '../services/api/orderApi';

const CustomerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const {customerId} = route.params;

  const [activeTab, setActiveTab] = useState('orders');
  const [customer, setCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const res = await customerApi.getCustomer(customerId);
        if (res.success) {
          setCustomer(res.data);
          // Fetch orders for this customer
          const ordersRes = await orderApi.getOrders('All', res.data.name);
          if (ordersRes.success) {
            // Filter strictly by exact name to be safe
            const exactOrders = ordersRes.data.filter(o => o.customer === res.data.name);
            setCustomerOrders(exactOrders);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (isFocused) {
      fetchCustomer();
    }
  }, [customerId, isFocused]);

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

  const measurements = customer.measurements || {
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
    bottom: 90,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  measureAction: {
    backgroundColor: colors.primary,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
    color: colors.surface,
  },
  actionLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.surface,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default CustomerDetailScreen;