import { NavigationContainer } from "@react-navigation/native"
import HomeScreen from "../screen/main/HomeScreen"
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default Navigation = ()=>{
    <NavigationContainer>
        <MyStack/>
    </NavigationContainer>
}