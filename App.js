import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    AsyncStorage,
} from "react-native";
import { theme } from "./colors";
import React, { useEffect, useState } from "react";
import AsnyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";
const WORKING_STATE = "@state";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});
    const [loading, setLoading] = useState(true);
    const travel = () => {
        setWorking(false);
        AsnyncStorage.setItem(WORKING_STATE, "false");
    };
    const work = () => {
        setWorking(true);
        AsnyncStorage.setItem(WORKING_STATE, "true");
    };
    useEffect(() => {
        loadToDos();
    }, []);

    const loadToDos = async () => {
        const s = await AsnyncStorage.getItem(STORAGE_KEY);
        //similar to the local Storage, but it's only for mobile, and handles unencrypted string.
        setToDos(JSON.parse(s)); //string=>Javascript object
        setLoading(false);
        const state = await AsnyncStorage.getItem(WORKING_STATE);
        setWorking(JSON.parse(state));
    };

    const addToDo = async () => {
        if (text == "") {
            return;
        }
        const newToDos = {
            ...toDos,
            [Date.now()]: { text, working, done: "false" },
        };
        setToDos(newToDos);
        await saveToDos(newToDos);
        setText("");
    };

    const onChangeText = (payload) => setText(payload);
    const flipTodoState = (id) => {
        const newToDos = { ...toDos };
        var currentState = newToDos[id].done;
        newToDos[id].done = currentState === "true" ? "false" : "true";
        setToDos(newToDos);
        saveToDos(newToDos);
    };

    const deleteToDo = (id) => {
        Alert.alert("Delete To Do", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "I'm sure",
                style: "destructive",
                onPress: () => {
                    const newToDos = { ...toDos };
                    delete newToDos[id];
                    setToDos(newToDos);
                    saveToDos(newToDos);
                },
            },
        ]);
    };

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
                {toDos !== null ? (
                    loading === true ? (
                        <Text>Loading...</Text>
                    ) : (
                        Object.keys(toDos).map((key) =>
                            toDos[key].working === working ? (
                                <View style={styles.toDo} key={key}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => flipTodoState(key)}
                                        >
                                            <MaterialCommunityIcons
                                                name={
                                                    toDos[key].done === "true"
                                                        ? "checkbox-intermediate"
                                                        : "checkbox-blank-outline"
                                                }
                                                size={24}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={[
                                                styles.toDoText,
                                                toDos[key].done === "true"
                                                    ? styles.doneTodoText
                                                    : null,
                                            ]}
                                        >
                                            {toDos[key].text}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => deleteToDo(key)}
                                    >
                                        <Ionicons
                                            name="ios-trash-outline"
                                            size={17}
                                            color={theme.grey}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : null
                        )
                    )
                ) : null}
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
        backgroundColor: theme.toDoBg,
        marginBottom: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toDoText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
        paddingLeft: 20,
    },
    doneToDoText: {
        textDecorationLine: "line-through",
        color: theme.grey,
    },
});
