import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import Background from '../../components/Background'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import { theme } from '../../core/theme'
import { useDispatch, useSelector } from 'react-redux';
import { UserApi } from '../../core/APIs/UserApi'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../config/firebase'



export default function ChangePasswordScreen({ navigation }) {

  const profile = useSelector((state) => state.personalInfor);


  const [selectedImage, setSelectedImage] = React.useState(null);
  const pickImage = async () => {

    const token = await AsyncStorage.getItem('token');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Đường dẫn hình ảnh:', result.assets[0].uri);

      setSelectedImage(result.assets[0].uri)

      const formData = new FormData();
      formData.append('avatar', {
        uri: result.assets[0].uri,
        name: 'userProfilSang.jpg',
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

  const [inforPassword, setInforPassword] = React.useState({
    old_password: '',
    new_password: '',
  });

  const handleChangePassword = (name) => (value) => {
    setInforPassword({ ...inforPassword, [name]: value });
  };

  const onConfirmPressed = async () => {

    const token = await AsyncStorage.getItem('token');
    const res = await UserApi.getUser(token)
    const user = res.data
    try {
      const res = await UserApi.changePassword(inforPassword, token)
      if (res.status == 200) {
        Alert.alert("Cập nhật mật khẩu thành công", "Thành công")
        console.log(user.email + inforPassword.new_password + user.last_name + user.avatar)
        onHandleSignup(user.email, user.email, user.first_name, user.avatar)

        setTimeout(async () => {

          console.log(user.email+inforPassword.new_password)
          await signInWithEmailAndPassword(auth, user.email, user.email)
            .then(() => console.log("Login success firebase"))
            .catch((err) => Alert.alert("Login error", err.message))
            .finally(() => {
              navigation.navigate('HomeScreen')
            });

        }, 1000)
      } else
        Alert.alert("Mật khẩu cũ không khớp", "Thất bại")

    } catch (error) {
      Alert.alert("Mật khẩu cũ không khớp", "Thất bại")
    }
  }

  const onHandleSignup = async (email, password, name, avatar) => {
    console.log('email' + email + password)
    if (email !== '' && password !== '') {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: `${name}`,
            photoURL: `${avatar}`
          }).then(() => {
            console.log('Signup success');
          }).catch((err) => {
            console.log('Failed to update profile', err);
          });
        })
        .catch((err) => Alert.alert("Signup errr", err.message));
    }
  };

  return (

    <Background>
      <Header>Đổi mật khẩu</Header>

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
          onPress={pickImage}
          style={styles.button}
        >
        </Button>
      </View>
      <TextInput
        label="Mật khẩu cũ"
        value={inforPassword.old_password}
        onChangeText={handleChangePassword('old_password')}
        autoCapitalize="none"
      />
      <TextInput
        label="Mật khẩu mới"
        value={inforPassword.new_password}
        onChangeText={handleChangePassword('new_password')}
        secureTextEntry
      />

      <Button mode="contained" onPress={onConfirmPressed}>
        Xác nhận
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  containerAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    position: 'relative',
    marginBottom: 10,
  },
  button: {
    position: 'absolute',
    right: -150,
    bottom: -5,
    fontSize: 30
  },
})
