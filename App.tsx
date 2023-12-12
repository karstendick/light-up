import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './styles.css'

const tiles = [1, 2, 3, 4]

export default function App() {
  return (
    <>
      <View style={main_style.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
        <div className='board_grid'>
          {tiles.map((tile) => (
            <button
              key={tile}>{tile}</button>
          ))}
        </div>
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
