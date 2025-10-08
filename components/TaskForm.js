import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Modal,
} from "react-native";
import { useDispatch } from "react-redux";
import { addTask, updateTask, deleteTask } from "../redux/tasksSlice";
import uuid from "react-native-uuid";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

export default function TaskForm({ task = null, onClose = () => {} }) {
  const dispatch = useDispatch();
  const isEdit = !!task;

  const [title, setTitle] = useState(task ? task.title : "");
  const [priority, setPriority] = useState(task ? task.priority : "Trung bình");
  const [date, setDate] = useState(task ? new Date(task.deadline) : new Date());
  const [tempDate, setTempDate] = useState(date);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setPriority(task.priority || "Trung bình");
      setDate(task.deadline ? new Date(task.deadline) : new Date());
      setTempDate(task.deadline ? new Date(task.deadline) : new Date());
    }
  }, [task]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    setBusy(true);

    if (isEdit) {
      dispatch(
        updateTask({
          id: task.id,
          changes: {
            title: title.trim(),
            priority,
            deadline: date.toISOString(),
          },
        })
      );
      onClose();
    } else {
      dispatch(
        addTask({
          id: uuid.v4(),
          title: title.trim(),
          priority,
          deadline: date.toISOString(),
          done: false,
        })
      );
      setTitle("");
      setPriority("Trung bình");
      setDate(new Date());
      setTempDate(new Date());
      onClose();
    }

    setBusy(false);
    Keyboard.dismiss();
  };

  const handleDelete = () => {
    if (!isEdit) return;
    dispatch(deleteTask(task.id));
    onClose();
  };

  const handleDateConfirm = () => {
    setDate(tempDate);
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setTempDate(date);
    setShowDatePicker(false);
  };

  const handlePrioritySelect = (value) => {
    setPriority(value);
    setShowPriorityPicker(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ width: "100%" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}></Text>
            {isEdit && (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteSmall}
              >
                <Icon name="delete" size={20} color="#E53935" />
                <Text style={styles.deleteSmallText}>XÓA</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Tiêu đề"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />

          <View style={styles.sep} />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.row}
          >
            <Text style={styles.label}>Thời hạn</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.value}>
                {date.toLocaleDateString("vi-VN")}
              </Text>
              <Icon name="calendar-today" size={20} color="#4CAF50" />
            </View>
          </TouchableOpacity>

          <View style={styles.sep} />

          <TouchableOpacity
            onPress={() => setShowPriorityPicker(true)}
            style={styles.row}
          >
            <Text style={styles.label}>Mức độ ưu tiên</Text>
            <View style={styles.priorityContainer}>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      priority === "Cao"
                        ? "#E53935"
                        : priority === "Trung bình"
                        ? "#FFB300"
                        : "#4CAF50",
                  },
                ]}
              >
                {priority}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#333" />
            </View>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveBtn, busy && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={busy}
            >
              <Text style={styles.saveText}>{isEdit ? "Lưu" : "Thêm"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDateCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ngày hạn</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="default"
              onChange={(e, selected) => {
                if (selected) setTempDate(selected);
              }}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={handleDateCancel}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleDateConfirm}
              >
                <Text style={styles.modalConfirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPriorityPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPriorityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn mức độ ưu tiên</Text>
            <TouchableOpacity
              style={[styles.priorityOption, { backgroundColor: "#E53935" }]}
              onPress={() => handlePrioritySelect("Cao")}
            >
              <Text style={styles.priorityOptionText}>Cao</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityOption, { backgroundColor: "#FFB300" }]}
              onPress={() => handlePrioritySelect("Trung bình")}
            >
              <Text style={styles.priorityOptionText}>Trung bình</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityOption, { backgroundColor: "#4CAF50" }]}
              onPress={() => handlePrioritySelect("Thấp")}
            >
              <Text style={styles.priorityOptionText}>Thấp</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowPriorityPicker(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginVertical: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  deleteSmall: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteSmallText: {
    color: "#E53935",
    fontWeight: "600",
    fontSize: 18,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  sep: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priorityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  disabledBtn: {
    backgroundColor: "#a5d6a7",
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    width: width * 0.8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    alignItems: "center",
  },
  modalCancelText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    marginLeft: 12,
  },
  modalConfirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  priorityOption: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
  },
  priorityOptionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
