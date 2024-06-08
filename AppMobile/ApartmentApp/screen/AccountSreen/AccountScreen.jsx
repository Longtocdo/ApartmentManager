import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { userActions } from '../../core/redux/reducers/inforReducer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SETTING = [
    {
        icon: 'credit-card',
        name: '',
    }
]


export default AccountSreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const logoutOnPress = async () => {
        await dispatch(userActions.logout())

        navigation.navigate('Đăng nhập')
    }
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
            await axios.post("https://longtocdo107.pythonanywhere.com/users/5/upload_avatar/", formData, {
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

    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <View style={styles.containerAvatar}>
                    <Avatar.Image
                        size={80}
                        source={{ uri: selectedImage }}
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
                        onPress={() => console.log('Edit button pressed')}
                        style={styles.button}
                    >
                    </Button>
                </View>
                <Text style={styles.username}>Lê Văn Hiếu</Text>
                <Text>hieu@gmail.com</Text>

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
    },
    containerAvatar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatar: {
        position:'relative',
        marginBottom: 10,
      },
      button: {
        position:'absolute',
        left:35,
        bottom:12,
        fontSize:30
      },
});