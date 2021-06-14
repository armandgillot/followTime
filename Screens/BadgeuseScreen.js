import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button, Header, Card } from "react-native-elements";

import AsyncStorage from "@react-native-async-storage/async-storage";

import moment, { now } from "moment";
import "moment/locale/fr";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Se souvenir de la dernière fonction de rappel.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Configurer l’intervalle.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function BadgeuseScreen() {
  const [timeNow, setTimeNow] = useState(moment().format("LTS"));
  const [timeSince, setTimeSince] = useState("");
  const [work, setWork] = useState([]);
  const [inWork, setInWork] = useState({ active: false, index: "" });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(
      `workData${String(moment().format("L"))}`,
      function (error, data) {
        if (data) {
          var dataInit = JSON.parse(data);
          setWork(dataInit);
          console.log("dataTrouvé dans USEEFFECT", dataInit);
        } else {
          setWork([]);
          console.log("AUCUNE DATA DANS USEEFFECT");
        }
      }
    );
  }, [refresh]);

  useEffect(() => {
    AsyncStorage.getItem("inWorkData", function (error, data) {
      var inWorkStatus = JSON.parse(data);
      if (data) {
        setInWork(inWorkStatus);
      }
    });
  }, []);

  useInterval(() => {
    setTimeNow(moment().format("LTS"));

    AsyncStorage.getItem(
      `workData${String(moment().format("L"))}`,
      function (error, data) {
        if (data) {
          var dataInit = JSON.parse(data);
          setWork(dataInit);
          //console.log("dataTrouvé dans USEEFFECT", dataInit);
        } else {
          setWork([]);
          //console.log("AUCUNE DATA DANS USEEFFECT");
        }
      }
    );

    if (work && inWork.active == true) {
      setTimeSince(moment(work[work.length - 1].startTime).fromNow());
    } else {
      setTimeSince("Vous pouvez pointer...");
    }
  }, 1000);

  const majData = () => {
    setRefresh(!refresh);
  };

  const debutButton = async () => {
    work.push({
      date: moment().format("L"),
      startTime: Date.now(),
    });
    inWork.active = true;
    AsyncStorage.setItem(
      `workData${String(moment().format("L"))}`,
      JSON.stringify(work)
    );
    AsyncStorage.setItem("inWorkData", JSON.stringify(inWork));
  };

  const finButton = async () => {
    inWork.active = false;
    console.log("work dans fin", work);
    var date = work[work.length - 1].date;
    var startTime = work[work.length - 1].startTime;

    work[work.length - 1].endTime = Date.now();
    work[work.length - 1].duration =
      moment(Date.now()) - moment(work[work.length - 1].startTime);

    AsyncStorage.setItem(
      `workData${work[work.length - 1].date}`,
      JSON.stringify(work)
    );

    AsyncStorage.setItem("inWorkData", JSON.stringify(inWork));
    console.log(work);
  };

  return (
    <View
      style={{
        // backgroundColor: "#192a56",
        height: "100%",
      }}
    >
      <Header
        barStyle="default"
        centerComponent={{
          text: "BADGEUSE",
          style: { color: "#fff" },
        }}
        containerStyle={{ width: "100%", backgroundColor: "#31A390" }}
        placement="center"
      />
      <View
        style={{
          flexDirection: "row",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 30,
        }}
      >
        <Button
          onPress={() => {
            majData();
            debutButton();
          }}
          disabled={inWork.active == false ? false : true}
          title="Début"
          buttonStyle={{
            marginHorizontal: 15,
            width: 140,
            paddingVertical: 100,
            backgroundColor: "#31A390",
          }}
        />
        <Button
          onPress={() => {
            majData();
            finButton();
          }}
          title="Fin"
          buttonStyle={{
            marginHorizontal: 15,
            width: 140,
            paddingVertical: 100,
            backgroundColor: "#F47C5D",
          }}
          disabled={inWork.active == true ? false : true}
        />
      </View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 30,
          fontSize: 30,
          color: "#31A390",
        }}
      >
        Heure locale : {timeNow}
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginTop: 30,
          fontSize: 25,
          color: "#F47C5D",
        }}
        // onPress={() => console.log(work)}
      >
        {timeSince != "Vous pouvez pointer..." ? `Vous avez pointé` : ""}{" "}
        {timeSince}
      </Text>

      <Card>
        <Card.Title>TOTAL DU MOIS</Card.Title>
        <Card.Divider />
        <View>
          <Text>Total du mois : </Text>
        </View>
      </Card>
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
