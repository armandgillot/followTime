import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Header, Overlay } from "react-native-elements";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OptionsScreen() {
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  return (
    <View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text
          style={{
            textAlign: "center",
            color: "red",
            fontSize: 25,
            marginBottom: 20,
            fontWeight: "bold",
          }}
        >
          DANGER : vous allez supprimer toutes les données de l'application
        </Text>
        <Button
          style={styles.button}
          buttonStyle={{ backgroundColor: "red", marginBottom: 20 }}
          onPress={() => {
            AsyncStorage.clear();
            toggleOverlay();
          }}
          title="Supprimer"
        />
        <Button style={styles.button} onPress={toggleOverlay} title="Annuler" />
      </Overlay>
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
        onPress={toggleOverlay}
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
