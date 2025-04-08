import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const MOCK_TRANSACTIONS = [
  {
    id: '1',
    jobTitle: 'Fix Leaking Bathroom Pipe',
    worker: 'John Smith',
    amount: 240,
    date: '2023-10-15',
    status: 'completed',
    type: 'payment'
  },
  {
    id: '2',
    jobTitle: 'Electrical Wiring Installation',
    worker: 'Sarah Johnson',
    amount: 350,
    date: '2023-10-10',
    status: 'completed',
    type: 'payment'
  },
  {
    id: '3',
    jobTitle: 'Kitchen Cabinet Installation',
    worker: 'Mike Wilson',
    amount: 180,
    date: '2023-10-02',
    status: 'pending',
    type: 'payment'
  },
  {
    id: '4',
    amount: 100,
    date: '2023-09-28',
    status: 'completed',
    type: 'deposit'
  }
];

export default function PaymentsScreen() {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTransactions(MOCK_TRANSACTIONS);
  }, []);

  const getFilteredTransactions = () => {
    switch (activeTab) {
      case 'payments':
        return transactions.filter(t => t.type === 'payment');
      case 'deposits':
        return transactions.filter(t => t.type === 'deposit');
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
    <TouchableOpacity 
      style={styles.transactionCard}
      onPress={() => {
        if (item.type === 'payment') {
          router.push({ pathname: '/payment-details', params: { id: item.id } });
        }
      }}
    >
      <View style={styles.transactionIconContainer}>
        {item.type === 'payment' ? (
          <MaterialIcons name="account-balance-wallet" size={24} color="#1A2A44" />
        ) : (
          <MaterialIcons name="add-circle" size={24} color="#10B981" />
        )}
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>
          {item.type === 'payment' ? item.jobTitle : 'Account Deposit'}
        </Text>
        {item.worker && <Text style={styles.transactionSubtitle}>{item.worker}</Text>}
        <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.transactionAmountContainer}>
        <Text style={[
          styles.transactionAmount,
          item.type === 'deposit' && styles.depositAmount
        ]}>
          {item.type === 'payment' ? '-' : '+'} ${item.amount}
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#1A2A44" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#1A2A44" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>$1,250.00</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw</Text>
          <MaterialIcons name="keyboard-arrow-right" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'payments' && styles.activeTab]} 
          onPress={() => setActiveTab('payments')}
        >
          <Text style={[styles.tabText, activeTab === 'payments' && styles.activeTabText]}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'deposits' && styles.activeTab]} 
          onPress={() => setActiveTab('deposits')}
        >
          <Text style={[styles.tabText, activeTab === 'deposits' && styles.activeTabText]}>Deposits</Text>
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A2A44',
  },
  balanceCard: {
    backgroundColor: '#1A2A44',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#A0AEC0',
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#1A2A44',
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
    color: '#1A2A44',
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
  depositAmount: {
    color: '#10B981',
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