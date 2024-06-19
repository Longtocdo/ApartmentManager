
import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Card, MD2Colors, RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { SurveyAPIs } from '../../core/APIs/SurveyAPIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { loadingActions } from '../../core/redux/reducers/configReducer';

const MAX_RETRIES = 4;

export default SurveyDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { surveyId } = route.params;

  const [survey, setSurvey] = React.useState();
  const [choiceValue, setChoiceValue] = React.useState();
  const [amountChoices, setAmountChoices] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const dispatch = useDispatch()
  const isLoading = useSelector(state => state.loading.isLoading);

  const [userAnswers, setUserAnswers] = React.useState([]);

  const loadSurvey = async () => {
    let attempts = 0; 

    while (attempts < MAX_RETRIES) {
      try {

        dispatch(loadingActions.showLoading());

        const res = await SurveyAPIs.getSurveyById(surveyId);
        const data = res.data;
        setSurvey(data);
        setAmountChoices(data.questions.length);
        break;
      } catch (err) {
        attempts++;

        if (attempts >= MAX_RETRIES) {
          console.error('Max retry attempts reached:', err);
          break;
        }
        console.warn(`Retrying request (${attempts}/${MAX_RETRIES})...`);
      }finally{
        dispatch(loadingActions.hideLoading());
      }
    }
  };

  React.useEffect(() => {
    loadSurvey();
  }, []);

  const postAnwsers = async () => {
    const token = await AsyncStorage.getItem('token')

    try {
      const res = await SurveyAPIs.postAnwser(surveyId, { "answers": userAnswers }, token)
      console.log(res.status)
    } catch (error) {
      console.log(error)
    }
  }

  const nextOrFinishPress = async () => {
    if (choiceValue) {
      setCount(count + 1);
      setChoiceValue(null); 
    } else {
      Alert.alert("Chú ý", 'Vui lòng chọn một lựa chọn trước khi tiếp tục!')
    }

    if (count == amountChoices - 1) {
      postAnwsers();
      Alert.alert("Thành công", "Cám ơn bạn đã thực hiện kháo sát")
      navigation.navigate('SurveyScreen')
    }

  };

  const handleAnswerChange = (question, choice) => {
    setUserAnswers(prevAnswers => {
      const existingAnswerIndex = prevAnswers.findIndex(answer => answer.question === question);
      if (existingAnswerIndex !== -1) {
        // Update existing answer
        const newAnswers = [...prevAnswers];
        newAnswers[existingAnswerIndex].choice = choice;
        return newAnswers;
      } else {
        // Add new answer
        return [...prevAnswers, { question, choice }];
      }
    });
    setChoiceValue(choice);
  };

  return (
    <ScrollView >
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 17 }}>Remaining: {amountChoices - count}</Text>
        <Text style={{ fontSize: 17 }}>Total questions: {amountChoices}</Text>
      </View>
      {
        survey && survey.questions[count] && (
          <View style={styles.body}>
            <Card style={styles.card}>
              <Card.Title title={survey.questions[count].content} titleStyle={styles.question} />
              <Card.Content>
                <RadioButton.Group onValueChange={newValue => handleAnswerChange(survey.questions[count].id, newValue)} value={choiceValue}>
                  {
                    survey.questions[count].choices.map(c =>
                      <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <RadioButton value={c.id} status={choiceValue === c.id ? 'checked' : 'unchecked'} />
                        <Text style={styles.choice}>{c.content_choice}</Text>
                      </View>
                    )
                  }
                </RadioButton.Group>
              </Card.Content>
            </Card>
          </View>
        )
      }
      <View style={styles.process}>
        <TouchableOpacity disabled={count == 0} onPress={() => setCount(count - 1)}>
          <Text style={styles.button}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nextOrFinishPress(survey.questions[count].id, choiceValue)}>
          <Text style={styles.button}>{count == amountChoices - 1 ? 'Hoàn thành' : 'Tiếp theo'}</Text>
        </TouchableOpacity>
      </View>
      </View>
      {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={MD2Colors.blue500} />
                </View>
            )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent:'space-between',
    padding: 20,
    backgroundColor: '#d7e1fa',
    height:815
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  process: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  body: {
  },
  card: {
    marginBottom: 20,
    padding: 10,
  },
  question: {
    fontSize: 22,
    fontWeight: '600'
  },
  choice: {
    fontSize: 19,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    fontSize: 17,
    backgroundColor: 'blue',
    color: 'white', padding: 13,
    borderRadius: 10,
  }, loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
},
});