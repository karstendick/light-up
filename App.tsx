import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './styles.css';
import GameBoard from './GameBoard';

export default function App() {
  return (
    <>
      <View style={main_style.container}>
        <Text style={main_style.title}>💡Light Up💡</Text>
        <StatusBar style="auto" />
        <GameBoard />
      </View>
    </>
  );
}

const main_style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});
