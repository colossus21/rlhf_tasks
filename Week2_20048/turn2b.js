const fs = require("fs");
const path = require("path");

function analyzeLog() {
    const filePath = path.join(__dirname, "server.log");
    const outputPath = path.join(__dirname, "errors.log");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        // Split by new lines, skip the header, and process each line
        const lines = data.split("\n").slice(1);

        const errorEntries = lines
            .filter((line) => line.includes(", 500")) // Filter lines with status code 500
            .map((line) => {
                const [, , , responseTime] = line.split(", ");
                return parseInt(responseTime, 10);
            });
        // Use reduce to sum up all response times for errors
        const totalResponseTime = errorEntries.reduce(
            (sum, time) => sum + time,
            0,
        );

        // Prepare content with original lines for errors
        const content =
            lines.filter((line) => line.includes(", 500")).join("\n") +
            `\n\nTotal Response Time for 500 errors: ${totalResponseTime}ms`;

        // Write to errors.log
        fs.writeFile(outputPath, content, "utf8", (err) => {
            if (err) {
                console.error("Error writing to errors.log:", err);
            } else {
                console.log("Analysis complete. Check errors.log for results.");
            }
        });
    });
}

// Run the function
analyzeLog();
