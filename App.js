import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  Button,
  View,
  Dimensions,
} from "react-native";
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import Todo from "./Todo";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import moment from "moment";

//  dataset needs to be in a state variable

const App = () => {
  const screenWidth = Dimensions.get("window").width;
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([
    { date: moment().format("LL"), amount: 2000 },
    { date: moment().subtract(1, "days").format("LL"), amount: 2500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 3500 },
    { date: moment().subtract(1, "days").format("LL"), amount: 4500 },
    { date: moment().subtract(2, "days").format("LL"), amount: 5500 },
    { date: moment().subtract(2, "days").format("LL"), amount: 5500 },
  ]);

  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    setTransformedData(transformData(groupBy(data, "date")));
  }, [data]);

  const groupBy = (array, key) =>
    array.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});

  const [gigs, setGigs] = useState([
    {
      description: "SSI Ignite David Polson",
      amount: 250.0,
      date: new Date(),
    },
  ]);

  const getDates = () => transformedData.map((pair) => pair.date);
  const getAmounts = () => transformedData.map((pair) => pair.amount);
  const transformData = (groupedData) => {
    const transformedArray = [];

    Object.entries(groupedData).forEach((entry) => {
      const total = entry[1].reduce((total, pair) => total + pair.amount, 0);
      transformedArray.push({
        date: moment(entry[0]).format("DD/MM"),
        amount: total,
      });
    });

    const sortedArray = transformedArray.sort((a, b) =>
      moment(a["date"]).diff(moment(b["date"]))
    );

    return transformedArray;
  };

  console.log("DEBUG 🔥", data);
  console.log("the dates ⏲", getDates());
  console.log("the amounts ⏲", getAmounts());
  console.log(
    "the grouped values are ⏲",
    Object.entries(groupBy(data, "date"))
  );
  console.log(
    "the total grouped value ⏲",
    transformData(groupBy(data, "date"))
  );

  useEffect(() => {
    setTotal(gigs.reduce((total, gig) => total + Number(gig.amount), 0));
  }, [gigs]);

  const addGig = () => {
    setGigs([
      ...gigs,
      {
        description: description,
        amount: amount,
        timestamp: new Date(),
      },
    ]);

    setData([
      ...data,
      {
        date: moment().format("LL"),
        amount: Number(amount),
      },
    ]);

    setDescription("");
    setAmount("");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <View>
            <Text style={styles.titleText}>💵 Income Tracker 💵</Text>
          </View>
          <View style={styles.chartView}>
            <Text style={{ textAlign: "center", fontSize: 20 }}>
              Income Progress
            </Text>
            <LineChart
              data={{
                labels: getDates(),
                datasets: [
                  {
                    data: getAmounts(),
                  },
                ],
              }}
              width={screenWidth} // from react-native
              height={220}
              yAxisLabel="$"
              // yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                // backgroundColor: "#e26a00",
                backgroundGradientFrom: "#38bcf5",
                backgroundGradientTo: "#3b38f5",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          <Text
            style={{
              paddingLeft: 20,
              color: "#b338f5",
              fontSize: 25,
              marginBottom: 15,
            }}
          >
            total Income: ${total.toFixed(2)}
          </Text>
          <TextInput
            style={styles.input}
            value={description}
            placeholder="Enter job description"
            onChangeText={(text) => setDescription(text)}
          />
          <TextInput
            style={styles.input}
            value={amount}
            placeholder="Enter the amount you made in AUD ($)"
            keyboardType="numeric"
            onChangeText={(text) => setAmount(text)}
          />
          <View style={styles.jobButton}>
            <Button
              disabled={!amount || !description}
              onPress={addGig}
              title={"Add Job 🚀"}
              color="#b338f5"
            ></Button>
          </View>
          {gigs.map((gig) => (
            <View>
              <ScrollView>
                <Text>{gig.description}</Text>
                <Text>${gig.amount}</Text>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  titleText: {
    fontSize: 30,
    margin: "auto",
    paddingTop: 10,
    paddingBottom: 25,
    paddingLeft: 30,
    paddingRight: 30,
  },
  input: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    height: 40,
    borderColor: "#3b38f5",
    borderWidth: 1.5,
    borderRadius: 8,
    paddingLeft: 20,
    backgroundColor: "whitesmoke",
  },
  jobButton: {
    margin: "auto",
    width: "40%",
  },
});
