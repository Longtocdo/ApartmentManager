import * as React from 'react';
import { View, ImageBackground, Text, ScrollView, Image } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, Avatar, List, IconButton, Icon } from 'react-native-paper';
import { StyleSheet } from 'react-native';





export default AccountSreen = ({ navigation }) => (
    <ScrollView style={styles.container} >
        <View style={styles.header}>
            <Avatar.Image size={80} source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\avatar_hieu.png')} />
            <Text style={styles.username}>Lê Văn Hiếu</Text>
            <Text>hieu@gmail.com</Text>
        
        </View>
        <View style={styles.body}>
            <View style={styles.setting}>
                    <Text>Account setting</Text>
                    <View>
                        
                    </View>
            </View>


        </View>
    </ScrollView>
);


const styles = StyleSheet.create({
    container: {
    },
    header: {
        marginTop:50,
        height: 200,
        display:'flex',
        justifyContent:'flex-start',
        alignItems:'center'
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
    username:{
        fontSize:18,
        fontWeight:'bold',
    },
    setting:{

    }
    
    


});