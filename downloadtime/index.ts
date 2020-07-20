import * as tf from "@tensorflow/tfjs";

const trainData = {
  sizeMB: [
    0.08,
    9.0,
    0.001,
    0.1,
    8.0,
    5.0,
    0.1,
    6.0,
    0.05,
    0.5,
    0.002,
    2.0,
    0.005,
    10.0,
    0.01,
    7.0,
    6.0,
    5.0,
    1.0,
    1.0,
  ],
  timeSec: [
    0.135,
    0.739,
    0.067,
    0.126,
    0.646,
    0.435,
    0.069,
    0.497,
    0.068,
    0.116,
    0.07,
    0.289,
    0.076,
    0.744,
    0.083,
    0.56,
    0.48,
    0.399,
    0.153,
    0.149,
  ],
};
const testData = {
  sizeMB: [
    5.0,
    0.2,
    0.001,
    9.0,
    0.002,
    0.02,
    0.008,
    4.0,
    0.001,
    1.0,
    0.005,
    0.08,
    0.8,
    0.2,
    0.05,
    7.0,
    0.005,
    0.002,
    8.0,
    0.008,
  ],
  timeSec: [
    0.425,
    0.098,
    0.052,
    0.686,
    0.066,
    0.078,
    0.07,
    0.375,
    0.058,
    0.136,
    0.052,
    0.063,
    0.183,
    0.087,
    0.066,
    0.558,
    0.066,
    0.068,
    0.61,
    0.057,
  ],
};
// tensor like a container of data
// In context of tensor dimension often call axis
// 3 × 4 matrix => shape [3, 4]
// Vector of length 10 => [10]
const trainTensors = {
  sizeMB: tf.tensor2d(trainData.sizeMB, [20, 1]),
  timeSec: tf.tensor2d(trainData.timeSec, [20, 1]),
};

const testTensors = {
  sizeMB: tf.tensor2d(testData.sizeMB, [20, 1]),
  timeSec: tf.tensor2d(testData.timeSec, [20, 1]),
};

console.log(trainTensors);
console.log(testTensors);

// Function take feature input return prediction known as Model | Network

const model = tf.sequential();

// Add layer
model.add(
  tf.layers.dense({
    inputShape: [1],
    units: 1, // Output size of dimension
  })
);

model.compile({ optimizer: "sgd", loss: "meanAbsoluteError" });

// Train 10 time on data set
(async function () {
  await model.fit(trainTensors.sizeMB, trainTensors.timeSec, { epochs: 200 });
  console.log("Model training 's done");

  // Evaluate training model
  const evaluated = model
    .evaluate(testTensors.sizeMB, testTensors.timeSec)
    .toString();
  console.log(`Evaluated: ${evaluated}`);

  /// Predict

  const smallFileMB = 1;
  const bigFileMB = 100;
  const hugeFileMB = 10000;

  const prediction = model
    .predict(tf.tensor2d([[smallFileMB], [bigFileMB], [hugeFileMB]]))
    .toString();

  console.log(`Prediction: ${prediction}`);
})();

const avgDelaySec = tf.mean(trainData.timeSec);
avgDelaySec.print();

// Calculate MAE => Raw
testTensors.timeSec.sub(0.295).abs().mean().print();
