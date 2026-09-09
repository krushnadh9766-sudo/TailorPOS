import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';
import BottomNavigation from '../components/BottomNavigation';
import {AppContext} from '../data/AppContext';
import {getCurrentDateFormatted, formatCurrency} from '../data/mockData';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const {orders} = useContext(AppContext);

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const todaysOrders = orders.filter(
    (o) => o.orderDate === '5 Sep 2026' || o.orderDate === new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})
  ).length || 2; // Mock logic for today's orders

  const pendingCount = orders.filter((o) => o.status === 'Pending').length;
  const readyCount = orders.filter((o) => o.status === 'Ready').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tailor POS</Text>
          <Text style={styles.headerDate}>{getCurrentDateFormatted()}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>RS</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TODAY'S SALES</Text>
            <Text style={styles.summaryValue}>{formatCurrency(4100)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TODAY'S ORDERS</Text>
            <Text style={styles.summaryValue}>{todaysOrders}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>PENDING</Text>
            <Text style={[styles.summaryValue, styles.pendingValue]}>{pendingCount}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>READY</Text>
            <Text style={[styles.summaryValue, styles.readyValue]}>{readyCount}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateTo('NewOrder')}>
            <View style={[styles.actionIcon, styles.actionNewOrder]}>
              <Text style={styles.actionIconText}>+</Text>
            </View>
            <Text style={styles.actionLabel}>New Order</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateTo('Orders')}>
            <View style={[styles.actionIcon, styles.actionOrders]}>
              <Text style={styles.actionIconText}>📋</Text>
            </View>
            <Text style={styles.actionLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateTo('Customers')}>
            <View style={[styles.actionIcon, styles.actionCustomers]}>
              <Text style={styles.actionIconText}>👤</Text>
            </View>
            <Text style={styles.actionLabel}>Customers</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateTo('Settings')}>
            <View style={[styles.actionIcon, styles.actionBilling]}>
              <Text style={styles.actionIconText}>💳</Text>
            </View>
            <Text style={styles.actionLabel}>Billing</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Collection */}
        <View style={styles.collectionCard}>
          <Text style={styles.collectionLabel}>TODAY'S COLLECTION</Text>
          <Text style={styles.collectionValue}>{formatCurrency(4100)}</Text>
        </View>

        {/* Spacer */}
        <View style={{height: 20}} />
      </ScrollView>

      <BottomNavigation />
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
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.surface,
  },
  headerDate: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: '48%',
    marginBottom: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  summaryValue: {
    ...typography.numberLarge,
    color: colors.text,
    marginTop: 2,
  },
  pendingValue: {
    color: colors.warning,
  },
  readyValue: {
    color: colors.success,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionNewOrder: {
    backgroundColor: colors.primary,
  },
  actionOrders: {
    backgroundColor: '#DBEAFE',
  },
  actionCustomers: {
    backgroundColor: '#D1FAE5',
  },
  actionBilling: {
    backgroundColor: '#FEF3C7',
  },
  actionIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.surface,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  collectionCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  collectionLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
  },
  collectionValue: {
    ...typography.h1,
    color: colors.surface,
    marginTop: 2,
  },
});

export default DashboardScreen;