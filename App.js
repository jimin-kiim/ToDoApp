import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    // TouchableHighlight,
    // TouchableWithoutFeedback,
    // Pressable,
    TextInput,
} from "react-native";
import { theme } from "./colors";
import React, { useState } from "react";

export default function App() {
    const [working, setWorking] = useState(true);
    const [text, setText] = useState("");
    const travel = () => setWorking(false);
    const work = () => setWorking(true);
    const onChangeText = (payload) => {
        setText(payload);
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
});
