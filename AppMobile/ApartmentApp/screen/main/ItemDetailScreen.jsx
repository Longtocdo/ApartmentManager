

import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { CabinetAPIs } from '../../core/APIs/CabinetAPIs';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default ItemDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;

  const confirmPress = async () => {

    try {
      const token = await AsyncStorage.getItem('token')
      const res = await CabinetAPIs.setReceivedItem(item.id, token)
      if (res.status == 200) {
        Alert.alert('Thành công', 'Cập nhật thành công')
        navigation.navigate('CabinetScreen')
      }
    } catch (error) {
      Alert.alert('Thật bại', 'Cập nhật thất bại')
      console.log(error)
    }
  }
  return (
    <ScrollView style={styles.container} >
      <View >
        <Text style={styles.tittle}>Chi tiết hàng gửi</Text>
        <View style={styles.detail}>
          <View style={styles.item}>
            <Text style={styles.tittle}>Tên hàng</Text>
            <View></View>
            <Text style={styles.content}>{item.item_name}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.tittle}>Thời gian gửi</Text>
            <View></View>
            <Text style={styles.content}>{item?.created_date}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.tittle}>Trạng thái</Text>
            <View></View>
            <Text style={styles.content}>{`${item.status ? 'Đã nhận' : 'Chưa nhận'}`}</Text>
          </View>

          {item.status &&
            <View style={styles.item}>
              <Text style={styles.tittle}>Ngày nhận</Text>
              <View></View>
              <Text style={styles.content}>{item.received_date}</Text>
            </View>
          }
        </View>
      </View>

      {!item.status &&
        <TouchableOpacity onPress={confirmPress}>
          <Text style={styles.confirm}>Xác nhận đã nhận</Text>
        </TouchableOpacity>
      }
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 20
  },
  tittle: {
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    borderRadius: 15,
    marginTop: 20,
    marginRight: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  detail: {
    marginTop: 20,
    backgroundColor: 'lightblue',
    flexGrow: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'white', shadowColor: 'blue',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: 'whitesmoke'
  },
  confirm: {
    color: 'white',
    backgroundColor: 'blue',
    textAlign: 'center',
    fontWeight: '700',
    padding: 15,
    marginTop: 25,
    borderRadius: 15,
  },
  tittle: {
    fontSize: 16
  },
  content: {
    fontSize: 16,
    fontWeight: '700',
  },

});