import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './styles.css';
import GameBoard from './GameBoard';

export default function App() {
  return (
    <>
      <View style={main_style.container}>
        <Text>💡Light Up💡</Text>
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
  },
});
