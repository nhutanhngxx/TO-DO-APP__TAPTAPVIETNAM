import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import TaskForm from "./TaskForm";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TaskItem({ task, onToggleDone }) {
  const [showEdit, setShowEdit] = useState(false);

  const toggleEdit = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowEdit((s) => !s);
  };

  let deadlineDate = new Date(task.deadline);
  if (Number.isNaN(deadlineDate.getTime())) deadlineDate = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Cao":
        return "#4CAF50";
      case "Trung bình":
        return "#FFA000";
      case "Thấp":
        return "#757575";
      default:
        return "#000";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={() => onToggleDone?.(task.id)}>
          <View
            style={[styles.checkbox, task.done && styles.checkboxChecked]}
          />
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{task.title}</Text>
          <Text
            style={[
              styles.priority,
              { color: getPriorityColor(task.priority) },
            ]}
          >
            Ưu tiên {task.priority.toLowerCase()}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={toggleEdit} style={{ padding: 6 }}>
            {!showEdit && (
              <>
                <Text
                  style={{
                    color: "#0d00ffff",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Chỉnh sửa
                </Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.deadlineText}>
            {diffDays > 0 ? `Còn ${diffDays} ngày` : "Hết hạn"}
          </Text>
        </View>
      </View>

      {showEdit && (
        <View style={styles.editContainer}>
          <TaskForm task={task} onClose={() => toggleEdit()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFD600",
    paddingVertical: 6,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#aaa",
    backgroundColor: "#eee",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#000",
  },
  priority: {
    fontSize: 13,
    marginTop: 4,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  deadlineText: {
    fontSize: 13,
    marginTop: 2,
    color: "#333",
  },
  editContainer: {
    width: "90%",
    marginTop: 8,
  },
});
