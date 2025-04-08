import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';

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
          item.status === 'completed' ? styles.completedBadge : styles.pendingBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'completed' ? styles.completedText : styles.pendingText
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
            <MaterialIcons name="account-balance-wallet" size={48} color="#CBD5E0" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary.main,
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginRight: 4,
  },
  earningsOverview: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  earningsSummaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  earningsSummaryLabel: {
    fontSize: 14,
    color: theme.colors.neutral[600],
    marginBottom: 4,
  },
  earningsSummaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: theme.colors.primary.main,
  },
  tabText: {
    fontSize: 14,
    color: '#4A5568',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  transactionsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A44',
    marginBottom: 4,
  },
  earningAmount: {
    color: theme.colors.success.main,
  },
  withdrawalAmount: {
    color: theme.colors.primary.main,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#F59E0B',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#A0AEC0',
  },
}); 