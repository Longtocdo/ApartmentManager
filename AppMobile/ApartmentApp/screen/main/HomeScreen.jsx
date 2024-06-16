

import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image } from 'react-native';
import { Card, Button, Avatar, } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux'
import Loading from '../../components/Loading';
import { auth } from '../../config/firebase';

const Menu = [
  {
    name: 'Thanh toán',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-invoice.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: 'PaymentScreen'

  },
  {
    name: 'Dịch vụ',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-bill.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ""
  }, {
    name: 'Phản ánh',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-phananh.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: 'ReportScreen'
  }, {
    name: 'Tủ đồ',
    avatar: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-bill.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: 'CabinetScreen'
  },
]

const TienIch = [
  {
    name: 'Sửa chửa',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\repair.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
  {
    name: 'Vận chuyển thang máy',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\elevator.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
  {
    name: 'Khảo sát',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\injection.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: 'SurveyScreen'
  },
  {
    name: 'Hotline',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\hotline.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
  {
    name: 'Góp ý',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\mailbox.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
  {
    name: 'Cho thuê/bán căn hộ',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\rent.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
  {
    name: 'Rửa xe',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\car_wash.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
  {
    name: 'Thi công',
    image: <Image
      source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\paint.png')}
      style={{ width: 38, height: 38, borderRadius: 5, margin: 5 }}
      resizeMode="cover"
    />,
    nav: ''
  },
]

export default HomeScreen = ({ navigation }) => {

  const profile = useSelector((state) => state.personalInfor);

  return (
    <ScrollView style={styles.container} >
      <View style={styles.header}>
        <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
          <Card.Title style={styles.card}
            title="Chưng cư Choncc"
            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginLeft: -10 }}
            left={(props) => <Avatar.Image size={40} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\logo.png')} />}
          />

          <Card.Title style={styles.cardInfor}
            title={`${profile.last_name} ${profile.first_name} `}
            subtitle={`Vai trò - ${profile.role}`}
            titleStyle={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}
            subtitleStyle={{ fontSize: 12, color: 'white', marginTop: -5 }}
          />
        </ImageBackground>
      </View>
      <View style={styles.body}>
        <View style={styles.menu}>
          {Menu.map(c => <View id={c.name} style={{ alignItems: 'center', width: '25%', paddingBottom: 10 }}>
            <TouchableOpacity onPress={() => { navigation.navigate(c.nav) }}>
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
          <Button
            onPress={() => navigation.navigate("Chat", { meID: auth?.currentUser?.email, contactID: 'quanlychungcu@gmail.com' })}
          >Nhắn với quản lý</Button>
          <View style={styles.tienIch}>

            {TienIch.map(c =>
              <TouchableOpacity onPress={() => navigation.navigate(c.nav)} id={c.name} style={{ alignItems: 'center', width: '25%', paddingBottom: 10 }} >
                {c.image}
                <Text>{c.name}</Text>
              </TouchableOpacity>)}
          </View>
        </View>

        <View>
          <Text style={styles.tittle}>Thông báo/bài viết</Text>
          <Card style={styles.cardArticle}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ height: 150 }} />
            <Card.Content>
              <Text style={styles.tittleArticle} >Thông báo bảo trì thang máy</Text>
              <Text style={styles.contentArticle} numberOfLines={2}>Xin chào các cư dân, ngày 15-02-2024 sẽ bảo trì thang máy số 2. Kính mong quý cư dư thông cảm, thông tin chi tiết xin liên hệ hotline 08734682347</Text>
            </Card.Content>
          </Card>

          <Card style={styles.cardArticle}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ height: 150 }} />
            <Card.Content>
              <Text style={styles.tittleArticle} >Thông báo bảo trì thang máy</Text>
              <Text style={styles.contentArticle} numberOfLines={2}>Xin chào các cư dân, ngày 15-02-2024 sẽ bảo trì thang máy số 2. Kính mong quý cư dư thông cảm, thông tin chi tiết xin liên hệ hotline 08734682347</Text>
            </Card.Content>
          </Card>

          <Card style={styles.cardArticle}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} style={{ height: 150 }} />
            <Card.Content>
              <Text style={styles.tittleArticle} >Thông báo bảo trì thang máy</Text>
              <Text style={styles.contentArticle} numberOfLines={2}>Xin chào các cư dân, ngày 15-02-2024 sẽ bảo trì thang máy số 2. Kính mong quý cư dư thông cảm, thông tin chi tiết xin liên hệ hotline 08734682347</Text>
            </Card.Content>
          </Card>
        </View>
      </View>
      <Loading />
    </ScrollView>
  )

};

const styles = StyleSheet.create({
  container: {
  },
  header: {
    height: 160
  },
  body: {
    backgroundColor: '#f0f5f7',
    marginTop: -10,
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
    marginBottom:-10
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
