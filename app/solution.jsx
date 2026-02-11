import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const Solution = () => {
  const router = useRouter();

  const { board } = useLocalSearchParams();
  const [currentBoard, setCurrentBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  const startBoard = board ? JSON.parse(board) : [];

  const countMisplaced = (boardState) => {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    let count = 0;

    for (let i = 0; i < boardState.length; i++) {
      if (boardState[i] !== 0 && boardState[i] !== goal[i]) {
        count++;
      }
    }

    return count;
  };

  const getNeighbors = (boardState) => {
    const neighbors = [];
    const zeroIndex = boardState.indexOf(0);

    const row = Math.floor(zeroIndex / 3);
    const col = zeroIndex % 3;

    const moves = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    for (const [r, c] of moves) {
      if (r >= 0 && r < 3 && c >= 0 && c < 3) {
        const newIndex = r * 3 + c;
        const newBoard = [...boardState];
        [newBoard[zeroIndex], newBoard[newIndex]] = [
          newBoard[newIndex],
          newBoard[zeroIndex],
        ];
        neighbors.push(newBoard);
      }
    }
    return neighbors;
  };

  const AstarAsync = (initialBoard, shouldStop) => {
    const goal = "1,2,3,4,5,6,7,8,0";

    const open = [];
    const visited = new Set();

    open.push({
      board: initialBoard,
      g: 0,
      h: countMisplaced(initialBoard),
      f: countMisplaced(initialBoard),
      parent: null,
    });

    return new Promise((resolve) => {
      const processChunk = () => {
        if (shouldStop()) {
          resolve(null);
          return;
        }

        let steps = 0;
        const CHUNK_SIZE = 120;

        while (open.length > 0 && steps < CHUNK_SIZE) {
          if (shouldStop()) {
            resolve(null);
            return;
          }

          open.sort((a, b) => a.f - b.f);

          const current = open.shift();
          const boardString = current.board.toString();

          if (boardString === goal) {
            const path = [];
            let node = current;

            while (node) {
              path.unshift(node.board);
              node = node.parent;
            }

            resolve(path);
            return;
          }

          visited.add(boardString);
          const neighbors = getNeighbors(current.board);

          for (const neighbor of neighbors) {
            const neighborString = neighbor.toString();
            if (visited.has(neighborString)) continue;

            const g = current.g + 1;
            const h = countMisplaced(neighbor);
            const f = g + h;

            open.push({
              board: neighbor,
              g,
              h,
              f,
              parent: current,
            });
          }

          steps++;
        }

        if (open.length === 0) {
          resolve(null);
          return;
        }

        if (!shouldStop()) {
          setTimeout(processChunk, 0);
        } else {
          resolve(null);
        }
      };

      setTimeout(processChunk, 0);
    });
  };

  useEffect(() => {
    let isCancelled = false;
    let interval;

    const solve = async () => {
      setLoading(true);
      console.log("Calculating solution...");
      const solvedPath = await AstarAsync(startBoard, () => isCancelled);

      if (isCancelled) return;

      if (!solvedPath) {
        setLoading(false);
        return;
      }

      let i = 0;
      interval = setInterval(() => {
        if (isCancelled) {
          clearInterval(interval);
          return;
        }

        setCurrentBoard(solvedPath[i]);
        i++;

        if (i >= solvedPath.length) {
          clearInterval(interval);
        }
      }, 1000);

      console.log("Calculated...", solvedPath);
      setLoading(false);
    };

    solve();

    return () => {
      isCancelled = true;
      if (interval) clearInterval(interval);
    };
  }, []);

  const Loader = () => {
    if (!loading) return null;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
          zIndex: 10,
        }}
      >
        <LottieView
          source={require("../assets/Ai-powered marketing tools abstract.json")}
          autoPlay
          loop
          style={{ width: 220, height: 220 }}
        />
        <Text
          style={{
            color: "white",
            marginTop: 20,
            fontSize: 16,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          8-Puzzle is a complex problem which uses A* algorithm to find optimal
          solution.It has a Time Complexity of O(b^d) and Space Complexity of
          O(b^d) thats why it takes time to calculate the solution.
        </Text>
        <Text
          style={{
            color: "white",
            marginTop: 20,
            fontSize: 16,
            textAlign: "center",
            paddingHorizontal: 20,
          }}
        >
          Please wait while we find the optimal solution for you.
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#f3d3aa",
            padding: 10,
            borderRadius: 12,
            margin: 10,
          }}
          onPress={() =>
            router.replace({ pathname: "/", params: { reset: true } })
          }
        >
          <Text
            style={{
              // backgroundColor: "#f3d3aa",
              color: "#82503d",
              fontSize: 16,
              borderRadius: 5,
              padding: 10,
              margin: 0,
              fontWeight: "bold",
            }}
          >
            If you dont want to wait, click here to go back and try a different
            configuration.
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Loader />
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlatList
          data={currentBoard}
          numColumns={3}
          style={{
            marginTop: 90,
            backgroundColor: "#FAEBD7",
            padding: 10,
            borderRadius: 10,
            marginBottom: 550,
          }}
          renderItem={({ item }) => (
            <View
              style={{
                margin: 1,
                width: 60,
                height: 60,
                backgroundColor: item === 0 ? "#714242" : "#f3d3aa",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: "#a66950",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {item === 0 ? "" : item}
              </Text>
            </View>
          )}
        />
      </View>
    </>
  );
};

export default Solution;
