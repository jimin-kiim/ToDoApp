import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from "react-native";
import { theme } from "./colors";
import React, { useEffect, useState } from "react";
import AsnyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    useEffect(() => {
        loadToDos();
    }, []);

    const loadToDos = async () => {
        const s = await AsnyncStorage.getItem(STORAGE_KEY);
        setToDos(JSON.parse(s)); //string=>Javascript object
    };

    const addToDo = async () => {
        if (text == "") {
            return;
        }
        const newToDos = {
            ...toDos,
            [Date.now()]: { text, working },
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };

    const onChangeText = (payload) => setText(payload);

    const saveToDos = async (toSave) => {
        await AsnyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: working ? "white" : theme.grey,
                        }}
                    >
                        Work
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text
                        style={{
                            ...styles.btnText,
                            color: !working ? "white" : theme.grey,
                        }}
                    >
                        Travel
                    </Text>
                </TouchableOpacity>
            </View>

            <TextInput
                returnKeyType="done"
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                value={text}
                placeholder={
                    working ? "Add a To Do" : "Where do you want to go?"
                }
                style={styles.input}
            ></TextInput>
            <ScrollView>
                {toDos !== null
                    ? Object.keys(toDos).map((key) =>
                          toDos[key].working === working ? (
                              <View style={styles.toDo} key={key}>
                                  <Text style={styles.toDoText}>
                                      {toDos[key].text}
                                  </Text>
                              </View>
                          ) : null
                      )
                    : null}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        marginTop: 100,
    },
    btnText: {
        fontSize: 45,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginVertical: 20,
        fontSize: 18,
    },
    toDo: {
        backgroundColor: theme.grey,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
});
