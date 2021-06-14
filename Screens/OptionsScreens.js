import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Header } from "react-native-elements";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OptionsScreen() {
  return (
    <View>
      <Header
        barStyle="default"
        centerComponent={{
          text: "OPTIONS",
          style: { color: "#fff" },
        }}
        containerStyle={{ width: "100%", backgroundColor: "#31A390" }}
        placement="center"
      />
      <Text>- Pour supprimer toutes les données de l'application :</Text>
      <Button
        onPress={() => {
          AsyncStorage.clear();
        }}
        title="Supprimer le local storage"
      />
      <Button
        onPress={() => {
          AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (error, stores) => {
              stores.map((result, i, store) => {
                console.log({ [store[i][0]]: store[i][1] });
                return true;
              });
            });
          });
        }}
        title="Afficher le storage"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
