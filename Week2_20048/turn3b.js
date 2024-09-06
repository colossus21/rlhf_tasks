const fs = require("fs").promises;
const path = require("path");

// Pure function to parse a log line
const parseLine = (line) => {
    const [route, ip, timestamp, responseTime, statusCode] = line.split(", ");
    return {
        route,
        ip,
        timestamp,
        responseTime: parseInt(responseTime, 10),
        statusCode,
    };
};

// Pure function to filter 500 errors
const is500Error = (entry) => entry.statusCode === "500";

// Pure function to format an entry back to string
const formatEntry = (entry) =>
    `${entry.route}, ${entry.ip}, ${entry.timestamp}, ${entry.responseTime}, ${entry.statusCode}`;

// Pure function to calculate total response time
const sumResponseTimes = (entries) =>
    entries.reduce((sum, entry) => sum + entry.responseTime, 0);

// Pure function to format the final output
const formatOutput = (entries, totalTime) =>
    entries.map(formatEntry).join("\n") +
    `\n\nTotal Response Time for 500 errors: ${totalTime}ms`;

// Function to read file (side effect)
const readLogFile = async (filePath) => {
    const data = await fs.readFile(filePath, "utf8");
    return data
        .split("\n")
        .slice(1)
        .filter((line) => line.trim());
};

// Function to write file (side effect)
const writeErrorLog = (filePath, content) =>
    fs.writeFile(filePath, content, "utf8");

// Main function to analyze log
const analyzeLog = async () => {
    const filePath = path.join(__dirname, "server.log");
    const outputPath = path.join(__dirname, "errors.log");

    try {
        const lines = await readLogFile(filePath);

        const errorEntries = lines.map(parseLine).filter(is500Error);

        const totalResponseTime = sumResponseTimes(errorEntries);
        const output = formatOutput(errorEntries, totalResponseTime);

        await writeErrorLog(outputPath, output);
        console.log("Analysis complete. Check errors.log for results.");
    } catch (error) {
        console.error("Error during log analysis:", error);
    }
};

// Run the function
analyzeLog();
