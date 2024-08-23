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

        // Split by new lines, skip the header
        const lines = data.split("\n").slice(1);
        // Filter for 500 errors and parse each line
        const errorEntries = lines
            .filter((line) => line.trim()) // Remove empty lines
            .map((line) => {
                const [route, ip, timestamp, responseTime, statusCode] =
                    line.split(", ");
                return {
                    line,
                    responseTime: parseInt(responseTime, 10),
                    statusCode,
                };
            })
            .filter((entry) => entry.statusCode === "500");

        // Reduce to get total response time and format error entries
        const { totalResponseTime, formattedErrors } = errorEntries.reduce(
            (acc, entry) => {
                acc.totalResponseTime += entry.responseTime;
                acc.formattedErrors.push(entry.line);
                return acc;
            },
            { totalResponseTime: 0, formattedErrors: [] },
        );

        // Prepare content to write
        const content =
            formattedErrors.join("\n") +
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
