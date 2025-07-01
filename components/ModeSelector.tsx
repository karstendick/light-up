import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlacementMode } from '../types';

interface Props {
  placementMode: PlacementMode;
  onModeChange: (mode: PlacementMode) => void;
}

export function ModeSelector({ placementMode, onModeChange }: Props) {
  return (
    <View style={styles.modeSelector}>
      <button
        className={`mode-button ${placementMode === 'lightbulb' ? 'active' : ''}`}
        onClick={() => onModeChange('lightbulb')}
        type="button"
        aria-label="Place light bulbs"
      >
        💡 Light
      </button>
      <button
        className={`mode-button ${placementMode === 'x' ? 'active' : ''}`}
        onClick={() => onModeChange('x')}
        type="button"
        aria-label="Place X marks"
      >
        ❌ Mark
      </button>
    </View>
  );
}

const styles = StyleSheet.create({
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
});
