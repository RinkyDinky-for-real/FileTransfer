import React from "react";
import { View, Text, TextInput } from "react-native";

export default function FileRetriever() {
    return (
        <View style={{ padding: 16, borderWidth: 1, borderColor: '#ccc', borderTopLeftRadius: 8, borderTopRightRadius: 8, 
        backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, 
        shadowRadius: 4, elevation: 2, marginTop: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold',  }}>Recieve a file</Text>
            <TextInput
                placeholder="Enter retrieval PIN"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 8 }}
            />
        </View>
    );
}
