import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, List, Searchbar } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import navigation from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import { BillApis } from '../../core/APIs/BillAPIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CabinetAPIs } from '../../core/APIs/CabinetAPIs';

const FirstRoute = () => {
    const navigation = useNavigation();

    const [items, setItems] = React.useState([])

    const loadItems = async (status) => {
        const token = await AsyncStorage.getItem('token')
        try {
            const res = await CabinetAPIs.getItemByStatus({ status: 'pending' }, token)
            setItems(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        loadItems()
    }, [])


    return (
        <ScrollView style={[styles.scene, {}]}>

            {items.map(c =>
                <TouchableOpacity onPress={() => { navigation.navigate('ItemDetailScreen', { item:c }) }}>
                    <List.Item
                        title={c?.item_name}
                        description={`${c?.created_date ?? '15-02-2024'}\n Chưa nhận`}
                        style={{}}

                        left={props => <List.Icon {...props} icon="bank-transfer" />}
                        right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Chi tiết</Text>}
                    />
                </TouchableOpacity>
            )}

        </ScrollView>
    )

};
const SecondRoute = () => {
    const navigation = useNavigation();

    const [items, setItems] = React.useState([])

    const loadItems = async (status) => {
        const token = await AsyncStorage.getItem('token')
        try {
            const res = await CabinetAPIs.getItemByStatus({ status: 'received' }, token)
            setItems(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        loadItems()
    }, [])


    return (
        <ScrollView style={[styles.scene, {}]}>

            {items.map(c =>
                <TouchableOpacity onPress={() => { navigation.navigate('ItemDetailScreen', { item:c }) }}>
                    <List.Item
                        title={c?.item_name}
                        description={`${c?.created_date ?? '15-02-2024'}\n Đã nhận`}
                        style={{}}

                        left={props => <List.Icon {...props} icon="bank-transfer" />}
                        right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Chi tiết</Text>}
                    />
                </TouchableOpacity>
            )}

        </ScrollView>
    )
};





export default class TabViewCabinet extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Hàng chưa nhận' },
            { key: 'second', title: 'Hàng đã nhận' },

        ],
    };

    render() {
        return (
            <React.Fragment >
                <View style={styles.search}>
                    <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
                        <Searchbar
                            placeholder="Tìm kiếm hàng theo tên"
                            onChangeText={() => { }}
                            value={""}
                            style={{ width: '80%', height: 50 }}

                        />
                    </ImageBackground>
                </View>
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        first: FirstRoute,
                        second: SecondRoute,
                    })}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    style={styles.containerTab}
                />
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex'
    },
    containerTab: {
        flex: 7
    },
    scene: {
        flex: 2,
    },
    search: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});