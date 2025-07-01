import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const AddToWatchlistModal = ({
  visible,
  onClose,
  onAdd,
  existingLists,
}) => {
  const [newListName, setNewListName] = useState('');

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add to Watchlist</Text>

          <Text style={styles.subtitle}>Choose Existing List:</Text>
          <FlatList
            data={Object.keys(existingLists)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  onAdd(item);
                  onClose();
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.subtitle}>Or Create New List:</Text>
          <TextInput
            placeholder="New list name"
            value={newListName}
            onChangeText={setNewListName}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (newListName.trim()) {
                onAdd(newListName.trim());
                onClose();
              }
            }}
          >
            <Text style={styles.buttonText}>Create & Add</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ textAlign: 'center', marginTop: 10 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { marginTop: 10, fontWeight: '600' },
  input: {
    borderWidth: 1,
    marginTop: 8,
    padding: 8,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  listItem: {
    padding: 10,
    backgroundColor: '#eee',
    marginTop: 6,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
  },
  buttonText: { color: 'white', textAlign: 'center' },
});

export default AddToWatchlistModal;
