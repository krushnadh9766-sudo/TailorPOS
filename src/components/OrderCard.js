import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import StatusBadge from './StatusBadge';
import {formatCurrency} from '../data/mockData';

const OrderCard = ({order, onPress}) => {
  const itemsText = Array.isArray(order.items) 
    ? order.items.map(i => `${i.type} × ${i.quantity}`).join(', ')
    : order.items;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{order.id || order.orderNumber}</Text>
        <StatusBadge status={order.status} />
      </View>
      
      <Text style={styles.customer}>{order.customer}</Text>
      
      <Text style={styles.items}>{itemsText}</Text>
      
      <View style={styles.footer}>
        <View style={styles.amountSection}>
          <Text style={styles.amount}>{formatCurrency(order.total || order.amount)}</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paid}>Paid: {formatCurrency(order.paid)}</Text>
            {order.balance > 0 && (
              <Text style={styles.balance}>Bal: {formatCurrency(order.balance)}</Text>
            )}
          </View>
        </View>
        <Text style={styles.dueDate}>Due {order.dueDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNumber: {
    ...typography.h4,
    color: colors.text,
  },
  customer: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  items: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  amountSection: {
    flexDirection: 'column',
  },
  amount: {
    ...typography.h4,
    color: colors.primary,
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  paid: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  balance: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '600',
  },
  dueDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default OrderCard;