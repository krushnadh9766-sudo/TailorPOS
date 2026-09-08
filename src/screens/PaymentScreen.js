import React, {useState} from 'react';
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

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId} = route.params;

  const [amount, setAmount] = useState('0');

  const order = {
    id: orderId,
    orderNumber: 'TP-0041',
    customer: 'Rahul Sharma',
    total: 2800,
    paid: 1600,
    balance: 1200,
  };

  const handleNumberPress = (num) => {
    if (num === 'clear') {
      setAmount('0');
      return;
    }
    if (num === '1200') {
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
      navigation.navigate('Receipt', {orderId: order.id});
    }
  };

  const numpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '1200', 'clear'],
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
            {order.orderNumber} · {order.customer}
          </Text>
        </View>

        <View style={styles.paymentSummary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>TOTAL</Text>
            <Text style={styles.summaryValue}>₹{order.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>PAID</Text>
            <Text style={[styles.summaryValue, styles.paidValue]}>₹{order.paid}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>BALANCE</Text>
            <Text style={[styles.summaryValue, styles.balanceValue]}>₹{order.balance}</Text>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>AMOUNT RECEIVING</Text>
          <Text style={styles.amountDisplay}>₹{parseFloat(amount).toLocaleString()}</Text>
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
                    key === '1200' && styles.suggestButton,
                  ]}
                  onPress={() => handleNumberPress(key)}>
                  <Text
                    style={[
                      styles.numpadText,
                      key === 'clear' && styles.clearText,
                      key === '1200' && styles.suggestText,
                    ]}>
                    {key === 'clear' ? '✕' : key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.receiveButton,
            parseFloat(amount) === 0 && styles.receiveButtonDisabled,
          ]}
          onPress={handleReceivePayment}
          disabled={parseFloat(amount) === 0}>
          <Text style={styles.receiveButtonText}>Receive Payment ✓</Text>
        </TouchableOpacity>
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

export default PaymentScreen;