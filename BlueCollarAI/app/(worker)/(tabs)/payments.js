import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../theme';

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    jobTitle: 'Fix Leaking Bathroom Pipe',
    client: 'Sarah Johnson',
    amount: 240,
    date: '2023-10-15',
    status: 'completed',
    type: 'earning'
  },
  {
    id: '2',
    jobTitle: 'Electrical Wiring Installation',
    client: 'John Smith',
    amount: 350,
    date: '2023-10-10',
    status: 'completed',
    type: 'earning'
  },
  {
    id: '3',
    jobTitle: 'Kitchen Cabinet Installation',
    client: 'Mark Wilson',
    amount: 180,
    date: '2023-10-02',
    status: 'pending',
    type: 'earning'
  },
  {
    id: '4',
    amount: 500,
    date: '2023-09-28',
    status: 'completed',
    type: 'withdrawal'
  }
];

export default function WorkerPaymentsScreen() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [weeklyEarnings, setWeeklyEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  useEffect(() => {
    // Simulate API call
    setTransactions(MOCK_TRANSACTIONS);
    setWeeklyEarnings(570);
    setMonthlyEarnings(1750);
  }, []);

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'earnings':
        return transactions.filter(t => t.type === 'earning');
      case 'withdrawals':
        return transactions.filter(t => t.type === 'withdrawal');
      case 'pending':
        return transactions.filter(t => t.status === 'pending');
      default:
        return transactions;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const styles = getPaymentScreenStyles(theme);

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIconContainer}>
        {item.type === 'earning' ? (
          <MaterialIcons name="payments" size={24} color={theme.colors.primary.main} />
        ) : (
          <MaterialIcons name="account-balance-wallet" size={24} color={theme.colors.success.main} />
        )}
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>
          {item.type === 'earning' ? item.jobTitle : 'Withdrawal to Bank'}
        </Text>
        {item.client && <Text style={styles.transactionSubtitle}>Client: {item.client}</Text>}
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text style={[
          styles.transactionAmount,
          item.type === 'earning' ? styles.earningAmount : styles.withdrawalAmount
        ]}>
          {item.type === 'earning' ? '+' : '-'} ${item.amount}
        </Text>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' 
            ? { backgroundColor: theme.colors.success.surface || 'rgba(16, 185, 129, 0.1)' } 
            : { backgroundColor: theme.colors.warning.surface || 'rgba(245, 158, 11, 0.1)' }
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'completed' 
              ? { color: theme.colors.success.main || '#10B981' } 
              : { color: theme.colors.warning.main || '#F59E0B' }
          ]}>
            {item.status === 'completed' ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerBackButton}
          onPress={() => router.canGoBack() ? router.back() : null}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="help-outline" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available for Withdrawal</Text>
        <Text style={styles.balanceAmount}>$1,250.00</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.earningsOverview}>
        <View style={styles.earningsSummaryCard}>
          <Text style={styles.earningsSummaryLabel}>This Week</Text>
          <Text style={styles.earningsSummaryAmount}>${weeklyEarnings}</Text>
        </View>
        <View style={styles.earningsSummaryCard}>
          <Text style={styles.earningsSummaryLabel}>This Month</Text>
          <Text style={styles.earningsSummaryAmount}>${monthlyEarnings}</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'earnings' && styles.activeTab]} 
          onPress={() => setActiveTab('earnings')}
        >
          <Text style={[styles.tabText, activeTab === 'earnings' && styles.activeTabText]}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'withdrawals' && styles.activeTab]} 
          onPress={() => setActiveTab('withdrawals')}
        >
          <Text style={[styles.tabText, activeTab === 'withdrawals' && styles.activeTabText]}>Withdrawals</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredTransactions()}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons name="account-balance-wallet" size={48} color={theme.colors.neutral[300]} />
            <Text style={styles.emptyStateText}>No transactions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getPaymentScreenStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background?.secondary || '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingTop: 40,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerBackButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary.main,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  balanceLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary.contrast + 'b3',
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.size.xxxl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.md,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.contrast + '33',
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  withdrawButtonText: {
    color: theme.colors.primary.contrast,
    fontWeight: '500',
    marginRight: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
  },
  earningsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  earningsSummaryCard: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  earningsSummaryLabel: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  earningsSummaryAmount: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.background.primary,
    ...theme.shadows.sm,
  },
  tabText: {
    fontSize: theme.typography.size.sm,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  transactionsList: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  transactionCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionDetails: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  transactionTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  transactionSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  earningAmount: {
    color: theme.colors.success.main,
  },
  withdrawalAmount: {
    color: theme.colors.error.main,
  },
  statusBadge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: theme.typography.size.xs,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
}); 