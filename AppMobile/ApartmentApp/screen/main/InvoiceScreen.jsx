// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function Home() {
//   return (
//     <View style={styles.container}>
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
    
//   },
// });


import * as React from 'react';
import { View , ImageBackground, Text, ScrollView, Image} from 'react-native';
import { Appbar, Card, Title, Paragraph, Button , Avatar, List, IconButton} from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';






export default InvoiceScreen = () => (
    <View style={styles.container} >
        <View style={styles.header}>
             
        </View>

        <View style = {styles.body}>
          
        </View>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header:{
        flex:2,
        backgroundColor:'lightblue'
    },
    body:{
        flex:9,
        backgroundColor:'red',
        marginTop:-15,
        borderRadius:15,
        padding:10,
        paddingTop:20
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    card: {
        width: '100%',
        height:30,
        borderRadius: 10,
      },
      cardInfor:{
        marginTop:-15,
      },
      menu:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-start",
        flexWrap:'wrap',
        alignItems:'flex-start',
        borderBottomWidth:1,
        borderBottomColor:'#eee'

      },
      tienIch:{
        display:'flex',
        flexDirection:"row",
        justifyContent:"flex-start",
        flexWrap:'wrap',
        alignItems:'flex-start',

      },
      alert: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFE0',
        margin: 10,
      },
      title: {
        fontSize: 14,
      },
   
});