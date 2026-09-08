import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {borderRadius, spacing} from '../theme/spacing';

const StatusBadge = ({status}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Pending':
        return colors.status.pending;
      case 'In Progress':
        return colors.status.inProgress;
      case 'Ready':
        return colors.status.ready;
      case 'Delivered':
        return colors.status.delivered;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case 'Pending':
        return colors.statusBg.pending;
      case 'In Progress':
        return colors.statusBg.inProgress;
      case 'Ready':
        return colors.statusBg.ready;
      case 'Delivered':
        return colors.statusBg.delivered;
      default:
        return colors.border;
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: getStatusBgColor()}]}>
      <View style={[styles.dot, {backgroundColor: getStatusColor()}]} />
      <Text style={[styles.text, {color: getStatusColor()}]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});

export default StatusBadge;