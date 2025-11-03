import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function FileRetriever() {
    const [pinValue, setPinValue] = useState("");

    const handleRetrieveFile = () => {
        // Her skal det være logikk for inputfelt 
    }

    return (
        <View style={{ padding: 16, borderColor: '#ccc', borderTopLeftRadius: 14, borderTopRightRadius: 14, 
        backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, 
        shadowRadius: 4, elevation: 2}}>
            <Text style={{ fontSize: 16, fontWeight: 'bold',  }}>Recieve a file</Text>
            <TextInput
                placeholder="Enter retrieval PIN"
                style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginTop: 8 }}
                value={pinValue}
                onChangeText={setPinValue}
            />
            <Button title="Retrieve File" onPress={handleRetrieveFile} />
        </View>
    );
}
