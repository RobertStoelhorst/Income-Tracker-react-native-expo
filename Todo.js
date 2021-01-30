import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Todo = ({ title }) => {
  return (
    <View style={styles.todo}>
      <Text>✅ {title}</Text>
    </View>
  );
};

export default Todo;

const styles = StyleSheet.create({});
