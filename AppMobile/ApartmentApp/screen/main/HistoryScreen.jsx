import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, ImageBackground, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { ActivityIndicator, Icon, List, MD2Colors, Searchbar } from 'react-native-paper';
import { BillApis } from '../../core/APIs/BillAPIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { debounce } from 'lodash';
import { loadingActions } from '../../core/redux/reducers/configReducer';
import { useDispatch, useSelector } from 'react-redux';


export default function HistoryScreen({ navigation }) {

    const [bills, setBills] = React.useState([])
    const [searchKW, setSearchKW] = React.useState('')
    const isLoading = useSelector(state => state.loading.isLoading);
    const [refreshing, setRefreshing] = React.useState(false);

    const [currentPage, setCurrentPage] = React.useState(1)
    const [isLastPage, setIsLastPage] = React.useState(false)
    const dispatch = useDispatch()

    const debouncedApiCall = React.useCallback(debounce(async (searchKeyword, pageNumber) => {
        try {

            dispatch(loadingActions.showLoading());

            const token = await AsyncStorage.getItem('token');
            const bill = await BillApis.getBill({ 'status': 'payed', 'name': searchKeyword }, token, pageNumber);

            if (bill.data.next == null) {
                setIsLastPage(true)
            }
            else {
                setCurrentPage(currentPage + 1)
            }

            onRefresh?setBills(bill.data.results):setBills([...bills, ...bill.data.results])
        } catch (error) {
        } finally {
            dispatch(loadingActions.hideLoading());
        }
    }, 800), []);

    const handleSearchChange = (searchKeyword) => {
        setSearchKW(searchKeyword);
        debouncedApiCall(searchKeyword);
    };

    const handleLoadMore = () => {
        if (!isLastPage) {
            debouncedApiCall("", currentPage)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);

        debouncedApiCall(searchKW,1)
        setCurrentPage(1)
        
        setRefreshing(false);
    };

    React.useEffect(() => {
        debouncedApiCall("")
    }, [])

    return (
        <React.Fragment>
            <View style={styles.search}>
                <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
                    <Searchbar
                        placeholder="Tìm kiếm hóa đơn đã thanh toán"
                        onChangeText={handleSearchChange}
                        value={searchKW}
                        style={{ width: '80%', height: 50 }}
                    />
                </ImageBackground>
            </View>
            <FlatList
                data={bills}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { navigation.navigate('PaymentDetailScreen', { billId: item.id, isPayed: item?.status, paymentMethod: item?.payment_method }) }}>
                        <List.Item
                            title={item?.fee?.fee_name}
                            description={() => (
                                <View>
                                    <Text>{item?.payment_date}</Text>
                                    <Text style={{ color: 'green' }}>Đã thanh toán</Text>
                                </View>
                            )}
                            left={props => <List.Icon {...props} icon="bank-transfer" />}
                            right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>{`${item?.fee?.price?.toLocaleString('vi-VN') + 'đ'}`}</Text>}
                        />
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={MD2Colors.blue500} />
                </View>
            )}
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
    },
    scene: {
    },
    search: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        height: 100,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }, loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});