import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Header, Card } from "react-native-elements";

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
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          color: "black",
          marginTop: 50,
          marginBottom: 20,
        }}
      >
        Pour réinitialiser toutes les données de l'appli :
      </Text>
      <Button
        style={styles.button}
        onPress={() => {
          AsyncStorage.clear();
        }}
        title="Supprimer toutes les données"
        buttonStyle={{ backgroundColor: "red" }}
      />
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          color: "black",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        Pour développeurs uniquement :
      </Text>
      <Button
        style={styles.button}
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
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          color: "#31A390",
          marginTop: 50,
          marginBottom: 20,
        }}
      >
        www.armandgillot.fr
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 20,
          color: "#31A390",

          marginBottom: 20,
        }}
      >
        contact@armandgillot.fr
      </Text>
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
  button: {
    width: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
