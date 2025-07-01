import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Difficulty } from '../types';

interface Props {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ difficulty, onDifficultyChange }: Props) {
  return (
    <View style={styles.difficultySelector}>
      <Text style={styles.selectorLabel}>Difficulty:</Text>
      <View style={styles.difficultyButtons}>
        <button
          className={`difficulty-button ${difficulty === 'beginner' ? 'active' : ''}`}
          onClick={() => onDifficultyChange('beginner')}
          type="button"
          aria-label="Beginner difficulty (5x5)"
        >
          Beginner
        </button>
        <button
          className={`difficulty-button ${difficulty === 'intermediate' ? 'active' : ''}`}
          onClick={() => onDifficultyChange('intermediate')}
          type="button"
          aria-label="Intermediate difficulty (7x7)"
        >
          Intermediate
        </button>
        <button
          className={`difficulty-button ${difficulty === 'expert' ? 'active' : ''}`}
          onClick={() => onDifficultyChange('expert')}
          type="button"
          aria-label="Expert difficulty (9x9)"
        >
          Expert
        </button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  difficultySelector: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
});
