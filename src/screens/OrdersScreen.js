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

const mockOrders = [
  {
    id: '1',
    orderNumber: 'TP-0041',
    customer: 'Rahul Sharma',
    items: 'Shirt × 2, Pant × 1',
    amount: 2800,
    paid: 1600,
    balance: 1200,
    dueDate: '5 Sep 2026',
    status: 'In Progress',
  },
  {
    id: '2',
    orderNumber: 'TP-0040',
    customer: 'Priya Menon',
    items: 'Blouse × 3',
    amount: 1800,
    paid: 1800,
    balance: 0,
    dueDate: '3 Sep 2026',
    status: 'Ready',
  },
  {
    id: '3',
    orderNumber: 'TP-0039',
    customer: 'Arun Kumar',
    items: 'Suit × 1',
    amount: 5500,
    paid: 4700,
    balance: 800,
    dueDate: '8 Sep 2026',
    status: 'Pending',
  },
  {
    id: '4',
    orderNumber: 'TP-0038',
    customer: 'Sunita Rao',
    items: 'Kurta × 4, Blouse × 2',
    amount: 3200,
    paid: 700,
    balance: 2500,
    dueDate: '1 Sep 2026',
    status: 'Pending',
  },
  {
    id: '5',
    orderNumber: 'TP-0037',
    customer: 'Vijay Nair',
    items: 'Pant × 2',
    amount: 1200,
    paid: 1200,
    balance: 0,
    dueDate: '30 Aug 2026',
    status: 'Delivered',
  },
  {
    id: '6',
    orderNumber: 'TP-0036',
    customer: 'Rahul Sharma',
    items: 'Shirt × 1',
    amount: 800,
    paid: 800,
    balance: 0,
    dueDate: '26 Aug 2026',
    status: 'Delivered',
  },
];

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Pending':
        return colors.warningLight;
      case 'In Progress':
        return '#DBEAFE';
      case 'Ready':
        return colors.successLight;
      case 'Delivered':
        return colors.border;
      default:
        return colors.border;
    }
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = ['All', 'Pending', 'In Progress', 'Ready', 'Delivered'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Orders</Text>
          <Text style={styles.orderCount}>{filteredOrders.length} orders</Text>
        </View>
        <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate('NewOrder')}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search order or customer..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => navigation.navigate('OrderDetail', {orderId: order.id})}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <View style={[styles.statusBadge, {backgroundColor: getStatusBgColor(order.status)}]}>
                  <Text style={[styles.statusText, {color: getStatusColor(order.status)}]}>
                    {order.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.customerName}>{order.customer}</Text>
              <Text style={styles.itemsText}>{order.items}</Text>
              <Text style={styles.dueDate}>Due: {order.dueDate}</Text>
              <View style={styles.orderFooter}>
                <Text style={styles.amount}>₹{order.amount.toLocaleString()}</Text>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paidText}>Paid ₹{order.paid.toLocaleString()}</Text>
                  {order.balance > 0 && (
                    <Text style={styles.balanceText}>Bal ₹{order.balance.toLocaleString()}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navNew]} onPress={() => navigation.navigate('NewOrder')}>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.surface,
  },
  orderCount: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  newButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  newButtonText: {
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
    marginBottom: spacing.sm,
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
  tabsContainer: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  tabsContent: {
    paddingVertical: spacing.xs,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.surface,
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
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
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  customerName: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: 2,
  },
  itemsText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dueDate: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    ...typography.h4,
    color: colors.primary,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  paidText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  balanceText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  emptyState: {
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
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
  navActive: {},
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

export default OrdersScreen;