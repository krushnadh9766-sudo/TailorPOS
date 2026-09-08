import React from 'react';
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

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId} = route.params;

  const order = {
    id: orderId,
    orderNumber: 'TP-0041',
    status: 'In Progress',
    customer: 'Rahul Sharma',
    orderDate: '28 Aug 2026',
    deliveryDate: '5 Sep 2026',
    garments: [
      {name: 'Shirt × 2', price: 1400},
      {name: 'Pant × 1', price: 1400},
    ],
    total: 2800,
    paid: 1600,
    balance: 1200,
  };

  const getStatusColor = () => {
    switch (order.status) {
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

  const getStatusBgColor = () => {
    switch (order.status) {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{order.orderNumber}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.statusCard, {backgroundColor: getStatusBgColor()}]}>
          <Text style={[styles.statusText, {color: getStatusColor()}]}>
            {order.status}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CUSTOMER</Text>
            <Text style={styles.infoValue}>{order.customer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ORDER DATE</Text>
            <Text style={styles.infoValue}>{order.orderDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DELIVERY</Text>
            <Text style={styles.infoValue}>{order.deliveryDate}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>GARMENTS</Text>
          {order.garments.map((item, index) => (
            <View key={index} style={styles.garmentRow}>
              <Text style={styles.garmentName}>{item.name}</Text>
              <Text style={styles.garmentPrice}>₹{item.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PAYMENT</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total</Text>
            <Text style={styles.paymentValue}>₹{order.total}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Paid</Text>
            <Text style={[styles.paymentValue, styles.paidValue]}>₹{order.paid}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Balance</Text>
            <Text style={[styles.paymentValue, styles.balanceValue]}>₹{order.balance}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {order.status !== 'Delivered' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <Text style={styles.primaryButtonText}>Mark Ready</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Payment', {orderId: order.id})}>
            <Text style={styles.secondaryButtonText}>Add Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.outlineButton]}>
            <Text style={styles.outlineButtonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navActive]} onPress={() => navigation.navigate('Orders')}>
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
  headerTitle: {
    ...typography.h3,
    color: colors.surface,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 100,
  },
  statusCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.h4,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  garmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  garmentName: {
    ...typography.body,
    color: colors.text,
  },
  garmentPrice: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  paymentLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  paymentValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paidValue: {
    color: colors.success,
  },
  balanceValue: {
    color: colors.error,
  },
  actionButtons: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  secondaryButton: {
    backgroundColor: colors.success,
  },
  secondaryButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineButtonText: {
    ...typography.bodyBold,
    color: colors.text,
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

export default OrderDetailScreen;