import React, { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../../components/Background'
import Logo from '../../components/Logo'
import Header from '../../components/Header'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import BackButton from '../../components/BackButton'
import { theme } from '../../core/theme'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../core/redux/reducers/inforReducer'
import axios from 'axios'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { UserApi } from '../../core/APIs/UserApi'
import {  getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native'


export default function LoginScreen({ navigation }) {

  
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none'
      }
    });
    return () => {
      navigation.getParent() ?.setOptions({
        tabBarStyle: {
          display: 'flex',
        }
      });
    }
  }, [])
  const profile = useSelector((state) => state.personalInfor);

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const dispatch = useDispatch()

  const onLoginPressed = () => {

    dispatch(userActions.login(email.value, password.value)).then(async (data) => {
      console.log("Login success, status code ", data);

      const res = await UserApi.getUser(data)

      if (res.data.is_first_login == true)
        navigation.navigate('ChangePasswordScreen')
      else {
        if (true) {
          signInWithEmailAndPassword(auth,res.data.email, res.data.email)
            .then(() => console.log("Login success firebase"))
            .catch((err) => Alert.alert("Login error", err.message));
        }
        navigation.navigate("HomeScreen")
      }
    }).catch((error) => {
      Alert.alert('Đăng nhập thất bại', 'Username hoặc mật khẩu không đúng')
    })
  }



  const [user, setUser] = React.useState({});
  const fields = [{
    "label": "Tên đăng nhập",
    "icon": "account",
    "name": "username"
  }, {
    "label": "Mật khẩu",
    "icon": "eye",
    "name": "password",
    "secureTextEntry": true
  }];


  const updateSate = (field, value) => {
    setUser(current => {
      return { ...current, [field]: value }
    });
  }


  return (

    <Background>
      {/* <BackButton goBack={navigation.goB} /> */}
      <BackButton goBack={() => { }} />
      <Logo />
      <Header>Welcome back</Header>
      <TextInput
        label="Username or email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
