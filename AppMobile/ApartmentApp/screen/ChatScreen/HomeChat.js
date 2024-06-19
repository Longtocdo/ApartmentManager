import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import colors from '../../colors';
import { auth, database } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Avatar, Badge,  List, Searchbar } from "react-native-paper";


export default function HomeChat  ()  {

    const navigation = useNavigation();

    const [listUsers, setListUsers] = useState([])

    const getListOfUsersWhoMessagedManager= async () => {
        const messagesRef = collection(database, "whoMessageToManager");
        const querySnapshot = await getDocs(messagesRef);
        const listInfor = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().email) {
                listInfor.push({ email: doc.data().email, lastMessage: doc.data().lastMessage, isRead: doc.data().isRead, name: doc.data().name, avatar: doc.data().avatar }); // Thêm email vào danh sách
            }
        });
        setListUsers(listInfor)
    };

    useEffect(() => {
        getListOfUsersWhoMessagedManager()
    }, [])

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.search}>
                        <Searchbar
                            placeholder="Tìm kiếm"
                            onChangeText={() => { }}
                            value={""}
                            style={{ width: '80%', height: 50 }}
                        />
                </View>
                <View style={styles.body}>
                    {
                        listUsers.map(u =>
                            <TouchableOpacity onPress={() => navigation.navigate("Chat", { meID: auth?.currentUser?.email, contactID: u.email, nameContact:u?.name })}
                            >
                                <List.Item
                                    key={u.email}
                                    title={u.name}
                                    description={u.lastMessage}
                                    descriptionStyle={{ fontSize: 14, color: 'black', fontWeight: u.isRead ? '800' : '600' }}
                                    style={styles.item}
                                    left={props => <View style={{ position: 'relative' }}>
                                        <Avatar.Image size={60} source={{ uri: u.avatar }} />
                                        <Badge
                                            style={{ position: 'absolute', top: 0, right: 0 }}
                                            size={16} 
                                        />
                                    </View>}
                                    right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Nhắn tin</Text>}
                                />
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        display: 'flex',
    },
    search: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        backgroundColor:'lightblue',
        padding:20,
        paddingTop:60,
        marginTop:-10
    },
    body: {
        flexGrow: 1,
    },
    item: {
        margin: 10,
    },
    chatButton: {
        backgroundColor: colors.primary,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .9,
        shadowRadius: 8,
        marginRight: 20,
        marginBottom: 50,
    }
});