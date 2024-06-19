

import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import { ReportAPIs } from '../../core/APIs/ReportAPIs';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default RegisterPakingScreen = ({navigation }) => {

  const profile = useSelector((state) => state.personalInfor);


  const [tittle, setTittle] = React.useState('')
  const [content, setContent] = React.useState('')


  const confirmPress = async () => {
    try {

      const token = await AsyncStorage.getItem('token')
      const res = await ReportAPIs.setReport(token, {
        title: tittle,
        content: content
      })
      if (res.status == 201) {
        Alert.alert('Thành công', 'Gửi phản ánh thành công')
        navigation.navigate('HomeScreen')
      }
    } catch (error) {
      Alert.alert('Thất bại', 'Gửi phản ánh thất bại')
      console.log(error)
    }
  }
  return (
    <ScrollView >
      <View style={styles.container} >
        <View >
          <TextInput
            label="Chủ đề"
            returnKeyType="next"
            value={tittle}
            onChangeText={setTittle}
            style={styles.input}
          />
          <TextInput
            label="Nội dung phản ánh"
            value={content}
            onChangeText={setContent}
            multiline={true}
            numberOfLines={10}
            style={styles.input}
          />
        </View>
        <TouchableOpacity onPress={confirmPress}>
          <Text style={styles.confirm}>Gửi phản ánh</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
    height: 830,
  },
  input: {
    fontSize: 18,
    width: 400
  },
  confirm: {
    borderRadius: 15,
    padding: 14,
    fontSize: 20,
    backgroundColor: 'blue',
    color: 'white',
    position: 'relative',
    top: 380,
    right: 0,
    left: 0,
    textAlign: 'center',
    width: 300
  },
});