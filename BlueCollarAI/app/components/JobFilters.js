import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import Button from './ui/Button.js';
import theme from '../theme';

const categories = [
  'All',
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'HVAC',
  'Landscaping',
  'General Labor',
];

const sortOptions = [
  { label: 'Nearest', value: 'distance' },
  { label: 'Highest Paying', value: 'budget_desc' },
  { label: 'Most Recent', value: 'date' },
];

const distanceOptions = [
  { label: '5 miles', value: 5 },
  { label: '10 miles', value: 10 },
  { label: '25 miles', value: 25 },
  { label: '50 miles', value: 50 },
];

const JobFilters = ({ onApply }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('distance');
  const [selectedDistance, setSelectedDistance] = useState(10);

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      sort: selectedSort,
      distance: selectedDistance,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'primary' : 'outline'}
            size="sm"
            style={styles.categoryButton}
            onPress={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Sort By</Text>
      <View style={styles.optionsGrid}>
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedSort === option.value ? 'primary' : 'outline'}
            size="sm"
            style={styles.optionButton}
            onPress={() => setSelectedSort(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Distance</Text>
      <View style={styles.optionsGrid}>
        {distanceOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedDistance === option.value ? 'primary' : 'outline'}
            size="sm"
            style={styles.optionButton}
            onPress={() => setSelectedDistance(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          style={styles.applyButton}
          onPress={handleApply}
        >
          Apply Filters
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.sm,
  },
  categoryScroll: {
    marginBottom: theme.spacing.lg,
  },
  categoryContainer: {
    paddingRight: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  categoryButton: {
    marginRight: theme.spacing.xs,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  optionButton: {
    minWidth: '30%',
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
  },
  applyButton: {
    width: '100%',
  },
});

export default JobFilters;
