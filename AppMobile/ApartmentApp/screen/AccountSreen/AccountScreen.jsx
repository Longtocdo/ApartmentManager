import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton, Icon } from 'react-native-paper';
import { StyleSheet } from 'react-native';


const SETTING = [
    {
        icon :'credit-card',
        name:'',
    }
]



export default AccountSreen = ({ navigation }) => (
    <ScrollView style={styles.container} >
        <View style={styles.header}>
            <Avatar.Image size={80} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\avatar_hieu.png')} />
            <Text style={styles.username}>Lê Văn Hiếu</Text>
            <Text>hieu@gmail.com</Text>

        </View>
        <View style={styles.body}>
            <View style={styles.settingItem}>
                <Text style={styles.title}>Cài đặt</Text>
                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Có 3 lời nhắc</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Có 3 lời nhắc</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Có 3 lời nhắc</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>

                </View>

            </View>

            <View style={styles.settingItem}>
                <Text style={styles.title}>Trợ giúp</Text>
                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Trung tâm trợ giúp</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Hotline</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Có 3 lời nhắc</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>

                </View>

            </View>

            <View style={styles.settingItem}>
                <Text style={styles.title}>Tiện ích</Text>
                <View style={styles.containerItem}>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Thanh toán hóa đơn</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                        <Button icon="credit-card" size={25}>Lịch sử giao dịch</Button>
                        <Button>Xem thêm </Button>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        <TouchableOpacity style={{backgroundColor:'white', margin:20,borderRadius:10}}>
        <Button onPress={()=>navigation.navigate('Đăng nhập')}>Dăng xuất</Button>

        </TouchableOpacity>
    </ScrollView>
);


const styles = StyleSheet.create({
    container: {
    },
    header: {
        marginTop: 50,
        height: 200,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    body: {
        backgroundColor: '#f0f5f7',
        marginTop: -15,
        borderRadius: 15,
        padding: 15,
        paddingTop: 15
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingItem: {

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        margin: 15
    },
    containerItem: {
        backgroundColor: 'white',
        borderRadius: 15,
    }




});