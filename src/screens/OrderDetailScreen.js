import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import BottomNavigation from '../components/BottomNavigation';
import {AppContext} from '../data/AppContext';
import {formatCurrency} from '../data/mockData';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orders, updateOrderStatus} = useContext(AppContext);
  
  const paramOrder = route.params?.order;
  const orderId = paramOrder?.id || route.params?.orderId;
  const order = orders.find((o) => o.id === orderId) || paramOrder;

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

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

  const handleMarkReady = () => {
    updateOrderStatus(order.id, 'Ready');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{order.id || order.orderNumber}</Text>
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
            <Text style={styles.infoLabel}>MOBILE</Text>
            <Text style={styles.infoValue}>{order.customerMobile}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ORDER DATE</Text>
            <Text style={styles.infoValue}>{order.orderDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DELIVERY</Text>
            <Text style={styles.infoValue}>{order.dueDate || order.deliveryDate}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>GARMENTS</Text>
          {Array.isArray(order.items) ? order.items.map((item, index) => (
            <View key={index} style={styles.garmentRow}>
              <Text style={styles.garmentName}>{item.type} × {item.quantity}</Text>
              <Text style={styles.garmentPrice}>{formatCurrency(item.price * item.quantity)}</Text>
            </View>
          )) : (
            <View style={styles.garmentRow}>
              <Text style={styles.garmentName}>{order.items}</Text>
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>PAYMENT</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Total</Text>
            <Text style={styles.paymentValue}>{formatCurrency(order.total || order.amount)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Paid</Text>
            <Text style={[styles.paymentValue, styles.paidValue]}>{formatCurrency(order.paid)}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Balance</Text>
            <Text style={[styles.paymentValue, styles.balanceValue]}>{formatCurrency(order.balance)}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {order.status !== 'Ready' && order.status !== 'Delivered' && (
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleMarkReady}>
              <Text style={styles.primaryButtonText}>Mark Ready</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Payment', {order})}>
            <Text style={styles.secondaryButtonText}>Add Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.outlineButton]} 
            onPress={() => navigation.navigate('Receipt', {orderId: order.id})}>
            <Text style={styles.outlineButtonText}>Print</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 100}} />
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
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
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default OrderDetailScreen;