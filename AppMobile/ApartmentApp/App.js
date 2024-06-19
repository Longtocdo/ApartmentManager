import { View, StyleSheet } from 'react-native';

import HomeScreen from './screen/main/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Icon, MD2Colors } from 'react-native-paper';
import AccountScreen from './screen/AccountSreen/AccountScreen';
import LoginScreen from './screen/AccountSreen/LoginScreen';
import RegisterScreen from './screen/AccountSreen/RegisterScreen';
import TabViewPayment from './screen/main/PaymentScreen';
import PaymentDetailScreen from './screen/main/PaymentDetailScreen';
import { store } from './core/redux/store';
import { Provider, useDispatch, useSelector } from 'react-redux';
import AccountDetailScreen from './screen/AccountSreen/AccountDetailScreen';
import HomeChat from './screen/ChatScreen/HomeChat';
import Chat from './screen/ChatScreen/Chat';
import TabViewSurvey from './screen/main/SurveyScreen';
import SurveyDetailScreen from './screen/main/SurveyDetailScreen';
import TabViewCabinet from './screen/main/CabinetScreen';
import ChangePasswordScreen from './screen/AccountSreen/ChangePasswordScreen';
import ItemDetailScreen from './screen/main/ItemDetailScreen';
import ReportScreen from './screen/main/ReportScreen';
import RegisterPakingScreen from './screen/main/RegisterPakingScreen';
import ResetPasswordScreen from './screen/AccountSreen/ResetPasswordScreen';
import HistoryScreen from './screen/main/HistoryScreen';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserApi } from './core/APIs/UserApi';
import { auth } from './config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { UPDATE_PROFILE } from './core/redux/reducers/inforReducer';


const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name='CabinetScreen' component={TabViewCabinet} options={{ headerShown: false }} />
      <Stack.Screen name='PaymentScreen' component={TabViewPayment} options={{ headerShown: false }} />
      <Stack.Screen name='SurveyScreen' component={TabViewSurvey} options={{ headerShown: false }} />
      <Stack.Screen name='ChangePasswordScreen' component={ChangePasswordScreen} options={{ headerShown: false }} />
      <Stack.Screen name='RegisterScreen' component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name='SurveyDetailScreen' component={SurveyDetailScreen} options={{ title: 'Khảo sát' }} />
      <Stack.Screen name='PaymentDetailScreen' component={PaymentDetailScreen} options={{ title: 'Thanh toán hoán đơn' }} />
      <Stack.Screen name='ItemDetailScreen' component={ItemDetailScreen} options={{ title: 'Chi tiết hàng gửi' }} />
      <Stack.Screen name='ReportScreen' component={ReportScreen} options={{ title: 'Đăng ký giữ xe' }} />
      <Stack.Screen name='RegisterPakingScreen' component={RegisterPakingScreen} options={{ title: 'Đăng ký giữ xe' }} />
      <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} options={{ title: 'Quên mật khẩu' }} />
      <Stack.Screen name='AccountDetailSreen' component={AccountDetailScreen} options={{ title: 'Thông tin người dùng' }} />
      <Stack.Screen name='HomeChat' component={HomeChat} options={{ headerShown: false }} />
      <Stack.Screen name='Chat' component={Chat} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const ChatNavigator = () => {
  const userRole = useSelector(state => state.personalInfor.role); // Assuming you have the user's role in your Redux store
  console.log('role' + userRole)



  return (
    <Stack.Navigator>
      {userRole === 'Cư Dân' ? (
        <Stack.Screen name='Chat' component={Chat} />
      ) : (
        <Stack.Screen name='HomeChat' component={HomeChat} />
      )}
    </Stack.Navigator>
  );
}


const Tab = createBottomTabNavigator();
const MyTab = () => {
  return (
    <Tab.Navigator screenOptions={{
      tabBarHideOnKeyboard: true,
    }}>
      <Tab.Screen name="Home" component={MyStack} options={{ tabBarIcon: () => <Icon size={30} color="#1199" source="home" />, headerShown: false }} />
      <Tab.Screen name="Nhắn tin" component={ChatNavigator} options={{ headerShown: false, tabBarIcon: () => <Icon size={30} color="#1199" source="message" />, headerShown: false }} />
      <Tab.Screen name="Lịch sử" component={HistoryScreen} options={{ tabBarIcon: () => <Icon size={30} color="#1199" source="history" />, headerShown: false }} />
      <Tab.Screen name="Thông báo" component={HomeScreen} options={{ tabBarIcon: () => <Icon size={30} color="#1199" source="bell" />, headerShown: false }} />
      <Tab.Screen name="Tài khoản" component={AccountScreen} options={{ tabBarIcon: () => <Icon size={30} color="#1199" source="account" />, headerShown: false }} />
    </Tab.Navigator>
  );
}

const Init = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()

  const checkIsLogin = async () => {

    try {
      const token = await AsyncStorage.getItem('token')
      const userReponse = await UserApi.getUser(token)
      dispatch({
        type: UPDATE_PROFILE,
        data: userReponse.data
      })
      signInWithEmailAndPassword(auth, userReponse.data.email, userReponse.data.email)
        .then(() => console.log("Login success firebase"))
        .catch((err) => Alert.alert("Login error", err.message));
      navigation.navigate("HomeScreen")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIsLogin()

  }, [])
  return (
    <MyTab />
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Init />
      </NavigationContainer>
    </Provider>

  );
}

