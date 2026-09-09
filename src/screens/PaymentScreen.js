import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
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

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orders, addPayment} = useContext(AppContext);
  
  const paramOrder = route.params?.order;
  const orderId = paramOrder?.id || route.params?.orderId;
  const order = orders.find((o) => o.id === orderId) || paramOrder;

  const [amount, setAmount] = useState('0');

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  const handleNumberPress = (num) => {
    if (num === 'clear') {
      setAmount('0');
      return;
    }
    if (num === 'balance') {
      setAmount(String(order.balance));
      return;
    }
    if (amount === '0') {
      setAmount(String(num));
    } else {
      setAmount(amount + String(num));
    }
  };

  const handleReceivePayment = () => {
    const paymentAmount = parseFloat(amount);
    if (paymentAmount > 0 && paymentAmount <= order.balance) {
      addPayment(order.id, paymentAmount);
      navigation.navigate('Receipt', {orderId: order.id});
    }
  };

  const numpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', 'balance', 'clear'],
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderReference}>
            {order.id || order.orderNumber} · {order.customer}
          </Text>
        </View>

        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.total || order.amount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>PAID</Text>
            <Text style={[styles.summaryValue, styles.paidValue]}>{formatCurrency(order.paid)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>BALANCE</Text>
            <Text style={[styles.summaryValue, styles.balanceValue]}>{formatCurrency(order.balance)}</Text>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>AMOUNT RECEIVING</Text>
          <Text style={styles.amountDisplay}>₹{parseFloat(amount || '0').toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.numpad}>
          {numpadButtons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.numpadRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.numpadButton,
                    key === 'clear' && styles.clearButton,
                    key === 'balance' && styles.suggestButton,
                  ]}
                  onPress={() => handleNumberPress(key)}>
                  <Text
                    style={[
                      styles.numpadText,
                      key === 'clear' && styles.clearText,
                      key === 'balance' && styles.suggestText,
                    ]}>
                    {key === 'clear' ? '✕' : key === 'balance' ? 'Bal' : key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.receiveButton,
            (parseFloat(amount) === 0 || parseFloat(amount) > order.balance) && styles.receiveButtonDisabled,
          ]}
          onPress={handleReceivePayment}
          disabled={parseFloat(amount) === 0 || parseFloat(amount) > order.balance}>
          <Text style={styles.receiveButtonText}>Receive Payment ✓</Text>
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
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  orderInfo: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderReference: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paymentSummary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    ...typography.h4,
    color: colors.text,
  },
  paidValue: {
    color: colors.success,
  },
  balanceValue: {
    color: colors.error,
  },
  amountSection: {
    marginBottom: spacing.xl,
  },
  amountLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  amountDisplay: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  numpad: {
    marginBottom: spacing.xl,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  numpadButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  numpadText: {
    ...typography.h3,
    color: colors.text,
  },
  clearButton: {
    backgroundColor: colors.error,
  },
  clearText: {
    color: colors.surface,
  },
  suggestButton: {
    backgroundColor: colors.primary,
  },
  suggestText: {
    color: colors.surface,
  },
  receiveButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  receiveButtonDisabled: {
    backgroundColor: colors.border,
  },
  receiveButtonText: {
    ...typography.h4,
    color: colors.surface,
    fontWeight: '700',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default PaymentScreen;