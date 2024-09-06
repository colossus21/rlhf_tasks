const fs = require("fs");
const readline = require("readline");

async function analyzeLogFile() {
  const fileStream = fs.createReadStream("server.log");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let totalResponseTime = 0;
  let errorCount = 0;

  // Skip the header line
  await rl.next();

  for await (const line of rl) {
    const [route, ip, timestamp, responseTime, statusCode] = line.split(", ");

    if (statusCode === "500") {
      totalResponseTime += parseInt(responseTime);
      errorCount++;
    }
  }

  const averageResponseTime =
    errorCount > 0 ? totalResponseTime / errorCount : 0;

  const output =
    `Total 500 errors: ${errorCount}\n` +
    `Total response time for 500 errors: ${totalResponseTime}ms\n` +
    `Average response time for 500 errors: ${averageResponseTime.toFixed(2)}ms`;

  fs.writeFileSync("errors.log", output);
  console.log("Analysis complete. Results written to errors.log");
}

analyzeLogFile().catch(console.error);
