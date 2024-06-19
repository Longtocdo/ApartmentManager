import * as React from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Icon, List, Searchbar } from 'react-native-paper';
import { TabView, SceneMap } from 'react-native-tab-view';
import navigation from '../../navigation';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SurveyAPIs } from '../../core/APIs/SurveyAPIs';
const FirstRoute = () => {
    const navigation = useNavigation();
    const [surveys, setSurveys] = React.useState([])

    const loadSurvey = async () => {
        const token = await AsyncStorage.getItem("token")
        try {
            const res = await SurveyAPIs.getSurveyPending(token)

            setSurveys(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        loadSurvey()
    }, [])

    return (
        <ScrollView style={[styles.scene, {}]}>

            {surveys.map(s =>
                <TouchableOpacity onPress={() => { navigation.navigate('SurveyDetailScreen', { surveyId: s.id }) }}>
                    <List.Item
                        title={s?.title ?? 'Khảo sát'}
                        description={s?.created_date ?? `15-02-2024`}
                        style={{}}

                        left={props => <List.Icon {...props} icon="bank-transfer" />}
                        right={props => <Text style={{ alignSelf: 'center', color: 'blue', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Khảo sát</Text>}
                    />
                </TouchableOpacity>
            )}

        </ScrollView>
    )

};
const SecondRoute = () => {
    const [surveys, setSurveys] = React.useState([])

    const loadSurvey = async () => {
        const token = await AsyncStorage.getItem("token")
        try {
            const res = await SurveyAPIs.getSurveyCompleted(token)

            setSurveys(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    React.useEffect(() => {
        loadSurvey()
    }, [])

    return (
        <ScrollView style={[styles.scene, {}]}>

            {surveys.map(s =>
                <TouchableOpacity >
                    <List.Item
                        title={s?.title ?? 'Khảo sát'}
                        description={s?.created_date ?? `15-02-2024`}
                        style={{}}

                        left={props => <List.Icon {...props} icon="bank-transfer" />}
                        right={props => <Text style={{ alignSelf: 'center', color: 'green', marginRight: 16, fontSize: 16, fontWeight: '700' }}>Đã khảo sát</Text>}
                    />
                </TouchableOpacity>
            )}

        </ScrollView>
    )
};





export default class TabViewSurvey extends React.Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Chưa khảo sát' },
            { key: 'second', title: 'Đã khảo sát' },

        ],
    };

    render() {
        return (
            <React.Fragment >
                <View style={styles.search}>
                    <ImageBackground source={require('E:\\OU\\LapTrinhHienDai\\ApartmentManager\\AppMobile\\ApartmentApp\\assets\\banner.png')} style={styles.image}>
                        <Searchbar
                            placeholder="Tìm kiếm khảo sát"
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