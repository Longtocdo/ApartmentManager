

import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native';
import { UserApi } from '../../core/APIs/UserApi';
import { useDispatch, useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Loading from '../../components/Loading';
import { userActions } from '../../core/redux/reducers/inforReducer';

const Menu = [
  {
    name: 'Thanh toán',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-invoice.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,

  },
  {
    name: 'Dịch vụ',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-bill.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />
  }, {
    name: 'Phản ánh',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-phananh.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />
  }, {
    name: 'Tiện ích',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-bill.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />
  },
]


const TienIch = [
  {
    name: 'Sửa chửa',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\repair.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Vận chuyển thang máy',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\elevator.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Khai báo y tế',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\injection.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Hotline',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\hotline.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Góp ý',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\mailbox.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Cho thuê/bán căn hộ',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\rent.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Rửa xe',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\car_wash.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },
  {
    name: 'Thi công',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\paint.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />

  },

]



export default HomeScreen = ({ navigation }) => {

  const profile = useSelector((state) => state.personalInfor);

  const dispatch = useDispatch()


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
      formData.append('id', '1'); // Thay thế '123' bằng giá trị id thực tế
      formData.append('avatar', {
        uri: result.assets[0].uri,
        name: 'userProfile.jpg',
        type: 'image/jpge',
      });

      try {
        await axios.post("https://longtocdo107.pythonanywhere.com/users/2/upload_avatar/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then(function (response) {
          //handle success
          console.log('Thanh cong')
          console.log(response);
        })
          .catch(function (response) {
            console.log('That bai')
            //handle error
            console.log(response);
          });;

      } catch (error) {
        console.log('Lỗi upload')
      }
    }
  };

  React.useEffect(() => {
    console.log(profile)
  }, [])


  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />


  return (
    <ScrollView style={styles.container} >
      <View style={styles.header}>
        <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
          <Card.Title style={styles.card}
            title="Mr.Sang Tower"
            titleStyle={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginLeft: -10 }}
            left={(props) => <Avatar.Image size={35} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\logo.png')} />}
          />

          <Card.Title style={styles.cardInfor}
            title={`${profile.first_name} ${profile.last_name} `}
            subtitle='B103 - Thành viên'
            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            subtitleStyle={{ fontSize: 12, color: 'white', marginTop: -5 }}
          />
        </ImageBackground>
      </View>
      <View style={styles.body}>
        <View style={styles.menu}>
          {Menu.map(c => <View id={c.name} style={{ alignItems: 'center', width: '25%', paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => { navigation.navigate('PaymentScreen') }}>
              {c.avatar}
              <Text>{c.name}</Text>
            </TouchableOpacity>
          </View>)}
        </View>


        <View style={styles.alert}>
          <Button icon="bell" size={25}>Có 3 lời nhắc</Button>
          <Button onPress={() => { }}>Xem thêm </Button>
        </View>

        <View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Image
              source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
              style={{ borderRadius: 5, margin: 5 }}
            />

            <Image
              source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
              style={{ borderRadius: 5, margin: 5 }}
            />

            <Image
              source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
              style={{ borderRadius: 5, margin: 5 }}
            />

            <Image
              source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
              style={{ borderRadius: 5, margin: 5 }}
            />
          </ScrollView>
        </View>
        <View>
          <Text style={styles.tittle}>Gợi ý cho bạn </Text>
          <View style={styles.tienIch}>

            {TienIch.map(c => <View id={c.name} style={{ alignItems: 'center', width: '25%', paddingBottom: 10 }}>
              {c.image}
              <Text>{c.name}</Text>
            </View>)}
          </View>
        </View>

        <View>
        <Text style={styles.tittle}>Thông báo/bài viết</Text>
        <Card style={styles.cardArticle}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{height:150}}/>
          <Card.Content>
            <Text style={styles.tittleArticle} >Thông báo bảo trì thang máy</Text>
            <Text style={styles.contentArticle} numberOfLines={2}>Xin chào các cư dân, ngày 15-02-2024 sẽ bảo trì thang máy số 2. Kính mong quý cư dư thông cảm, thông tin chi tiết xin liên hệ hotline 08734682347</Text>
          </Card.Content>
        </Card>

        <Card style={styles.cardArticle}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{height:150}}/>
          <Card.Content>
            <Text style={styles.tittleArticle} >Thông báo bảo trì thang máy</Text>
            <Text style={styles.contentArticle} numberOfLines={2}>Xin chào các cư dân, ngày 15-02-2024 sẽ bảo trì thang máy số 2. Kính mong quý cư dư thông cảm, thông tin chi tiết xin liên hệ hotline 08734682347</Text>
          </Card.Content>
        </Card>

        <Card style={styles.cardArticle}>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{height:150}}/>
          <Card.Content>
            <Text style={styles.tittleArticle} >Thông báo bảo trì thang máy</Text>
            <Text style={styles.contentArticle} numberOfLines={2}>Xin chào các cư dân, ngày 15-02-2024 sẽ bảo trì thang máy số 2. Kính mong quý cư dư thông cảm, thông tin chi tiết xin liên hệ hotline 08734682347</Text>
          </Card.Content>
        </Card>
      </View>
        <Button onPress={pickImage}>Upload ảnh</Button>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
        )}



      </View>
      


      <Loading />

    </ScrollView>


  )

};


const styles = StyleSheet.create({
  container: {
  },
  header: {
    height: 145
  },
  body: {
    backgroundColor: '#f0f5f7',
    marginTop: -15,
    borderRadius: 15,
    padding: 10,
    paddingTop: 15
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: 30,
    borderRadius: 10,
  },
  cardInfor: {
    marginTop: -15,
  },
  menu: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'

  },
  tienIch: {
    display: 'flex',
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: 'wrap',
    alignItems: 'flex-start',

  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFE0',
    margin: 10,
  },
  tittle: {
    fontWeight: '600', fontSize: 16, marginTop: 10
  },
  cardArticle: {
    margin: 15
  },
  tittleArticle: {
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    fontWeight: '600'
  },
  contentArticle: {
    fontSize: 15,

  }


});

{/* <View style={{ marginTop: 15 }}>
          
          <Text>Dịch vụ tòa nhà</Text>

          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

              <Card style={{
                width: 250, margin: 10, padding: 5, backgroundColor: 'white', shadowColor: 'black',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                <View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                  <IconButton icon='chat' />
                  <Text style={{ fontSize: 14 }}>Rửa xe 24h</Text>
                </View>

                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14 }}>100.000đ</Text>
                  <Button style={{ color: 'red' }} onPress={() => { }}>Đăng ký </Button>
                </View>
              </Card>


              <Card style={{
                width: 250, margin: 10, padding: 5, backgroundColor: 'white', shadowColor: 'black',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                <View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                  <IconButton icon='chat' />
                  <Text style={{ fontSize: 14 }}>Rửa xe 24h</Text>
                </View>

                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14 }}>100.000đ</Text>
                  <Button style={{ color: 'red' }} onPress={() => { }}>Đăng ký </Button>
                </View>
              </Card>


              <Card style={{
                width: 250, margin: 10, padding: 5, backgroundColor: 'white', shadowColor: 'black',
                shadowOffset: { width: 1, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                <View style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginLeft: -10 }}>
                  <IconButton icon='chat' />
                  <Text style={{ fontSize: 14 }}>Rửa xe 24h</Text>
                </View>

                <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 14 }}>100.000đ</Text>
                  <Button style={{ color: 'red' }} onPress={() => { }}>Đăng ký </Button>
                </View>
              </Card>
            </ScrollView>
          </View>

        </View> */}