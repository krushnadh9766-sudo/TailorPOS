import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DashboardScreen from '../screens/DashboardScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReceiptScreen from '../screens/ReceiptScreen';
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetailScreen from '../screens/CustomerDetailScreen';
import MeasurementsScreen from '../screens/MeasurementsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="NewOrder" component={NewOrderScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="Receipt" component={ReceiptScreen} />
        <Stack.Screen name="Customers" component={CustomersScreen} />
        <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
        <Stack.Screen name="Measurements" component={MeasurementsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;