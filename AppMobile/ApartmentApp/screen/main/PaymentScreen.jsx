import * as React from 'react';
import { View, StyleSheet, Dimensions,Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import {List, Searchbar } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { BillApis } from '../../core/APIs/BillAPIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FirstRoute = () => {
    const navigation = useNavigation();

    const [payedBill, setPayedBill] = React.useState([])

    const loadBill = async (status) => {
        try {
            const token = await AsyncStorage.getItem('token')

            const res = await BillApis.getBill({ 'status': status }, token,1)
            setPayedBill(res.data.results)
        } catch (error) {
            console.log(error)
        } 
    }

    React.useEffect(() => {
        loadBill('unpayed')
    }, [])

    return (
        <ScrollView style={[styles.scene, {}]}>
            {payedBill.map(c =>
                <TouchableOpacity onPress={() => { navigation.navigate('PaymentDetailScreen', { billId: c.id, isPayed: c?.status == "Thành công" ? true : false, paymentMethod: c?.payment_method }) }}>
                    <List.Item
                        title={c?.fee?.fee_name}
                        description={`${c?.fee?.created_date ?? '15-02-2024'}\n Chưa thanh toán`}
                        style={{}}

                        left={props => <List.Icon {...props} icon="bank-transfer" />}
                        right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Thanh toán</Text>}
                    />
                </TouchableOpacity>
            )}
        </ScrollView>
    )
};

const SecondRoute = () => {
    const navigation = useNavigation();

    const [payBill, setPayBill] = React.useState([])

    const loadBill = async (status) => {
        try {

            const token = await AsyncStorage.getItem('token')
            const res = await BillApis.getBill({ 'status': status }, token)

            setPayBill(res.data.results)
        } catch (error) {
            console.log(error)
        } 
    }

    React.useEffect(() => {
        loadBill('payed')
    }, [])

    return (
        <ScrollView style={[styles.scene,]}>
            {payBill.map((c) =>
                <TouchableOpacity onPress={() => { navigation.navigate('PaymentDetailScreen', { billId: c.id, isPayed: c?.status == "Thành công" ? true : false, paymentMethod: c?.payment_method }) }}>
                    <List.Item
                        title={c?.fee?.fee_name}
                        description={() => (
                            <View>
                                <Text >{c?.payment_date}</Text>
                                <Text style={{ color: 'green' }}>Đã thanh toán</Text>
                            </View>
                        )}
                        left={props => <List.Icon {...props} icon="bank-transfer" />}
                        right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>{`${c?.fee?.price?.toLocaleString('vi-VN') + 'đ'}`}</Text>}
                    />
                </TouchableOpacity>
            )}
        </ScrollView>
    )
};

export default class TabViewPayment extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Chưa thanh toán' },
            { key: 'second', title: 'Đã thanh toán' },

        ],
    };

    render(
    ) {
        return (
            <React.Fragment >
                <View style={styles.search}>
                    <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
                        <Searchbar
                            placeholder="Tìm kiếm hóa đơn"
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