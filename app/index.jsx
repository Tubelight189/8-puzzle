import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [board, setBoard] = useState([]);
  const router = useRouter();
  const { reset } = useLocalSearchParams();
  const DummyBoard = [1, 2, 3, 4, 5, 6, 7, 0, 8];
  const isSolvable = (arr) => {
    let inv = 0;

    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
          inv++;
        }
      }
    }

    // 3x3 puzzle → even inversions = solvable
    return inv % 2 === 0;
  };

  const randBoard = () => {
    let arr;
    do {
      arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (!isSolvable(arr));

    setBoard(arr);
  };

  useEffect(() => {
    randBoard();
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem("isLoggedIn");
      if (!loggedIn) router.replace("/login");
    };
    checkLogin();
  });
  const originalBoard = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const getRowCol = (index) => {
    return { row: Math.floor(index / 3), col: index % 3 };
  };
  const isSolved = (board) => {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    return board.every((value, index) => value === goal[index]);
  };

  const reset_game = () => {
    setTime(0);
    setSteps(0);
    randBoard();
  };
  useEffect(() => {
    if (board.length === 9 && isSolved(board)) {
      router.push({
        pathname: "/info",
        params: { time: time, steps: steps.toString() },
      });
    }
  }, [board]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const is_adj = (p1, p2) => {
    const a = getRowCol(p1),
      b = getRowCol(p2);
    if (Math.abs(a.row - b.row) + Math.abs(a.col - b.col) == 1) {
      return true;
    }
    return false;
  };

  const on_tile_press = (index) => {
    const voidTile = board.indexOf(0);
    if (is_adj(index, voidTile)) {
      const newBoard = [...board];
      newBoard[voidTile] = board[index];
      newBoard[index] = 0;
      setBoard(newBoard);
      setSteps((prev) => prev + 1);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <View
        style={{
          marginVertical: 70,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
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

      <View
        style={{
          marginTop: -80,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        {/* Game Board */}
        <View
          style={{
            marginVertical: 265,
            backgroundColor: "#FAEBD7",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <FlatList
            data={board}
            numColumns={3}
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
                <TouchableOpacity
                  onPress={() => on_tile_press(index)}
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: item === 0 ? "#000" : "#FAEBD7",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                  }}
                >
                  <Text>{item == 0 ? "" : item}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 100,
            marginTop: -20,
          }}
        >
          <TouchableOpacity
            style={{
              marginTop: -40,
              backgroundColor: "#FAEBD7",
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => reset_game()}
          >
            <AntDesign name="reload" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginTop: -40,
              backgroundColor: "#FAEBD7",
              padding: 5,
              borderRadius: 5,
            }}
            onPress={() => router.push("/info")}
          >
            <AntDesign name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
