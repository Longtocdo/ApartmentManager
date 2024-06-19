import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton, Modal, TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../core/redux/reducers/inforReducer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker'
import { UserApi } from '../../core/APIs/UserApi';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default AccountSreen = ({ navigation }) => {

    const profile = useSelector((state) => state.personalInfor);
    const dispatch = useDispatch();
    const logoutOnPress = async () => {
        dispatch(userActions.logout())
        navigation.navigate('LoginScreen')
    }

    const pickImage = async () => {

        const token = await AsyncStorage.getItem('token');

        console.log(token)
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            console.log('Đường dẫn hình ảnh:', result.assets[0].uri);

            const formData = new FormData();
            formData.append('id', '1'); //TODO
            formData.append('avatar', {
                uri: result.assets[0].uri,
                name: 'userProfile.jpg',
                type: 'image/jpge',
            });

            try {
                await UserApi.uploadAvatar(profile.id, formData, token)
                    .then(function (response) {
                        console.log(' Upload avatar thanh cong')
                    })
                    .catch(function (response) {
                        console.log('Upload avatar that bai')
                    });;

            } catch (error) {
                console.log('Lỗi upload')
            }
        }
    };

    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <View style={styles.containerAvatar}>
                    <Avatar.Image
                        size={80}
                        source={{ uri: profile.avatar }}
                        style={styles.avatar}
                    />
                    <Button
                        icon={() => (
                            <Icon
                                name="pencil"
                                size={35}
                                color="purple"
                            />
                        )}
                        onPress={pickImage}
                        style={styles.button}
                    >
                    </Button>
                </View>
                <Text style={styles.username}>{profile.first_name + " " + profile.last_name}</Text>

            </View>
            <View style={styles.body}>
                <View style={styles.settingItem}>
                    <Text style={styles.title}>Cài đặt</Text>
                    <View style={styles.containerItem}>
                        <TouchableOpacity onPress={() => { navigation.navigate('AccountDetailSreen') }} style={styles.item}>
                            <Button icon="credit-card" size={25}>Thông tin và bảo mật</Button>
                            <Button>Xem thêm </Button>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                            <Button icon="credit-card" size={25}>Thông tin phòng</Button>
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
                            <Button icon="credit-card" size={25}>Phản ánh</Button>
                            <Button>Xem thêm</Button>
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
                        <TouchableOpacity onPress={() => { console.log('ádf') }} style={styles.item}>
                            <Button icon="credit-card" size={25}>Dịch vụ</Button>
                            <Button>Xem thêm </Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: 'white', margin: 20, borderRadius: 10 }}>
                <Button onPress={logoutOnPress}>Đăng xuất</Button>

            </TouchableOpacity>
        </ScrollView>
    )
};


const styles = StyleSheet.create({
    container: {
    },
    header: {
        marginTop: 50,
        height: 160,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    body: {
        backgroundColor: '#f0f5f7',
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
    },
    containerAvatar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        position: 'relative',
        marginBottom: 10,
    },
    button: {
        position: 'absolute',
        left: 35,
        bottom: 12,
        fontSize: 30
    },
});