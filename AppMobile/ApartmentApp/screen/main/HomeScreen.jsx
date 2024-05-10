// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function Home() {
//   return (
//     <View style={styles.container}>
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
    
//   },
// });


import * as React from 'react';
import { View , ImageBackground, Text, ScrollView, Image} from 'react-native';
import { Appbar, Card, Title, Paragraph, Button , Avatar, List, IconButton} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Menu = [
    {
        name: 'Thanh toán',
        avatar:  <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-invoice.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />
    }, 
    {
        name: 'Dịch vụ',
        avatar: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-bill.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />
    },{
        name: 'Phản ánh',
        avatar: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-phananh.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />
    },{
        name: 'Tiện ích',
        avatar: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\icon-bill.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />
    },
]


const TienIch =[
    {
        name:'Thông tin covid', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\covid.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Khai báo y tế', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\injection.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Hotline', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\hotline.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Góp ý', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\mailbox.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Thông tin covid', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\covid.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Thông tin covid', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\covid.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Thông tin covid', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\covid.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover"
      />

    },
    {
        name:'Thông tin covid', 
        image: <Image
        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\covid.png')}
        style={{ width: 38, height: 38, borderRadius:5, margin:5 }}
        resizeMode="cover" 
      />

    },
    
]
export default HomeScreen = () => (
    <View style={styles.container} >
        <View style={styles.header}>
             <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
                <Card.Title style={styles.card}
                            title="Mr.Sang Tower"
                            titleStyle={{ fontSize: 14, fontWeight:'bold', color:'white', marginLeft:-10}}
                            left={(props) => <Avatar.Image size={35} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\logo.png')} />}
                />

                <Card.Title style={styles.cardInfor}
                            title="Trần Minh Bảo Long"
                            subtitle='B103 - Thành viên'
                            titleStyle={{ fontSize: 16,fontWeight:'bold',color:'white'}}
                            subtitleStyle={{fontSize:12, color:'white', marginTop:-5}}
                />
             </ImageBackground>
        </View>

        <View style = {styles.body}>
            <View style={styles.menu}>
                {Menu.map(c=> <View id={c.name} style={{ alignItems: 'center',width:'25%', paddingBottom:10 }}>
                         {c.avatar}
                         <Text>{c.name}</Text>
                </View>)}
            </View>


            <View style={styles.alert}>
                <Button icon="bell"  size={25}>Có 3 lời nhắc</Button>
                <Button onPress={() => {}}>Xem thêm </Button>
            </View>

            <View>
                <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}>
                    <Image
                        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
                        style={{ borderRadius:5, margin:5 }}
                    />

                    <Image
                    source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
                    style={{ borderRadius:5, margin:5 }}
                    />

                    <Image
                        source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
                        style={{ borderRadius:5, margin:5 }}
                    />

                    <Image
                    source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner-1.png')}
                    style={{ borderRadius:5, margin:5 }}
                    />
                </ScrollView>
            </View>
          
             <View style={styles.tienIch}>
                {TienIch.map(c=> <View id={c.name} style={{ alignItems: 'center',width:'25%', paddingBottom:10 }}>
                         {c.image}
                         <Text>{c.name}</Text>
                </View>)}
             </View>

             <View style={{marginTop:15}}>
                    <Text>Dịch vụ tòa nhà</Text>
                    <View>
                        <ScrollView  horizontal={true}  showsHorizontalScrollIndicator={false}>

                        <Card style={{width:250,margin:10,padding:5, backgroundColor:'white', shadowColor: 'black',
                                                    shadowOffset: { width: 1, height: 2 },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,                                                         
                                                    elevation: 5, }}>
                            <View style={{display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', marginLeft:-10}}>
                                <IconButton  icon='chat'/>
                                <Text style={{fontSize:14}}>Rửa xe 24h</Text>
                            </View>                         
                            
                            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:14}}>100.000đ</Text>
                                <Button style={{color:'red'}} onPress={() => {}}>Đăng ký </Button>
                            </View>
                        </Card>


                        <Card style={{width:250,margin:10,padding:5, backgroundColor:'white', shadowColor: 'black',
                                                    shadowOffset: { width: 1, height: 2 },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,                                                         
                                                    elevation: 5, }}>
                            <View style={{display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', marginLeft:-10}}>
                                <IconButton  icon='chat'/>
                                <Text style={{fontSize:14}}>Rửa xe 24h</Text>
                            </View>                         
                            
                            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:14}}>100.000đ</Text>
                                <Button style={{color:'red'}} onPress={() => {}}>Đăng ký </Button>
                            </View>
                        </Card>


                        <Card style={{width:250,margin:10,padding:5, backgroundColor:'white', shadowColor: 'black',
                                                    shadowOffset: { width: 1, height: 2 },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,                                                         
                                                    elevation: 5, }}>
                            <View style={{display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', marginLeft:-10}}>
                                <IconButton  icon='chat'/>
                                <Text style={{fontSize:14}}>Rửa xe 24h</Text>
                            </View>                         
                            
                            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:14}}>100.000đ</Text>
                                <Button style={{color:'red'}} onPress={() => {}}>Đăng ký </Button>
                            </View>
                        </Card>
                        </ScrollView>
                    </View>

             </View>

             <View style={{marginTop:15}}>
                    <Text>Dịch vụ tòa nhà</Text>
                    <View>
                        <ScrollView  horizontal={true}  showsHorizontalScrollIndicator={false}>

                        <Card style={{width:250,margin:10,padding:5, backgroundColor:'white', shadowColor: 'black',
                                                    shadowOffset: { width: 1, height: 2 },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,                                                         
                                                    elevation: 5, }}>
                            <View style={{display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', marginLeft:-10}}>
                                <IconButton  icon='chat'/>
                                <Text style={{fontSize:14}}>Rửa xe 24h</Text>
                            </View>                         
                            
                            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:14}}>100.000đ</Text>
                                <Button style={{color:'red'}} onPress={() => {}}>Đăng ký </Button>
                            </View>
                        </Card>


                        <Card style={{width:250,margin:10,padding:5, backgroundColor:'white', shadowColor: 'black',
                                                    shadowOffset: { width: 1, height: 2 },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,                                                         
                                                    elevation: 5, }}>
                            <View style={{display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', marginLeft:-10}}>
                                <IconButton  icon='chat'/>
                                <Text style={{fontSize:14}}>Rửa xe 24h</Text>
                            </View>                         
                            
                            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:14}}>100.000đ</Text>
                                <Button style={{color:'red'}} onPress={() => {}}>Đăng ký </Button>
                            </View>
                        </Card>


                        <Card style={{width:250,margin:10,padding:5, backgroundColor:'white', shadowColor: 'black',
                                                    shadowOffset: { width: 1, height: 2 },
                                                    shadowOpacity: 0.25,
                                                    shadowRadius: 3.84,                                                         
                                                    elevation: 5, }}>
                            <View style={{display:'flex', justifyContent:'flex-start', flexDirection:'row', alignItems:'center', marginLeft:-10}}>
                                <IconButton  icon='chat'/>
                                <Text style={{fontSize:14}}>Rửa xe 24h</Text>
                            </View>                         
                            
                            <View style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
                                <Text style={{fontSize:14}}>100.000đ</Text>
                                <Button style={{color:'red'}} onPress={() => {}}>Đăng ký </Button>
                            </View>
                        </Card>
                        </ScrollView>
                    </View>

             </View>
        </View>
  </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        flex:2,
    },
    body:{
        flex:9,
        backgroundColor:'white',
        marginTop:-15,
        borderRadius:15,
        padding:10,
        paddingTop:20
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        height:30,
        borderRadius: 10,
      },
      cardInfor:{
        marginTop:-15,
      },
      menu:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-start",
        flexWrap:'wrap',
        alignItems:'flex-start',
        borderBottomWidth:1,
        borderBottomColor:'#eee'

      },
      tienIch:{
        display:'flex',
        flexDirection:"row",
        justifyContent:"flex-start",
        flexWrap:'wrap',
        alignItems:'flex-start',

      },
      alert: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFE0',
        margin: 10,
      },
      title: {
        fontSize: 14,
      },
   
});