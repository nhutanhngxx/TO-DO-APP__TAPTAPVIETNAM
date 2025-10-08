import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import { toggleTaskDone } from "../redux/tasksSlice";

export default function TodoListScreen() {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleDone = (id) => {
    dispatch(toggleTaskDone(id));
  };

  const renderItem = ({ item }) => (
    <TaskItem task={item} onToggleDone={handleToggleDone} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TO-DO LIST</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addBtnText}>TẠO TASK MỚI ＋</Text>
      </TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" transparent={true}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalInner}>
            <TaskForm onClose={() => setShowAddModal(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD233",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 12,
    color: "#fff",
  },
  addBtn: {
    position: "absolute",
    bottom: 28,
    left: 24,
    right: 24,
    backgroundColor: "#F7678E",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalInner: {
    backgroundColor: "transparent",
  },
});
