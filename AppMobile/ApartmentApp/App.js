import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HistoryScreen from './screen/main/InvoiceScreen';
import ResetPasswordScreen from './screen/AccountSreen/ResetPasswordScreen';
import Navigation from "./navigation/index"

import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screen/main/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import AccountScreen from './screen/AccountSreen/AccountScreen';
import LoginScreen from './screen/AccountSreen/LoginScreen';
import RegisterScreen from './screen/AccountSreen/RegisterScreen';
import TabViewExample from './screen/main/HistoryScreen';
import TabViewPayment from './screen/main/PaymentScreen';
import PaymentDetailScreen from './screen/main/PaymentDetailScreen';



const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name='HomeSreen' component={HomeScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name='PaymentScreen' component={TabViewPayment}  options={{ headerShown: false }}/>
      <Stack.Screen name='Đăng nhập' component={LoginScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name='Đăng ký' component={RegisterScreen}  options={{ headerShown: false }}/>
      <Stack.Screen name='PaymentDetailScreen' component={PaymentDetailScreen}  options={{ title:'Thanh toán hoán đơn' }}/>

    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={MyStack} options={{tabBarIcon: () => <Icon size={30} color="#1199" source="home" />,  headerShown: false }} />
      <Tab.Screen name="Giao tiếp" component={HomeScreen} options={{tabBarIcon: () => <Icon size={30} color="#1199" source="message" />,  headerShown: false }} />
      <Tab.Screen name="Lịch sử" component={TabViewExample} options={{tabBarIcon: () => <Icon size={30} color="#1199" source="history" />,  headerShown: false }} />
      <Tab.Screen name="Thông báo" component={HomeScreen} options={{tabBarIcon: () => <Icon size={30} color="#1199" source="bell" />,  headerShown: false }} />
      <Tab.Screen name="Tài khoản" component={AccountScreen} options={{tabBarIcon: () => <Icon size={30} color="#1199" source="account" />,  headerShown: false }} />
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <MyTab />
    </NavigationContainer>
  );
}





