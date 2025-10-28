import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from "./lib/supabaseClient"; // Make sure this path is correct

const loanCategories = [
  "All", "Medical", "Career", "Business", "Holiday", "Home", "Wedding", "Family", "Car", "Bills", "Other"
];

// Placeholder image for loans without a profile picture
const FALLBACK_IMAGE = 'https://placehold.co/40x40/333333/FFFFFF?text=??';

const FundLoans = () => {
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  
  // --- State for managing data from Supabase ---
  const [allLoans, setAllLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch data on component mount ---
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all loans from the 'Loans' table
        const { data, error: dbError } = await supabase
          .from('Loans') // <-- IMPORTANT: Ensure this matches your table name
          .select('*');

        if (dbError) {
          throw dbError;
        }

        if (data) {
          // Map database columns to the component's expected props
          const formattedLoans = data.map(loan => ({
            id: loan.id, // Assuming you have an 'id' column
            name: loan.customer_name, // DB: customer_name -> Component: name
            title: loan.loan_name, // DB: loan_name -> Component: title
            description: loan.loan_description, // DB: loan_description -> Component: description
            total: loan.loan_amount, // DB: loan_amount -> Component: total
            paid: loan.amount_raised, // DB: amount_raised -> Component: paid
            deadline: new Date(loan.deadline).toLocaleDateString(), // DB: deadline -> Component: deadline
            category: loan.category, // DB: category -> Component: category
            profilePic: loan.profile_pic_url || FALLBACK_IMAGE, // Use URL from DB or fallback
          }));
          setAllLoans(formattedLoans);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching loans:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []); // Empty array ensures this runs only once on mount

  const toggleCategory = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev.filter((c) => c !== "All"), category]
      );
    }
  };

  const filteredLoans = selectedCategories.includes("All")
    ? allLoans
    : allLoans.filter((loan) => selectedCategories.includes(loan.category));
    
  // --- Helper function to render the main content ---
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#00B300" style={{ marginTop: 50 }} />;
    }
    
    if (error) {
        return <Text style={styles.errorText}>Failed to load loans: {error}</Text>;
    }
    
    if (filteredLoans.length === 0) {
        return <Text style={styles.errorText}>No loans found for the selected categories.</Text>;
    }

    return filteredLoans.map((loan) => (
      <View key={loan.id} style={styles.loanCard}>
        <View style={styles.loanHeader}>
          {/* Use {uri: ...} for network images */}
          <Image source={{ uri: loan.profilePic }} style={styles.profilePic} />
          <View>
            <Text style={styles.loanName}>{loan.name}</Text>
            <Text style={styles.loanTitle}>{loan.title}</Text>
          </View>
        </View>
        <Text style={styles.loanDescription}>{loan.description}</Text>
        <View style={styles.loanInfoContainer}>
          <Text style={styles.loanDetail}>Deadline: {loan.deadline}</Text>
          <Text style={styles.loanDetail}>Total: ${loan.total?.toLocaleString()}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(loan.paid / loan.total) * 100}%` }]} />
        </View>
        <Text style={styles.amountLeft}>Amount Left: ${(loan.total - loan.paid)?.toLocaleString()}</Text>
        <TouchableOpacity style={styles.fundButton}>
          <Text style={styles.fundButtonText}>Fund Loan</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <FontAwesome name="bars" size={24} color="darkgrey" />
        <View style={styles.iconContainer}>
          <FontAwesome name="bell" size={24} color="darkgrey" style={styles.icon} />
          <FontAwesome name="search" size={24} color="darkgrey" />
        </View>
      </View>
      
      {/* Title Section */}
      <Text style={styles.title}>Fund Loans</Text>
      
      {/* Loan Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {loanCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategories.includes(category) && styles.selectedCategory]}
            onPress={() => toggleCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Loan Cards Wrapper */}
      <ScrollView>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconContainer: { flexDirection: "row" },
  icon: { marginRight: 16 }, // Adjusted from marginLeft for better spacing
  title: { fontSize: 24, color: "#00B300", fontWeight: "bold", textAlign: "center", paddingVertical: 20 },
  categoryScroll: { marginBottom: 16 },
  categoryButton: { backgroundColor: "#555", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 14, marginRight: 10 },
  selectedCategory: { backgroundColor: "#00B300" },
  categoryText: { color: "white", fontWeight: "bold" },
  loanCard: { backgroundColor: "#282828", padding: 16, borderRadius: 10, marginBottom: 16 },
  loanHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 10, backgroundColor: '#555' },
  loanName: { color: "#00B300", fontSize: 16, fontWeight: "bold" },
  loanTitle: { color: "white", fontSize: 14, fontWeight: "bold" },
  loanDescription: { color: "#E0E0E0", marginBottom: 12, lineHeight: 20 },
  loanInfoContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  loanDetail: { color: "darkgrey" },
  progressBarContainer: { height: 8, backgroundColor: "#444", borderRadius: 4, overflow: "hidden", marginBottom: 4 },
  progressBar: { height: 8, backgroundColor: "#00B300" },
  amountLeft: { color: "darkgrey", alignSelf: "flex-end" },
  fundButton: { backgroundColor: "#00B300", borderRadius: 20, padding: 10, alignItems: "center", marginTop: 10 },
  fundButtonText: { color: "white", fontWeight: "bold" },
  errorText: { color: 'darkgrey', textAlign: 'center', marginTop: 50, fontSize: 16 }
});

export default FundLoans;
