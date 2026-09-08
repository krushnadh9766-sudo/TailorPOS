import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import StatusBadge from './StatusBadge';

const OrderCard = ({
  orderNumber,
  customer,
  items,
  amount,
  dueAmount,
  dueDate,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
        <StatusBadge status={status} />
      </View>
      
      <Text style={styles.customer}>{customer}</Text>
      
      <Text style={styles.items}>{items}</Text>
      
      <View style={styles.footer}>
        <View style={styles.amountSection}>
          <Text style={styles.amount}>₦{amount.toLocaleString()}</Text>
          {dueAmount && dueAmount > 0 && (
            <Text style={styles.due}>₦{dueAmount.toLocaleString()} due</Text>
          )}
        </View>
        <Text style={styles.dueDate}>Due {dueDate}</Text>
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
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  amountSection: {
    flexDirection: 'column',
  },
  amount: {
    ...typography.h4,
    color: colors.primary,
  },
  due: {
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