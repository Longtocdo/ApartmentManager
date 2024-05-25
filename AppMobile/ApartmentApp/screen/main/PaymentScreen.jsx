import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, List, Searchbar } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import navigation from '../../navigation';
import { useNavigation } from '@react-navigation/native';
const a = null;

const FirstRoute = () => {
    const navigation = useNavigation();
   return(
    <ScrollView style={[styles.scene, {}]}>
    <TouchableOpacity onPress={()=>{navigation.navigate('PaymentDetailScreen')}}>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={`15-02-2003 20:21\n Chưa thanh toán}`}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Thanh toán</Text>}
        />
    </TouchableOpacity>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={`15-02-2003 20:21\n Chưa thanh toán}`}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Thanh toán</Text>}
        />
    </TouchableOpacity>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={`15-02-2003 20:21\n Chưa thanh toán}`}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Thanh toán</Text>}
        />
    </TouchableOpacity>
</ScrollView>
   )

};
const SecondRoute = () => (
    <ScrollView style={[styles.scene, {}]}>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={() => (
                <View>
                  <Text >15-02-2003 20:21</Text>
                  <Text style={{color:'green'}}>Đã thanh toán</Text>
                </View>
              )}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>100.000đ</Text>}
        />
    </TouchableOpacity>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={() => (
                <View>
                  <Text >15-02-2003 20:21</Text>
                  <Text style={{color:'green'}}>Đã thanh toán</Text>
                </View>
              )}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>100.000đ</Text>}
        />
    </TouchableOpacity>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={() => (
                <View>
                  <Text >15-02-2003 20:21</Text>
                  <Text style={{color:'green'}}>Đã thanh toán</Text>
                </View>
              )}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>100.000đ</Text>}
        />
    </TouchableOpacity>
</ScrollView>

);

const ThurstRoute = () => (
    <ScrollView style={[styles.scene, {}]}>
     <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={() => (
                <View>
                  <Text >15-02-2003 20:21</Text>
                  <Text style={{color:'#999900'}}>Chờ xử lý</Text>
                </View>
              )}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'#999900', marginRight: 16, fontSize: 16, fontWeight: '700' }}>-100.000đ</Text>}
        />
    </TouchableOpacity>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={() => (
                <View>
                  <Text >15-02-2003 20:21</Text>
                  <Text style={{color:'#999900'}}>Chờ xử lý</Text>
                </View>
              )}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'#999900', marginRight: 16, fontSize: 16, fontWeight: '700' }}>-100.000đ</Text>}
        />
    </TouchableOpacity>
    <TouchableOpacity>
        <List.Item
            title="Hóa đơn điện Tháng 7"
            description={() => (
                <View>
                  <Text >15-02-2003 20:21</Text>
                  <Text style={{color:'#999900'}}>Chờ xử lý</Text>
                </View>
              )}
            style={{}}

            left={props => <List.Icon {...props} icon="bank-transfer" />}
            right={props => <Text style={{ alignSelf: 'center',color:'#999900', marginRight: 16, fontSize: 16, fontWeight: '700' }}>-100.000đ</Text>}
        />
    </TouchableOpacity>
</ScrollView>

);



export default class TabViewPayment extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Chưa thanh toán' },
            { key: 'second', title: 'Đã thanh toán' },
            { key: 'thurst', title: 'Chờ xử lý' },

        ],
    };

    render() {
        return (
            <React.Fragment style={styles.container}>
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
                        thurst: ThurstRoute,

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