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

const ReceiptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {orderId} = route.params;

  const receipt = {
    receiptNumber: 'RCP-0041',
    date: '2 Sep 2026, 3:42 PM',
    customer: 'Rahul Sharma',
    order: 'TP-0041',
    items: [
      {name: 'Shirt x 2', price: 1400},
      {name: 'Pant x 1', price: 1400},
    ],
    total: 2800,
    paid: 1600,
    balance: 1200,
    method: 'Cash',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.receiptCard}>
          <Text style={styles.shopName}>Tailor POS</Text>
          <Text style={styles.shopInfo}>Rameevaram Tailor</Text>
          <Text style={styles.shopInfo}>123 Main Street, Bangalore - 9876543210</Text>

          <View style={styles.divider} />

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Receipt #</Text>
            <Text style={styles.receiptValue}>{receipt.receiptNumber}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Date</Text>
            <Text style={styles.receiptValue}>{receipt.date}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Customer</Text>
            <Text style={styles.receiptValue}>{receipt.customer}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Order</Text>
            <Text style={styles.receiptValue}>{receipt.order}</Text>
          </View>

          <View style={styles.divider} />

          {receipt.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{receipt.total}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Paid</Text>
            <Text style={[styles.totalValue, styles.paidValue]}>₹{receipt.paid}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Balance</Text>
            <Text style={[styles.totalValue, styles.balanceValue]}>₹{receipt.balance}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Method</Text>
            <Text style={styles.totalValue}>{receipt.method}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.thankYou}>Thank you for choosing us! 👏</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>Print</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <Text style={styles.secondaryButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.outlineButton]}
            onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.outlineButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
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
  receiptCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  shopName: {
    ...typography.h2,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  shopInfo: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginVertical: spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  receiptLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  receiptValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  itemName: {
    ...typography.body,
    color: colors.text,
  },
  itemPrice: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  totalValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  paidValue: {
    color: colors.success,
  },
  balanceValue: {
    color: colors.error,
  },
  thankYou: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: spacing.sm,
    marginBottom: spacing.md,
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

export default ReceiptScreen;