import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton, Icon, Switch } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import TextInput from '../../components/TextInput';
import { useSelector } from 'react-redux';
import { UserApi } from '../../core/APIs/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default AccountDetailSreen = ({ navigation }) => {

    const profile = useSelector((state) => state.personalInfor);

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const [userInfor, setUserInfor] = React.useState({
        last_name: profile.last_name,
        first_name: profile.first_name,
        email: profile.email,
        phone: profile.phone,
    });

    const [inforPassword, setInforPassword] = React.useState({
        old_password: '',
        new_password: '',
    });

    const handleChangeInfor = (name) => (value) => {
        setUserInfor({ ...userInfor, [name]: value });
    };

    const handleChangePassword = (name) => (value) => {
        setInforPassword({ ...inforPassword, [name]: value });
    };

    const updatePassword = async () => {
        const token = await AsyncStorage.getItem('token');
        try {

            const res = await UserApi.changePassword(inforPassword, token)
            if (res.status == 200) {
                Alert.alert("Đã cập nhật thông tin thành công", "Thành công")
                navigation.navigate('Tài khoản')
            } else if (res.status == 204)
                Alert.alert("Mật khẩu cũ không khớp", "Thất bại")

        } catch (error) {
            Alert.alert("Mật khẩu cũ không khớp", "Thất bại")
        }
    };

    const updateInfor = async () => {
        const token = await AsyncStorage.getItem('token');
        try {

            const res = await UserApi.updateInfor(profile.id, userInfor, token)
            if (res.status == 200) {
                Alert.alert("Đã cập nhật thông tin thành công", "Thành công")
                navigation.navigate('Tài khoản')

            }
        } catch (error) {
            Alert.alert("Cập nhật thất bại", "Thất bại")
        }
    };

    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <Avatar.Image size={85} source={{ uri: profile.avatar }}
                />
                <Text style={styles.username}>{profile.first_name + " " + profile.last_name}</Text>

            </View>
            <View style={styles.body}>
                <Text>Username</Text>
                <TextInput editable={false}>{profile.username}</TextInput>

                <Text>Họ</Text>
                <TextInput value={userInfor.last_name} onChangeText={handleChangeInfor('last_name')} />

                <Text>Tên</Text>
                <TextInput value={userInfor.first_name} onChangeText={handleChangeInfor('first_name')} />

                <Text>Email</Text>
                <TextInput value={userInfor.email} onChangeText={handleChangeInfor('email')} />

                <Text>Số điện thoại </Text>
                <TextInput value={userInfor.phone} onChangeText={handleChangeInfor('phone')} />
                <View style={styles.changePW}>
                    <Text>Thay đổi mật khẩu</Text>
                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                </View>

                <TextInput label="Mật khẩu cũ" value={inforPassword.old_password} onChangeText={handleChangePassword('old_password')}></TextInput>
                <TextInput label="Mật khẩu mới" value={inforPassword.new_password} onChangeText={handleChangePassword('new_password')}></TextInput>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={updateInfor}>
                        <Text style={styles.confirm}>Cập nhập thông tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={updatePassword} disabled={!isSwitchOn} >
                        <Text style={{ ...styles.confirm, backgroundColor: isSwitchOn ? 'blue' : 'gray' }}>Cập nhật mật khẩu</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </ScrollView>
    );
}


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
        marginTop: -20
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
    changePW: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center'
    }
});