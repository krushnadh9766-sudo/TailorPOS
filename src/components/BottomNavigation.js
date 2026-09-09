import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing, borderRadius} from '../theme/spacing';

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRouteName = route.name;

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const navItems = [
    {name: 'Dashboard', label: 'Home', icon: '🏠'},
    {name: 'Orders', label: 'Orders', icon: '📋'},
    {name: 'NewOrder', label: 'New', icon: '+'},
    {name: 'Customers', label: 'Customers', icon: '👤'},
    {name: 'Settings', label: 'Settings', icon: '⚙️'},
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => {
        const isNewButton = item.name === 'NewOrder';
        const isActive = currentRouteName === item.name;

        if (isNewButton) {
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, styles.navNew]}
              onPress={() => navigateTo(item.name)}>
              <View style={styles.navNewButton}>
                <Text style={styles.navNewIcon}>{item.icon}</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => navigateTo(item.name)}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                isActive && styles.navLabelActive,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
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
    // Add position absolute to place it at the bottom if wrapped in a view
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    minWidth: 50,
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

export default BottomNavigation;

