import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback
} from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  doc,
  setDoc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, database } from '../../config/firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../../colors';
import { useSelector } from 'react-redux';
import { IconButton } from 'react-native-paper';


export default function Chat() {

  const route = useRoute();
  const userRole = useSelector(state => state.personalInfor.role);
  const { meID = auth.currentUser.email, contactID = 'quanlychungcu@gmail.com', nameContact } = route.params || {};
  const formatEmail = (email = "") => email.replace(/\./g, '_');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [chatId, setChatId] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userRole == 'Cư Dân' ? 'Quản lý chung cư' : nameContact,
      headerLeft: () => (
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => userRole == 'Cư Dân'?navigation.goBack():navigation.navigate('HomeChat')}
        />
      ),
    });
  }, [navigation]);


  useEffect(() => {
    console.log(contactID,meID,nameContact)
  }, [])
  useLayoutEffect(() => {
    const chat = formatEmail(meID) < formatEmail(contactID) ? `${formatEmail(meID)}-${formatEmail(contactID)}` : `${formatEmail(contactID)}-${formatEmail(meID)}`;

    const collectionRef = collection(database, chat);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsusbscribe');
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user
        }))
      );
    });
    return unsubscribe;
  }, []); // Thay đổi dependency array để chỉ bao gồm chatId


  const addDocToWhoMessagetoAdmin = async (messageContent = 'None') => {
    const docRef = doc(database, "whoMessageToManager", auth?.currentUser?.email);
    await setDoc(docRef, {
      email: auth?.currentUser?.email,
      isRead: true,
      lastMessage: messageContent,
      avatar: auth?.currentUser?.photoURL ?? 'Undefined avatar',
      name: auth?.currentUser?.displayName ?? 'Undefined name',

    }, { merge: true });
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    // setMessages([...messages, ...messages]);
    const { _id, createdAt, text, user } = messages[0];
    const chat = formatEmail(meID) < formatEmail(contactID) ? `${formatEmail(meID)}-${formatEmail(contactID)}` : `${formatEmail(contactID)}-${formatEmail(meID)}`;
    addDoc(collection(database, chat), {
      _id,
      createdAt,
      text,
      user
    });

    addDocToWhoMessagetoAdmin(text);
  }, []);

  return (
   
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      showUserAvatar={false}
      onSend={messages => onSend(messages)}
      messagesContainerStyle={{
        backgroundColor: '#fff'
      }}
      textInputStyle={{
        backgroundColor: '#fff',
        borderRadius: 20,
      }}
      user={{
        _id: auth?.currentUser?.email,
        avatar: auth?.currentUser?.photoURL
      }}
    />
  );
}

