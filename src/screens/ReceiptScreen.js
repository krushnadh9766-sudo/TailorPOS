import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute, useIsFocused} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import {formatCurrency, getCurrentDateFormatted} from '../data/mockData';
import {orderApi} from '../services/api/orderApi';
import {settingsApi} from '../services/api/settingsApi';

const ReceiptScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const {orderId} = route.params || {};

  const [order, setOrder] = useState(null);
  const [shopSettings, setShopSettings] = useState(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [orderRes, settingsRes] = await Promise.all([
          orderApi.getOrder(orderId),
          settingsApi.getShopSettings()
        ]);
        
        if (orderRes.success) {
          setOrder(orderRes.data);
        }
        if (settingsRes.success) {
          setShopSettings(settingsRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (isFocused && orderId) {
      fetchData();
    }
  }, [orderId, isFocused]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />
      </SafeAreaView>
    );
  }
  
  const shopName = shopSettings?.shop_name || 'Tailor POS';
  const shopAddress = shopSettings?.shop_address ? `${shopSettings.shop_address}, ${shopSettings.city || ''}` : 'Rameevaram Tailor';
  const shopContact = shopSettings?.phone || '123 Main Street, Bangalore - 9876543210';

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: colors.text}}>Unable to load receipt.</Text>
          <Text style={{fontSize: 14, color: colors.textLight, marginTop: 4}}>Please try again.</Text>
          <TouchableOpacity 
            style={[styles.button, {marginTop: 20}]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const receipt = {
    receiptNumber: `RCP-${String(order.id).split('-')[1] || order.id}`,
    date: `${getCurrentDateFormatted()}, ${new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}`,
    customer: order.customer,
    order: order.id,
    shopName: shopName,
    shopAddress: shopAddress,
    shopContact: shopContact,
    items: Array.isArray(order.items) ? order.items.map(item => ({
      name: `${item.type || item.garment_type || item.name} x ${item.quantity}`,
      price: item.price * item.quantity || item.unit_price * item.quantity || item.amount || 0
    })) : [],
    total: order.total || 0,
    paid: order.paid_amount || 0,
    balance: order.balance_amount || 0,
    method: (order.payments && order.payments.length > 0) ? order.payments[0].method : 'N/A',
    paymentDate: (order.payments && order.payments.length > 0) ? new Date(order.payments[0].payment_date).toLocaleDateString('en-IN') : '',
  };

  const handlePrint = () => {
    Alert.alert('Printing', 'Sending to thermal printer...');
  };

  const handleShare = async () => {
    try {
      const receiptText = `
Receipt from ${receipt.shopName}
------------------------
Order: ${receipt.order}
Date: ${receipt.date}
Customer: ${receipt.customer}
------------------------
Total: ${formatCurrency(receipt.total)}
Paid: ${formatCurrency(receipt.paid)}
Balance: ${formatCurrency(receipt.balance)}
------------------------
Thank you!
      `;
      
      await Share.share({
        message: receiptText,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share receipt');
    }
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
        <View style={styles.receiptWrapper}>
          <View style={styles.receiptCard}>
            <Text style={styles.shopName}>{receipt.shopName}</Text>
            <Text style={styles.shopInfo}>{receipt.shopAddress}</Text>
            <Text style={styles.shopInfo}>{receipt.shopContact}</Text>

            <View style={styles.dashedDivider} />

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

            <View style={styles.dashedDivider} />

            {receipt.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
            ))}

            <View style={styles.dashedDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(receipt.total)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Paid</Text>
              <Text style={[styles.totalValue, styles.paidValue]}>{formatCurrency(receipt.paid)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Balance</Text>
              <Text style={[styles.totalValue, styles.balanceValue]}>{formatCurrency(receipt.balance)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Method</Text>
              <Text style={styles.totalValue}>{receipt.method}</Text>
            </View>

            <View style={styles.dashedDivider} />

            <Text style={styles.thankYou}>Thank you for choosing us! 👏</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handlePrint}>
            <Text style={styles.primaryButtonText}>🖨️ Print</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleShare}>
            <Text style={styles.secondaryButtonText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.outlineButton]}
            onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.outlineButtonText}>✓ Done</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 20}} />
      </ScrollView>
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
  receiptWrapper: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  receiptCard: {
    padding: spacing.xl,
    backgroundColor: '#fff',
  },
  shopName: {
    ...typography.h2,
    color: '#111827',
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: 'bold',
  },
  shopInfo: {
    ...typography.bodySmall,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 2,
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
    borderStyle: 'dashed',
    marginVertical: spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  receiptLabel: {
    ...typography.bodySmall,
    color: '#4B5563',
  },
  receiptValue: {
    ...typography.bodySmall,
    color: '#111827',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  itemName: {
    ...typography.body,
    color: '#111827',
  },
  itemPrice: {
    ...typography.body,
    color: '#111827',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  totalLabel: {
    ...typography.bodyBold,
    color: '#374151',
  },
  totalValue: {
    ...typography.bodyBold,
    color: '#111827',
  },
  paidValue: {
    color: colors.success,
  },
  balanceValue: {
    color: colors.error,
  },
  thankYou: {
    ...typography.body,
    color: '#4B5563',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.sm,
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
    backgroundColor: '#10B981',
  },
  secondaryButtonText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  outlineButtonText: {
    ...typography.bodyBold,
    color: '#374151',
  },
});

export default ReceiptScreen;