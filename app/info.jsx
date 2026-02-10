import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebase";

export default function Info() {
  const router = useRouter();
  const { time, steps } = useLocalSearchParams();
  const [scores, setScores] = useState([]);
  const board = [1, 2, 3, 4, 5, 6, 7, 8, 0];

  const fetchLeaderboard = async () => {
    const q = query(collection(db, "leaderboard"));
    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setScores(data);
  };

  const saveOrUpdateScore = async (name, steps, time) => {
    const q = query(
      collection(db, "leaderboard"),
      where("name", "==", name),
      orderBy("steps", "asc"),
      orderBy("time", "asc"),
    );

    const snap = await getDocs(q);

    // name not found → add new
    if (snap.empty) {
      await addDoc(collection(db, "leaderboard"), {
        name,
        steps,
        time,
        createdAt: serverTimestamp(),
      });
      return;
    }

    // ✅ name exists → compare scores
    const oldDoc = snap.docs[0];
    const oldData = oldDoc.data();

    const isBetter =
      steps < oldData.steps || (steps === oldData.steps && time < oldData.time);

    if (isBetter) {
      await updateDoc(doc(db, "leaderboard", oldDoc.id), {
        steps,
        time,
        updatedAt: serverTimestamp(),
      });
    }
  };

  useEffect(() => {
    const run = async () => {
      const name = await AsyncStorage.getItem("name");
      if (!name) return;

      await saveOrUpdateScore(name, Number(steps ?? 0), Number(time ?? 0));

      await fetchLeaderboard();
    };

    run();
  }, []);

  console.log("Data: ", scores);

  return (
    <>
      <View
        style={{
          backgroundColor: "black",
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FlatList
          data={board}
          numColumns={3}
          style={{
            marginTop: 90,
            backgroundColor: "#FAEBD7",
            padding: 10,
            borderRadius: 10,
          }}
          renderItem={({ item, index }) => (
            <View
              style={{
                margin: 1,
                width: 60,
                height: 60,
                backgroundColor: item == 0 ? "black" : "#FAEBD7",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "black",
              }}
            >
              <Text>{item == 0 ? "" : item}</Text>
            </View>
          )}
        />

        <View
          style={{
            marginVertical: 0,
            flexDirection: "row",
            margin: 20,
            // justifyContent: "flex-end",
            // alignItems: "baseline",
          }}
        >
          <Text
            style={{
              backgroundColor: "#FAEBD7",
              color: "black",
              fontSize: 20,
              borderRadius: 5,
              padding: 5,
              margin: 5,
            }}
          >
            Steps: {steps}
          </Text>
          <Text
            style={{
              backgroundColor: "#FAEBD7",
              color: "black",
              fontSize: 20,
              borderRadius: 5,
              padding: 5,
              margin: 5,
            }}
          >
            Time: {time}
          </Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "#FAEBD7", padding: 10, borderRadius: 12 }}
          onPress={() =>
            router.push({ pathname: "/", params: { reset: true } })
          }
        >
          <Text style={{ color: "black", fontSize: 20 }}>Play Again?</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          // justifyContent: "center",
          // alignItems: "center",
          backgroundColor: "rgb(0, 0, 0)",
        }}
      >
        <View
          style={{
            backgroundColor: "#FAEBD7",
            color: "black",
            fontSize: 20,
            borderRadius: 5,
            padding: 5,
            margin: 5,
            marginBottom: 20,
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 2 }}>
            <Text style={{ color: "black", fontSize: 20 }}>Leaderboard</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              padding: 5,
              borderBottomWidth: 2,
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: "black", fontSize: 16 }}>Position</Text>
            <Text style={{ color: "black", fontSize: 16 }}>Name</Text>
            <Text style={{ color: "black", fontSize: 16 }}>Steps</Text>
            <Text style={{ color: "black", fontSize: 16 }}>Time</Text>
          </View>
          <FlatList
            data={scores}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  borderBottomWidth: 1,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={{ color: "black", fontSize: 16 }}>
                    #{index + 1}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "black", fontSize: 16 }}>
                    {item.name}
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "black", fontSize: 16 }}>
                    {item.steps} steps
                  </Text>
                </View>
                <View>
                  <Text style={{ color: "black", fontSize: 16 }}>
                    {item.time}s
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
}
