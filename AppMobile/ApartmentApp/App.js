import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
    const [selectedAnswers, setSelectedAnswers] = React.useState({});

  const questions = [
    {
      id: 1,
      question: 'Câu hỏi 1: Ai là người đầu tiên bước chân lên Mặt Trăng?',
      options: [
        { label: 'Neil Armstrong', value: 'a' },
        { label: 'Yuri Gagarin', value: 'b' },
        { label: 'Buzz Aldrin', value: 'c' },
        { label: 'Alan Shepard', value: 'd' },
      ],
    },
    // Thêm các câu hỏi khác vào đây
  ];

  const submitAnswers = () => {
    // Xử lý câu trả lời từ người dùng ở đây
    console.log('Câu trả lời của bạn:', selectedAnswers);
  };

  return (
    <View style={styles.container}>
      {questions.map((question) => (
        <List.Accordion
          key={question.id}
          title={question.question}
          style={styles.questionContainer}
        >
          <RadioButton.Group
            onValueChange={(newValue) =>
              setSelectedAnswers({
                ...selectedAnswers,
                [question.id]: newValue,
              })
            }
            value={selectedAnswers[question.id]}
          >
            {question.options.map((option, index) => (
              <List.Item
                key={index}
                title={option.label}
                left={() => (
                  <RadioButton value={option.value} />
                )}
              />
            ))}
          </RadioButton.Group>
        </List.Accordion>
      ))}
      <Button mode="contained" onPress={submitAnswers} style={styles.button}>
        Gửi
      </Button>
    </View>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
