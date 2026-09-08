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
import {useNavigation} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tailor POS</Text>
          <Text style={styles.headerDate}>Wed, 2 Sep 2026</Text>
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
            <Text style={styles.summaryValue}>₦4,100</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TODAY'S ORDERS</Text>
            <Text style={styles.summaryValue}>2</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>PENDING</Text>
            <Text style={[styles.summaryValue, styles.pendingValue]}>2</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>READY</Text>
            <Text style={[styles.summaryValue, styles.readyValue]}>1</Text>
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
              <Text style={styles.actionIconText}>💰</Text>
            </View>
            <Text style={styles.actionLabel}>Billing</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Collection */}
        <View style={styles.collectionCard}>
          <Text style={styles.collectionLabel}>TODAY'S COLLECTION</Text>
          <Text style={styles.collectionValue}>₦4,100</Text>
        </View>

        {/* Spacer */}
        <View style={{height: 20}} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navActive]}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('Orders')}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.navNew]} onPress={() => navigateTo('NewOrder')}>
          <View style={styles.navNewButton}>
            <Text style={styles.navNewIcon}>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('Customers')}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Customers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('Settings')}>
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
    shadowColor: colors.cardShadow,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
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

export default DashboardScreen;