import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  TextInput,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GourmetColors, GourmetRadii } from "@/constants/gourmet-theme";
import { reservationsApi, Reservation } from "@/api/reservations";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReservation, setNewReservation] = useState<{
    customerName: string;
    customerPhone: string;
    date: string;
    numberOfPeople: number;
    type: 'table' | 'restaurant';
    tableNumber: string;
    notes: string;
  }>({
    customerName: "",
    customerPhone: "",
    date: new Date().toISOString(),
    numberOfPeople: 2,
    type: "table",
    tableNumber: "",
    notes: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationsApi.getReservations();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await reservationsApi.createReservation(newReservation);
      setShowModal(false);
      setNewReservation({
        customerName: "",
        customerPhone: "",
        date: new Date().toISOString(),
        numberOfPeople: 2,
        type: "table",
        tableNumber: "",
        notes: "",
      });
      fetchReservations();
    } catch (error) {
      console.error("Failed to create reservation:", error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await reservationsApi.updateStatus(id, status);
      fetchReservations();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return GourmetColors.accent.emerald;
      case "cancelled": return GourmetColors.status.critical;
      case "completed": return GourmetColors.accent.blue;
      default: return GourmetColors.accent.amber;
    }
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <Text style={styles.customerPhone}>{item.customerPhone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={GourmetColors.text.muted} />
          <Text style={styles.infoText}>{new Date(item.date).toLocaleString()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={14} color={GourmetColors.text.muted} />
          <Text style={styles.infoText}>{item.numberOfPeople} People</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="restaurant-outline" size={14} color={GourmetColors.text.muted} />
          <Text style={styles.infoText}>
            {item.type === 'table' ? `Table ${item.tableNumber || 'N/A'}` : 'Full Restaurant'}
          </Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: GourmetColors.accent.emerald }]}
            onPress={() => handleStatusUpdate(item._id, 'confirmed')}
          >
            <Text style={styles.actionBtnText}>Confirm</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'cancelled' && item.status !== 'completed' && (
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: 'rgba(239,68,68,0.1)' }]}
            onPress={() => handleStatusUpdate(item._id, 'cancelled')}
          >
            <Text style={[styles.actionBtnText, { color: GourmetColors.status.critical }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reservations</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={reservations}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchReservations}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reservations found</Text>
          </View>
        }
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Reservation</Text>
            
            <ScrollView style={styles.form}>
              <Text style={styles.label}>Customer Name</Text>
              <TextInput 
                style={styles.input} 
                value={newReservation.customerName}
                onChangeText={(v) => setNewReservation({...newReservation, customerName: v})}
                placeholder="Name"
                placeholderTextColor={GourmetColors.text.muted}
              />

              <Text style={styles.label}>Phone</Text>
              <TextInput 
                style={styles.input} 
                value={newReservation.customerPhone}
                onChangeText={(v) => setNewReservation({...newReservation, customerPhone: v})}
                placeholder="Phone"
                placeholderTextColor={GourmetColors.text.muted}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Number of People</Text>
              <TextInput 
                style={styles.input} 
                value={newReservation.numberOfPeople.toString()}
                onChangeText={(v) => setNewReservation({...newReservation, numberOfPeople: parseInt(v) || 0})}
                placeholder="Number of People"
                placeholderTextColor={GourmetColors.text.muted}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Type</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity 
                  style={[styles.typeBtn, newReservation.type === 'table' && styles.typeBtnActive]}
                  onPress={() => setNewReservation({...newReservation, type: 'table'})}
                >
                  <Text style={[styles.typeBtnText, newReservation.type === 'table' && styles.typeBtnTextActive]}>Table</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.typeBtn, newReservation.type === 'restaurant' && styles.typeBtnActive]}
                  onPress={() => setNewReservation({...newReservation, type: 'restaurant'})}
                >
                  <Text style={[styles.typeBtnText, newReservation.type === 'restaurant' && styles.typeBtnTextActive]}>Full Restaurant</Text>
                </TouchableOpacity>
              </View>

              {newReservation.type === 'table' && (
                <>
                  <Text style={styles.label}>Table Number</Text>
                  <TextInput 
                    style={styles.input} 
                    value={newReservation.tableNumber}
                    onChangeText={(v) => setNewReservation({...newReservation, tableNumber: v})}
                    placeholder="Table #"
                    placeholderTextColor={GourmetColors.text.muted}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreate}>
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtnGradient}
                >
                  <Text style={styles.submitBtnText}>Create Reservation</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: GourmetColors.bg.primary },
  header: { 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: GourmetColors.bg.secondary,
  },
  title: { fontSize: 24, fontWeight: '800', color: GourmetColors.text.primary },
  addBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: GourmetColors.accent.emerald, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  list: { padding: 16 },
  card: { 
    backgroundColor: GourmetColors.bg.secondary, 
    borderRadius: GourmetRadii.lg, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  customerName: { fontSize: 18, fontWeight: '700', color: GourmetColors.text.primary },
  customerPhone: { fontSize: 14, color: GourmetColors.text.muted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800' },
  cardBody: { gap: 8, marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: GourmetColors.text.secondary },
  cardActions: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { color: GourmetColors.text.muted, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: GourmetColors.bg.secondary, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: GourmetColors.text.primary, marginBottom: 20 },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: GourmetColors.text.secondary, marginBottom: 8, marginTop: 12 },
  input: { 
    height: 48, 
    backgroundColor: GourmetColors.bg.tertiary, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    color: GourmetColors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeBtn: { 
    flex: 1, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: GourmetColors.bg.tertiary, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  typeBtnActive: { 
    backgroundColor: 'rgba(59,130,246,0.1)', 
    borderColor: GourmetColors.accent.blue,
  },
  typeBtnText: { color: GourmetColors.text.muted, fontWeight: '600' },
  typeBtnTextActive: { color: GourmetColors.accent.blue },
  modalFooter: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  cancelBtn: { flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: GourmetColors.text.muted, fontWeight: '600' },
  submitBtn: { 
    flex: 2, 
    height: 50, 
    borderRadius: 12, 
    overflow: 'hidden',
  },
  submitBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
