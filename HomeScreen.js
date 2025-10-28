import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

// We now accept the `navigation` prop, which is passed in by React Navigation
const HomeScreen = ({ navigation }) => {
  // State for the portfolio value, defaulting to 0 as requested
  const [portfolioAmount, setPortfolioAmount] = useState(0.00);
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(true);

  // Helper data for the menu
  const menuItems = [
    { label: "Buy Crypto", icon: "bitcoin", lib: FontAwesome5, screen: "BuyCrypto" },
    { label: "Create Loan", icon: "edit", lib: MaterialIcons, screen: "CreateLoan" },
    { label: "Fund Loan", icon: "dollar-sign", lib: FontAwesome5, screen: "FundLoan" },
    { label: "Manage Loan", icon: "file-alt", lib: FontAwesome5, screen: "ManageLoan" },
    { label: "P2P", icon: "handshake", lib: FontAwesome5, screen: "P2P" },
    { label: "Help", icon: "question-circle", lib: FontAwesome5, screen: "Help" },
  ];

  return (
    // Use SafeAreaView or add top padding if needed, but ScrollView is fine
    <ScrollView style={styles.container}>
      {/* Section 1: Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="darkgrey" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="darkgrey" />
        </TouchableOpacity>
      </View>

      {/* Section 2: Get Started */}
      <Text style={styles.title}>Get Started</Text>

      {/* Section 3: Portfolio Value */}
      <View style={styles.portfolioCard}>
        <View>
          <Text style={styles.portfolioLabel}>Portfolio Value</Text>
          <Text style={styles.portfolioValue}>
            {isPortfolioVisible ? `$${portfolioAmount.toFixed(2)}` : '****'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setIsPortfolioVisible(!isPortfolioVisible)}>
          <Ionicons name={isPortfolioVisible ? "eye" : "eye-off"} size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Section 4: Action Prompt */}
      <Text style={styles.subTitle}>What would you like to do?</Text>

      {/* Section 5: Menu Items */}
      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.label} 
            style={styles.menuBox} 
            // This is the magic! Use navigation.navigate to go to the screen
            onPress={() => navigation.navigate(item.screen)}
          >
            <item.lib name={item.icon} size={32} color="#00B300" />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section 6: Your Loans */}
      <Text style={styles.subTitle}>Your Loans</Text>

      {/* Section 7: Loan Details */}
      <View style={styles.loanCard}>
        <View style={styles.loanHeader}>
          <Text style={styles.loanHeaderText}>Item</Text>
          <Text style={styles.loanHeaderText}>Amount</Text>
          <Text style={styles.loanHeaderText}>Remaining</Text>
          <Text style={styles.loanHeaderText}>Interest</Text>
        </View>
        
        {/* This is just a hardcoded example, you'd fetch this data later */}
        <View style={styles.loanRow}>
          <Text style={styles.loanText}>Wedding</Text>
          <Text style={styles.loanText}>$500</Text>
          <Text style={styles.loanText}>$400</Text>
          <Text style={styles.loanText}>8%</Text>
        </View>
        {/* You could map over real loan data here */}

      </View>
    </ScrollView>
  );
};

// --- Added StyleSheet for cleaner code ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 50, // Added padding for the status bar area
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  portfolioCard: {
    backgroundColor: "#00B300",
    padding: 30,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  portfolioLabel: {
    color: "white",
    fontSize: 18,
  },
  portfolioValue: {
    color: "white",
    fontSize: 32, // Made it bigger like the design
    fontWeight: "bold",
    marginTop: 5,
  },
  subTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 30, // Increased margin
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  menuBox: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%", // 3 items per row
    marginBottom: 20,
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 10,
    height: 100, // Made them a bit taller
  },
  menuText: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
  },
  loanCard: {
    backgroundColor: "#333333",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 40, // Added space at the bottom
  },
  loanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    paddingBottom: 10,
  },
  loanHeaderText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  loanRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  loanText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
});

export default HomeScreen;
