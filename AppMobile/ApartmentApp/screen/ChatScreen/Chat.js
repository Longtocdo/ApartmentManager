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


export default function Chat() {

  const route = useRoute();
  const { meID ,contactID} = route.params;
  const formatEmail = (email="") => email.replace(/\./g, '_');
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const [chatId, setChatId] = useState('')

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10
          }}
          onPress={onSignOut}
        >
          <AntDesign name="logout" size={24} color={colors.gray} style={{ marginRight: 10 }} />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  

  useLayoutEffect(() => {
    const chat = formatEmail(meID) < formatEmail(contactID) ? `${formatEmail(meID)}-${formatEmail(contactID)}` : `${formatEmail(contactID)}-${formatEmail(meID)}`;
    console.log('sdfsadfs')
    
    console.log(chat)
    setChatId(chat)
  
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
  

  const addDocToWhoMessagetoAdmin = async (messageContent='None') => {
    const docRef = doc(database, "whoMessageToManager", auth?.currentUser?.email); 
    await setDoc(docRef, {
      email: auth?.currentUser?.email,
      isRead: true,
      lastMessage: messageContent,
      avatar:auth?.currentUser?.photoURL??'Undefined avatar',
      name:auth?.currentUser?.displayName??'Undefined name',

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

    addDocToWhoMessagetoAdmin('xinchao')
  }, []);

  return (
    // <>
    //   {messages.map(message => (
    //     <Text key={message._id}>{message.text}</Text>
    //   ))}
    // </>
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
        avatar: 'https://i.pravatar.cc/300'
      }}
    />
  );
}

