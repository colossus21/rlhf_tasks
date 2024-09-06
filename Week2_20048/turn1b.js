const fs = require("fs");
const path = require("path");

function analyzeLog() {
    const filePath = path.join(__dirname, "server.log");
    const outputPath = path.join(__dirname, "errors.log");

    // Read the file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        // Split by new lines, skip the header
        const lines = data.split("\n").slice(1);

        let totalResponseTime = 0;
        let errorEntries = [];

        // Process each line
        lines.forEach((line) => {
            if (line.trim()) {
                // Check if line is not empty
                const [route, ip, timestamp, responseTime, statusCode] =
                    line.split(", ");
                if (statusCode === "500") {
                    totalResponseTime += parseInt(responseTime, 10);
                    errorEntries.push(line);
                }
            }
        });

        // Prepare content to write
        const content =
            errorEntries.join("\n") +
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
