const fs = require("fs").promises; // Using promises for fs operations
const path = require("path");

// Pure function to process log entries
const processLogEntries = (lines) => {
    // Skip header, filter out empty lines, and process each line
    return lines
        .slice(1)
        .filter(Boolean) // Filter out empty or whitespace lines
        .map((line) => line.split(", "))
        .filter(([, , , , statusCode]) => statusCode === "500")
        .reduce(
            (acc, [, , , responseTime]) => {
                const time = parseInt(responseTime, 10);
                acc.totalTime += time;
                acc.errors.push(line); // Here we keep the original line for output
                return acc;
            },
            { totalTime: 0, errors: [] },
        );
};

// Function to write results
const writeResults = (filePath, results) =>
    fs.writeFile(
        filePath,
        results.errors.join("\n") +
            `\n\nTotal Response Time for 500 errors: ${results.totalTime}ms`,
    );

// Main function to orchestrate the log analysis
async function analyzeLog() {
    const inputPath = path.join(__dirname, "server.log");
    const outputPath = path.join(__dirname, "errors.log");

    try {
        // Read file
        const data = await fs.readFile(inputPath, "utf8");
        const lines = data.split("\n");

        // Process entries
        const results = processLogEntries(lines);

        // Write results
        await writeResults(outputPath, results);
        console.log("Analysis complete. Check errors.log for results.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Execute the analysis
analyzeLog();
