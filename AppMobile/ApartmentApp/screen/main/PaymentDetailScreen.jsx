

import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
import { BillApis } from '../../core/APIs/BillAPIs';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';

export default PaymentDetailScreen = ({ navigation }) => {
  const route = useRoute();

  const { billId, isPayed, paymentMethod } = route.params;
  const [bill, setBill] = React.useState({})
  const [paymentType, setPaymentType] = React.useState('Chuyển khoản Momo')

  const loadBill = async (id) => {
    try {
      const res = await BillApis.getBillById(id)
      setBill(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    loadBill(billId ?? undefined);
  }, [])

  const [selectedImage, setSelectedImage] = React.useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log('Đường dẫn hình ảnh:', result.assets[0].uri);

      setSelectedImage(result.assets[0].uri)

      const formData = new FormData();
      formData.append('avatar', {
        uri: result.assets[0].uri,
        name: 'userProfile.jpg',
        type: 'image/jpge',
      });

      try {

        const res = await BillApis.updateProofById(billId, formData);

      } catch (error) {
        console.log(error)
        console.log('Lỗi upload')
      }
    }
  };

  const openURL = async (url) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.error('Không thể mở URL:', url);
    }
  };

  const paymentPress = async () => {
    const res = await BillApis.paymentBill({
      "price": bill?.fee?.price,
      "resident_fee_id": bill?.fee?.id
    })

    if (res.status == 200) {
      openURL(res.data.payUrl)
    }
  }

  return (
    <ScrollView style={styles.container} >
      {!isPayed &&
        <View>
          <View>
            <Text style={styles.tittle}>Hình thức thanh toán</Text>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => { setPaymentType('Momo') }}>
              <View>
                <Card.Title style={styles.card}
                  title="Ví Momo"
                  titleStyle={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}
                  subtitle='Miễn phí'
                  left={(props) => <Avatar.Image size={40} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\logo.png')} />}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPaymentType('Zalo') }}>
              <View>
                <Card.Title style={styles.card}
                  title="Ví ZaloPay"
                  titleStyle={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}
                  subtitle='Miễn phí'
                  left={(props) => <Avatar.Image size={40} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\logo.png')} />}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPaymentType('Chuyển khoản ngân hàng') }}>
              <View>
                <Card.Title style={styles.card}
                  title="Chuyển khoản"
                  titleStyle={{ fontSize: 14, fontWeight: 'bold', color: 'black' }}
                  subtitle='Miễn phí'
                  left={(props) => <Avatar.Image size={40} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\logo.png')} />}
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>}

      <View >
        <Text style={styles.tittle}>Chi tiết  giao dịch</Text>
        <View style={styles.detail}>
          <View style={styles.item}>
            <Text style={styles.tittle}>Tên dịch vụ</Text>
            <View></View>
            <Text style={styles.content}>{bill?.fee?.fee_name}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.tittle}>Thời gian</Text>
            <View></View>
            <Text style={styles.content}>{bill?.fee?.created_date}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.tittle}>Giá</Text>
            <View></View>
            <Text style={styles.content}>{`${bill?.fee?.price.toLocaleString('vi-VN') + 'đ'}`}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.tittle}>Số lượng </Text>
            <View></View>
            <Text style={styles.content}>{bill?.amount}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.tittle}>Tạm tính</Text>
            <View></View>
            <Text style={styles.content}>{`${bill?.fee?.price.toLocaleString('vi-VN') + 'đ'}`}</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.tittle}>Hình thức thanh toán </Text>
            <View></View>
            <Text style={styles.content}>{paymentMethod}</Text>
          </View>

          {isPayed &&
            <View style={styles.item}>
              <Text style={styles.tittle}>Thanh toán ngày </Text>
              <View></View>
              <Text style={styles.content}>{bill.payment_date}</Text>
            </View>
          }
          {paymentType == 'Chuyển khoản ngân hàng' &&
            <>
              <View style={styles.item}>
                <Text style={styles.tittle}>Ngân hàng</Text>
                <View></View>
                <Text style={styles.content}>Sacombank</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.tittle}>Số tài khoản</Text>
                <View></View>
                <Text style={styles.content}>034285972384</Text>
              </View>
            </>
          }
        </View>
      </View>
      {!isPayed &&
        <>
          {paymentType !== 'Chuyển khoản ngân hàng' ?
            <TouchableOpacity onPress={paymentPress}>
              <Text style={styles.confirm}>Xác nhận</Text>
            </TouchableOpacity> :

            <TouchableOpacity onPress={pickImage}>
              <Text style={styles.confirm}>Upload ảnh xác minh</Text>
            </TouchableOpacity>
          }
        </>
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