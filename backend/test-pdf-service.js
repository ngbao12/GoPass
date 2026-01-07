/**
 * Test PDF Processing Service
 * Run with: node test-pdf-service.js
 */

const PdfProcessorService = require("./src/services/PdfProcessorService");
const path = require("path");

async function testPdfProcessing() {
  console.log("=".repeat(60));
  console.log("Testing PDF Processing Service");
  console.log("=".repeat(60));

  // Use test JSON output script instead of actual PDF processing
  const testScriptPath = path.join(
    __dirname,
    "src",
    "folder_process_api",
    "test_json_output.py"
  );

  // Mock user ID
  const mockUserId = "test_teacher_123";

  console.log("\n📜 Test Script:", testScriptPath);
  console.log("👤 User ID:", mockUserId);
  console.log("\n" + "=".repeat(60));

  try {
    console.log("\n🚀 Testing Node.js → Python integration...\n");

    // Simulate PDF processing with test script
    const { spawn } = require("child_process");

    const pythonProcess = spawn("python", [testScriptPath], {
      env: {
        ...process.env,
        PYTHONIOENCODING: "utf-8",
      },
    });

    let stdoutData = "";
    let stderrData = "";

    pythonProcess.stdout.on("data", (data) => {
      stdoutData += data.toString("utf8");
    });

    pythonProcess.stderr.on("data", (data) => {
      stderrData += data.toString("utf8");
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        console.error("❌ Python process failed with code:", code);
        console.error("Error:", stderrData);
        process.exit(1);
        return;
      }

      try {
        // Parse JSON output
        const examData = JSON.parse(stdoutData);

        // Transform using PdfProcessorService
        const transformedData = PdfProcessorService.transformExamData(
          examData,
          mockUserId
        );

        console.log("\n" + "=".repeat(60));
        console.log("✅ SUCCESS! Integration test passed");
        console.log("=".repeat(60));
        console.log("\n📊 Statistics:");
        console.log(
          `  - Reading Passages: ${transformedData.readingPassages.length}`
        );
        console.log(`  - Questions: ${transformedData.questions.length}`);
        console.log(`  - Total Points: ${transformedData.stats.totalPoints}`);
        console.log(
          `  - Cloze Questions: ${transformedData.stats.clozeQuestions}`
        );
        console.log(
          `  - Reading Questions: ${transformedData.stats.readingQuestions}`
        );

        console.log("\n📖 Sample Passage:");
        if (transformedData.readingPassages[0]) {
          console.log(`  ID: ${transformedData.readingPassages[0].id}`);
          console.log(
            `  Title: ${transformedData.readingPassages[0].title.substring(
              0,
              60
            )}...`
          );
          console.log(
            `  Content Length: ${transformedData.readingPassages[0].content.length} chars`
          );
        }

        console.log("\n❓ Sample Question:");
        if (transformedData.questions[0]) {
          const q = transformedData.questions[0];
          console.log(`  Content: ${q.content.substring(0, 80)}...`);
          console.log(`  Options: ${q.options.length}`);
          console.log(`  Correct Answer: ${q.correctAnswer}`);
          console.log(`  Tags: ${q.tags.join(", ") || "none"}`);
          console.log(`  Created By: ${q.createdBy}`);
        }

        console.log("\n" + "=".repeat(60));
        console.log("🎉 Node.js ↔ Python integration working!");
        console.log("=".repeat(60));
      } catch (error) {
        console.error("\n❌ Failed to parse JSON:");
        console.error(error.message);
        console.error("\nRaw output:", stdoutData.substring(0, 200));
        process.exit(1);
      }
    });

    pythonProcess.on("error", (error) => {
      console.error("❌ Failed to start Python:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ ERROR during test");
    console.error("=".repeat(60));
    console.error("\nError Details:");
    console.error(error.message);
    console.error("\nStack Trace:");
    console.error(error.stack);
    console.error("\n" + "=".repeat(60));
    process.exit(1);
  }
}

// Run test
testPdfProcessing();
