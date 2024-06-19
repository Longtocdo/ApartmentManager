

import * as React from 'react';
import { View,  Text, ScrollView,  Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import TextInput from '../../components/TextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserApi } from '../../core/APIs/UserApi';

export default RegisterPakingScreen = ({navigation }) => {

  const [vehicle, setVehicle] = React.useState('')
  const [personName, setPersonName] = React.useState('')

  const confirmPress = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      console.log(token)
      const res = await UserApi.registerPaking({
        vehicle_number: vehicle,
        vehicle_owner: personName,
      },token)
      if (res.status == 201) {
        Alert.alert('Thành công', 'Gửi yêu cầu thành công, vui long đợi người quản tri duyệt.')
        navigation.navigate('HomeScreen')
      }
    } catch (error) {
      Alert.alert('Thất bại', 'Gửi đăng ký xe thất bại')
      console.log(error)
    }
  }
  return (
    <ScrollView >
      <View style={styles.container} >
        <View >
          <TextInput
            label="Số xe"
            returnKeyType="next"
            value={vehicle}
            onChangeText={setVehicle}
            style={styles.input}
          />
          <TextInput
            label="Tên chủ phương tiện"
            value={personName}
            onChangeText={setPersonName}
            multiline={true}
            numberOfLines={5}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={confirmPress}>
          <Text style={styles.confirm}>Gửi yêu cầu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    height: 830,
  },
  input: {
    fontSize: 18,
    width: 400
  },
  confirm: {
    borderRadius: 15,
    padding: 14,
    fontSize: 20,
    backgroundColor: 'blue',
    color: 'white',
    position: 'relative',
    top: 470,
    right: 0,
    left: 0,
    textAlign: 'center',
    width: 300
  },
});