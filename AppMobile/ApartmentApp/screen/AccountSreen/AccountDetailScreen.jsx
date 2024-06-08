import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton, Icon, Switch } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import TextInput from '../../components/TextInput';



export default AccountDetailSreen = ({ navigation }) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return(
    <ScrollView style={styles.container} >
        <View style={styles.header}>
            <Avatar.Image size={80} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\avatar_hieu.png')} />
            <Text style={styles.username}>Lê Văn Hiếu</Text>
            <Text>hieu@gmail.com</Text>

        </View>
        <View style={styles.body}>
            <Text>Username</Text>
            <TextInput >Username</TextInput>

            <Text>Tên</Text>
            <TextInput>Nguyễn Minh Sang</TextInput>

            <Text>Email</Text>
            <TextInput >msang.nms@gmial.com</TextInput>

            <Text>Số điện thoại </Text>
            <TextInput>03874689268</TextInput>
            <View style={styles.changePW}>
                <Text>Thay đổi mật khẩu</Text>
                <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
            </View>

            <TextInput>Mật khẩu cũ</TextInput>
            <TextInput >Mật khẩu mới</TextInput>

            <TouchableOpacity>
                <Text style={styles.confirm}>Thay đổi cập nhật</Text>
            </TouchableOpacity>

        </View>

    </ScrollView>
);}


const styles = StyleSheet.create({
    container: {
    },
    header: {
        marginTop: 20,
        height: 150,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    body: {
        backgroundColor: '#f0f5f7',
        borderRadius: 15,
        padding: 15,
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
    title: {
        fontSize: 20,
        fontWeight: '600',
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
    changePW:{
        display:'flex',
        flexDirection:"row",
        alignItems:'center'
    }





});