import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Login = () => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const saveinfo = async (name) => {
    try {
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("isLoggedIn", "true");
      console.log("Data successfully saved");
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "rgb(0, 0, 0)",
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={{ color: "white", fontSize: 20 }}>Enter Name</Text>
      </View>
      <TextInput
        style={{
          color: "white",
          borderWidth: 1,
          borderColor: "white",
          margin: 10,
          borderRadius: 12,
        }}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      ></TextInput>
      <TouchableOpacity
        style={{
          borderRadius: 25,
          backgroundColor: "#00CED1",
          padding: 10,
          alignItems: "center",
          margin: 10,
        }}
        onPress={() => saveinfo(name)}
      >
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
