import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Header, ListItem, Divider, Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

import moment, { now } from "moment";
import "moment/locale/fr";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Calendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

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

export default function CalendrierScreen() {
  const [daySelected, setDaySelected] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState();
  const [work, setWork] = useState(["fake"]);
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalVisible, setTotalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);

  const [mode, setMode] = useState("time");
  const [show, setShow] = useState(true);

  useInterval(() => {
    if (selectedDate && modalVisible == false) {
      showListData(String(moment(selectedDate).format("DD/MM/YYYY")));
    }
  }, 1000);

  useEffect(() => {
    AsyncStorage.getItem(
      `workData${String(moment(selectedDate).format("DD/MM/YYYY"))}`,
      function (error, data) {
        if (data) {
          var dataInit = JSON.parse(data);
          setWork(dataInit);
        }
      }
    );
    if (selectedDate) {
      showListData(String(moment(selectedDate).format("DD/MM/YYYY")));
    }
  }, [refresh]);

  const onChangeDebut = (event, selectedDateTime) => {
    const currentDate = selectedDateTime;
    setShow(Platform.OS === "ios");
    console.log(currentDate);
    work[index].startTime = new Date(currentDate);
    work[index].duration =
      moment(work[index].endTime) - moment(work[index].startTime);
    saveWork();
  };

  const calculDuMois = () => {
    var total = 0;
    setTotalDuration(0);
    for (i = 0; i < 31; i++) {
      AsyncStorage.getItem(
        `workData${i < 9 ? "0" : ""}${String(i + 1)}/${String(
          moment(selectedDate).format("MM/YYYY")
        )}`,
        function (error, data) {
          if (data) {
            var dataInit = JSON.parse(data);
            for (y = 0; y < dataInit.length; y++) {
              total = total + dataInit[y].duration;
              setTotalDuration(total);
            }
          }
        }
      );
    }
  };

  const changerDeMois = (month) => {
    var total = 0;
    setTotalDuration(0);
    for (i = 0; i < 31; i++) {
      AsyncStorage.getItem(
        `workData${i < 9 ? "0" : ""}${String(i + 1)}/${
          month < 10 ? "0" : ""
        }${month}/${String(moment().format("YYYY"))}`,
        function (error, data) {
          if (data) {
            var dataInit = JSON.parse(data);
            for (i = 0; i < dataInit.length; i++) {
              total = total + dataInit[i].duration;
              setTotalDuration(total);
            }
          }
        }
      );
    }
  };

  const onChangeFin = (event, selectedDateTime) => {
    const currentDate = selectedDateTime;
    setShow(Platform.OS === "ios");
    console.log(currentDate);
    work[index].endTime = new Date(currentDate);
    work[index].duration =
      moment(work[index].endTime) - moment(work[index].startTime);
    saveWork();
  };

  const saveWork = () => {
    AsyncStorage.setItem(
      `workData${String(moment(selectedDate).format("DD/MM/YYYY"))}`,
      JSON.stringify(work)
    );
  };

  const showListData = (day) => {
    AsyncStorage.getItem(`workData${day}`, function (error, data) {
      if (data) {
        var dateData = JSON.parse(data);
        setWork(dateData);
        setDaySelected(
          dateData.map((data, i) => (
            <ListItem
              key={i}
              // bottomDivider
              containerStyle={{
                borderWidth: 3,
                borderColor: "#31A390",
                borderRadius: 7,
                margin: 3,
              }}
              onPress={() => {
                if (data.duration) {
                  console.log(i);
                  setIndex(i);
                  setModalVisible(!modalVisible);
                }
              }}
            >
              <ListItem.Content>
                <ListItem.Title>
                  <Text style={styles.textgras}>
                    Durée :{" "}
                    {data.duration
                      ? moment.utc(data.duration).format("HH:mm")
                      : "En cours..."}
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text style={styles.textgrasDebut}>Heure de début :</Text>{" "}
                  {moment(data.startTime).format("LT")}
                  <Text style={styles.textgrasFin}>
                    {"      "}
                    Heure de fin :
                  </Text>{" "}
                  {data.endTime
                    ? moment(data.endTime).format("LT")
                    : "En cours"}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))
        );
      } else {
        setDaySelected(
          <Text
            style={{
              textAlign: "center",
              marginTop: 30,
              fontSize: 30,
              color: "#F47C5D",
              marginBottom: 20,
            }}
          >
            Rien à afficher
          </Text>
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header
        barStyle="default"
        centerComponent={{
          text: `CALENDRIER ${moment(selectedDate).format("DD/MM/YYYY")}`,
          style: { color: "#fff" },
        }}
        containerStyle={{ width: "100%", backgroundColor: "#31A390" }}
        placement="center"
      />
      <Calendar
        style={{}}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#31A390",
          },
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          showListData(moment(day.dateString).format("DD/MM/YYYY"));
          calculDuMois();
        }}
        onMonthChange={(month) => {
          console.log(month);
          changerDeMois(month.month);
          setSelectedDate("");
          setDaySelected(
            <Text
              style={{
                textAlign: "center",
                marginTop: 30,
                fontSize: 30,
                color: "#F47C5D",
                marginBottom: 20,
              }}
            >
              Rien à afficher
            </Text>
          );
        }}
      />
      <Divider orientation="horizontal" />

      <ScrollView style={{ paddingTop: 5 }}>
        <Button
          style={
            (styles.button,
            {
              width: 300,
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 10,
              marginBottom: 10,
            })
          }
          buttonStyle={{ backgroundColor: "#31A390" }}
          onPress={() => {
            setTotalVisible(!totalVisible);
          }}
          title="Calcul du total du mois"
        />
        {daySelected}
        <Text style={{ textAlign: "center" }}> </Text>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={totalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "black",
                marginBottom: 10,
              }}
            >
              Total du mois :
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "black",
                fontWeight: "bold",
                color: "#F47C5D",
                marginBottom: 20,
              }}
            >
              {moment.utc(totalDuration).format("HH:mm")}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setRefresh(!refresh);
                setTotalVisible(!totalVisible);
                showListData(String(moment(selectedDate).format("DD/MM/YYYY")));
              }}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={{
                borderRadius: 20,
                padding: 5,
                elevation: 2,
                backgroundColor: "#c91010",
                marginBottom: 15,
              }}
              onPress={() => {
                if (work.length == 1) {
                  console.log("suppression du local store");
                  AsyncStorage.removeItem(
                    `workData${String(
                      moment(selectedDate).format("DD/MM/YYYY")
                    )}`
                  );
                } else {
                  work.splice(index, 1);
                  setIndex(0);
                  saveWork();
                  showListData(
                    String(moment(selectedDate).format("DD/MM/YYYY"))
                  );
                  console.log(
                    String(moment(selectedDate).format("DD/MM/YYYY"))
                  );
                }
                setRefresh(!refresh);
                setModalVisible(!modalVisible);
                showListData(String(moment(selectedDate).format("DD/MM/YYYY")));
              }}
            >
              <Text style={styles.textStyle}>Supprimer</Text>
            </Pressable>
            {/* <Text>Heure de début :</Text> */}

            <DateTimePicker
              style={{
                width: 250,
                // marginBottom: 15,
                // marginLeft: 25,
                flex: "center",
              }}
              testID="dateTimePicker"
              value={work[index].startTime || ""}
              mode={mode}
              is24Hour={true}
              display="spinner"
              onChange={onChangeDebut}
            />
            {/* <Text>Heure de fin :</Text> */}

            <DateTimePicker
              style={{
                width: 250,
                // marginBottom: 15,
                // marginLeft: 25,
              }}
              testID="dateTimePicker"
              value={work[index].endTime || ""}
              mode={mode}
              is24Hour={true}
              display="spinner"
              onChange={onChangeFin}
            />
            <Text></Text>
            <Text></Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setRefresh(!refresh);
                setModalVisible(!modalVisible);
                showListData(String(moment(selectedDate).format("DD/MM/YYYY")));
                calculDuMois();
              }}
            >
              <Text style={styles.textStyle}>Fermer</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  textgras: {
    fontWeight: "bold",
  },
  textgrasDebut: {
    fontWeight: "bold",
    color: "#31A390",
  },
  textgrasFin: {
    fontWeight: "bold",
    color: "#F47C5D",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    // justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#31A390",
  },
  buttonCloseDelete: {
    backgroundColor: "#c91010",
    marginBottom: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalText: {
    marginBottom: 15,
    // textAlign: "center",
  },
});
